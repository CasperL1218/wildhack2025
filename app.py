from flask import Flask, request, jsonify, redirect, render_template, make_response, session, abort, url_for
from flask_cors import CORS  # Import CORS
from services import extract_text, scan_food, sustainable_recipe, seasonal_recipe, ingredient_list, final_recipe
import json
import secrets
from functools import wraps
import firebase_admin
from firebase_admin import credentials, firestore, auth
from datetime import timedelta
import os
from dotenv import load_dotenv
from flask_cors import CORS  # Import CORS

load_dotenv()
app = Flask(__name__)
# Enable CORS with specific settings
CORS(app, resources={r"/*": {"origins": "*", "allow_headers": ["Content-Type", "Accept"], "methods": ["GET", "POST", "OPTIONS"]}})

# Handle OPTIONS requests explicitly
@app.route('/', defaults={'path': ''}, methods=['OPTIONS'])
@app.route('/<path:path>', methods=['OPTIONS'])
def handle_options(path):
    response = make_response()
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Accept')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    return response

CORS(app)

# Fetch or create user by ID
@app.route('/users/fetch/<user_id>', methods=['POST'])
def fetch_user(user_id):
    try:
        # Check if user exists
        user_doc = db.collection('users').document(user_id).get()
        
        if user_doc.exists:
            # User exists, return user data
            user_data = user_doc.to_dict()
            return jsonify({"success": True, "data": user_data, "existing": True})
        else:
            # User doesn't exist, create new user
            data = request.get_json() or {}
            
            # Check required fields for new user
            if 'userEmail' not in data or 'userName' not in data:
                return jsonify({"success": False, "error": "Missing required fields for new user: userEmail and userName"}), 400
            
            # Create user document in Firestore
            user_ref = db.collection('users').document(user_id)
            
            # Set user data
            user_data = {
                "userId": user_id,
                "userEmail": data['userEmail'],
                "userName": data['userName'],
                "numRecipe": 0,
                "streak": 0
                # Add other default fields as needed
            }
            
            user_ref.set(user_data)
            
            return jsonify({"success": True, "data": user_data, "existing": False}), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/extract-text', methods=['POST'])
def extract_text_endpoint():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"})
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"})
    
    try:
        # Call the scan_food function with the uploaded file
        result = extract_text(file)
        # return jsonify(result)
        return jsonify({"response": result})
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/scan-food', methods=['POST'])
def scan_food_endpoint():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"})
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"})
    
    # Grab optional inputs
    menu_text = request.form.get('menu_text')
    user_text = request.form.get('user_text')
    zipcode = request.form.get('zipcode', '60201') #default Evanston
    
    # ingredient_list = "none"

    try:
        # Call the scan_food function with the uploaded file
        scan_result = scan_food(file, menu_text=menu_text, user_text=user_text)

        # Pass that into the sustainable recipe generator
        sustainable_result = sustainable_recipe(scan_result)

        # Pass that into the sustainable recipe generator
        seasonal_result = seasonal_recipe(scan_result, zipcode)

        #Pass into ingredient info
        # if isinstance(scan_result, str):
        #     start_index = scan_result.find('"ingredients": [')
        #     end_index = scan_result.find('"recipe"')
        #     ingredients = scan_result[start_index + len('"ingredients": ['):end_index].strip()
        #     # ingredients_cleaned = ingredients.replace('],', '').replace('\\n', '').replace('\n', '').strip()
        #     # ingredients_array = ingredients_cleaned.split(",")

        #     ingredient_list = ingredient_info(ingredients)

        original_ingredient_info = ingredient_list(scan_result)
        sustainable_ingredient_info = ingredient_list(sustainable_result)
        seasonal_ingredient_info = ingredient_list(seasonal_result)

        # Step 3: Return both
        return jsonify({
            "original_result": scan_result,
            "original_ingredient_info": original_ingredient_info,
            "sustainable_result": sustainable_result,
            "sustainable_ingredient_info": sustainable_ingredient_info,
            "seasonal_result": seasonal_result,
            "seasonal_ingredient_info": seasonal_ingredient_info,
        })

    except Exception as e:
        return jsonify({"error": str(e)})
    

@app.route('/final-recipe', methods=['POST'])
def final_recipe_endpoint():
    try:
        if request.is_json:
            data = request.get_json()
            data_str = json.dumps(data)
        else:
            return jsonify({"error": "No valid input provided"}), 400
        
        result = final_recipe(data_str)

        return jsonify({"response": result})
    except Exception as e:
        return jsonify({"error": str(e)})

# Create a new recipe
@app.route('/recipes', methods=['POST'])
def create_recipe():
    try:
        data = request.get_json()
        
        # Check required fields
        if not data or 'dishName' not in data or 'ingredients' not in data or 'recipeSteps' not in data or 'userId' not in data:
            return jsonify({"success": False, "error": "Missing required fields: dishName, ingredients, recipeSteps, and userId"}), 400
        
        # Validate route field if provided
        route = data.get('route', 'original')  # Default to 'original' if not provided
        valid_routes = ['original', 'local', 'sustainable']
        if route not in valid_routes:
            return jsonify({"success": False, "error": f"Invalid route value. Must be one of: {', '.join(valid_routes)}"}), 400
        
        user_id = data['userId']
        # Check if user exists
        user_ref = db.collection('users').document(user_id)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            return jsonify({"success": False, "error": f"User with ID {user_id} does not exist. Please create the user first."}), 404
        
        # Create recipe document in Firestore
        recipe_ref = db.collection('recipes').document()
        
        # Set recipe data with timestamp handled separately
        recipe_data = {
            "dishName": data['dishName'],
            "ingredients": data['ingredients'],
            "recipeSteps": data['recipeSteps'],
            "userId": data['userId'],
            "route": route,  # Add the route field
        }
        
        # Add timestamp in Firestore but don't include in response
        firestore_data = recipe_data.copy()
        firestore_data["createdAt"] = firestore.SERVER_TIMESTAMP
        recipe_ref.set(firestore_data)
        
        # Update user's recipe count
        user_data = user_doc.to_dict()
        current_count = user_data.get('numRecipe', 0)
        user_ref.update({"numRecipe": current_count + 1})
        
        return jsonify({"success": True, "data": recipe_data, "id": recipe_ref.id}), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# Get recipes by user ID
@app.route('/recipes/user/<user_id>', methods=['GET'])
def get_recipes_by_user(user_id):
    try:
        # Query recipes collection where userId matches
        recipes_query = db.collection('recipes').where('userId', '==', user_id)
        

        # Execute query
        recipes_results = recipes_query.stream()
        
        recipes = []
        for doc in recipes_results:
            recipe_data = doc.to_dict()
            recipe_data['id'] = doc.id
            recipes.append(recipe_data)
        
        return jsonify({"success": True, "data": recipes})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# Get a user's most common recipe route
@app.route('/users/<user_id>/most-common-route', methods=['GET'])
def get_most_common_route(user_id):
    try:
        # Check if user exists
        user_doc = db.collection('users').document(user_id).get()
        
        if not user_doc.exists:
            return jsonify({"success": False, "error": f"User with ID {user_id} does not exist"}), 404
        
        # Query recipes collection where userId matches
        recipes_query = db.collection('recipes').where('userId', '==', user_id).stream()
        
        # Count occurrences of each route
        route_counts = {
            'original': 0,
            'local': 0,
            'sustainable': 0
        }
        
        total_recipes = 0
        for doc in recipes_query:
            recipe_data = doc.to_dict()
            route = recipe_data.get('route', 'original')
            if route in route_counts:
                route_counts[route] += 1
                total_recipes += 1
        
        if total_recipes == 0:
            # No recipes found, default to 'original'
            most_common_route = 'original'
            most_common_count = 0
        else:
            # Find the route with the highest count
            most_common_route = 'original'  # Default in case of tie
            most_common_count = 0
            
            for route, count in route_counts.items():
                if count > most_common_count:
                    most_common_route = route
                    most_common_count = count
        
        # Calculate percentage if there are recipes
        percentage = (most_common_count / total_recipes * 100) if total_recipes > 0 else 0
        
        return jsonify({
            "success": True,
            "data": {
                "userId": user_id,
                "mostCommonRoute": most_common_route,
                "count": most_common_count,
                "totalRecipes": total_recipes,
                "percentage": round(percentage, 2),
                "routeCounts": route_counts
            }
        })
            
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

       

if __name__ == "__main__":
    app.run(debug=True)