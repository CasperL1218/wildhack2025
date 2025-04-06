from flask import Flask, redirect, render_template, request, make_response, session, abort, jsonify, url_for
import secrets
from services import extract_text, scan_food, sustainable_recipe, seasonal_recipe, ingredient_list, final_recipe
import json
import firebase_admin
from firebase_admin import credentials, firestore, auth
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY')

cred = credentials.Certificate("firebase-auth.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

@app.route('/users/<user_id>', methods=['GET'])
def get_user(user_id):
    """
    Get user data from Firestore by user ID
    """
    try:
        # Get user document from Firestore
        user_ref = db.collection('users').document(user_id)
        user_doc = user_ref.get()
        
        # Check if user exists
        if not user_doc.exists:
            return jsonify({
                'status': 'error',
                'message': f'User not found with ID: {user_id}'
            }), 404
            
        # Return user data
        user_data = user_doc.to_dict()
        return jsonify(user_data)
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Error retrieving user data: {str(e)}'
        }), 500

@app.route('/users/<user_id>', methods=['POST'])
def create_user(user_id):
    """
    Create or update user data in Firestore
    """
    try:
        # Validate request body
        if not request.is_json:
            return jsonify({
                'status': 'error',
                'message': 'Request must be JSON'
            }), 400
            
        user_data = request.get_json()
        
        # Validate required fields
        required_fields = ['userName', 'userEmail']
        for field in required_fields:
            if field not in user_data:
                return jsonify({
                    'status': 'error',
                    'message': f'Missing required field: {field}'
                }), 400
        
        # Ensure userId matches the URL parameter
        user_data['userId'] = user_id
        
        # Set default values if not provided
        if 'numRecipe' not in user_data:
            user_data['numRecipe'] = 0
            
        if 'streak' not in user_data:
            user_data['streak'] = 0
            
        # Add timestamps
        user_data['updated_at'] = firestore.SERVER_TIMESTAMP
        
        # If this is a new user, add created_at timestamp
        user_ref = db.collection('users').document(user_id)
        user_doc = user_ref.get()
        if not user_doc.exists:
            user_data['created_at'] = firestore.SERVER_TIMESTAMP
            
        # Update or create user document
        user_ref.set(user_data, merge=True)
        
        return jsonify({
            'status': 'success',
            'message': f'User data saved successfully for ID: {user_id}'
        }), 200
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Error saving user data: {str(e)}'
        }), 500

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

if __name__ == "__main__":
    app.run(debug=True)