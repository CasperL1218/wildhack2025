from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from services import extract_text, scan_food, sustainable_recipe, seasonal_recipe, ingredient_list, final_recipe
import json

app = Flask(__name__)

CORS(app)

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