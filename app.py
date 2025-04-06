from flask import Flask, request, jsonify, redirect, render_template, make_response, session, abort, url_for
from services import extract_text, scan_food, sustainable_recipe, seasonal_recipe, ingredient_list, final_recipe
import json
import secrets
from functools import wraps
import firebase_admin
from firebase_admin import credentials, firestore, auth
from datetime import timedelta
import os
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)

cred = credentials.Certificate("firebase-auth.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Get user data by userId
@app.route('/users/<user_id>', methods=['GET'])
def get_user(user_id):
    try:
        # Get user document from Firestore
        user_doc = db.collection('users').document(user_id).get()
        
        if user_doc.exists:
            user_data = user_doc.to_dict()
            return jsonify({"success": True, "data": user_data})
        else:
            return jsonify({"success": False, "error": "User not found"}), 404
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# Create a new user
@app.route('/users', methods=['POST'])
def create_user():
    try:
        data = request.get_json()
        
        # Check required fields
        if not data or 'userId' not in data or 'userEmail' not in data or 'userName' not in data:
            return jsonify({"success": False, "error": "Missing required fields: userId, userEmail, and userName"}), 400
        
        user_id = data['userId']
        email = data['userEmail']
        name = data['userName']
        
        # Create user document in Firestore
        user_ref = db.collection('users').document(user_id)
        
        # Check if user already exists
        if user_ref.get().exists:
            return jsonify({"success": False, "error": "User ID already exists"}), 409
        
        # Set user data
        user_data = {
            "userId": user_id,
            "userEmail": email,
            "userName": name,
            "numRecipe": 0,
            "streak": 0
            # Add other default fields as needed
        }
        
        user_ref.set(user_data)
        
        return jsonify({"success": True, "data": user_data}), 201
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
        
        # Create recipe document in Firestore
        recipe_ref = db.collection('recipes').document()
        
        # Set recipe data with timestamp handled separately
        recipe_data = {
            "dishName": data['dishName'],
            "ingredients": data['ingredients'],
            "recipeSteps": data['recipeSteps'],
            "userId": data['userId'],
        }
        
        # Add timestamp in Firestore but don't include in response
        firestore_data = recipe_data.copy()
        firestore_data["createdAt"] = firestore.SERVER_TIMESTAMP
        recipe_ref.set(firestore_data)
        
        # Update user's recipe count
        user_ref = db.collection('users').document(data['userId'])
        user_doc = user_ref.get()
        
        if user_doc.exists:
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
        recipes_query = db.collection('recipes').where('userId', '==', user_id).stream()
        
        recipes = []
        for doc in recipes_query:
            recipe_data = doc.to_dict()
            recipe_data['id'] = doc.id
            recipes.append(recipe_data)
        
        return jsonify({"success": True, "data": recipes})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)