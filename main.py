from flask import Flask, request, jsonify
import os

from PIL import Image
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

model = genai.GenerativeModel('gemini-1.5-flash')

app = Flask(__name__)

def get_gemini_response(input, image, prompt):
    try:
        response = model.generate_content([input, image[0], prompt])
        return response
    except Exception as e:
        return f"Error: {str(e)}"

def input_image_details(uploaded_file):
    if uploaded_file is not None:
        bytes_data = uploaded_file.read()
        image_parts = [
            {
                "mime_type": uploaded_file.content_type,
                "data": bytes_data
            }
        ]
        return image_parts
    else:
        raise FileNotFoundError("No file uploaded")


def scan_food(uploaded_file):
    input_prompt = """
    Identify the food dish in the image. 
    Provide a JSON response with the following details:
    {
        "food_name": str, 
        "description": str,
        "ingredients": list[str],
        "recipe": str
    }
    """

    try:
        # Process the uploaded image
        image_data = input_image_details(uploaded_file)
        # Get the response from the generative model
        response = get_gemini_response(input_prompt, image_data, input_prompt)
        
        if isinstance(response, str):
            return response  # Return if it's already a string
        else:
            return str(response)  # Convert the response to a string

    except FileNotFoundError:
        return {"error": "No image file uploaded"}
    except Exception as e:
        return {"error": str(e)}
    

@app.route('/scan-food', methods=['POST'])
def scan_food_endpoint():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"})
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"})
    
    try:
        # Call the scan_food function with the uploaded file
        result = scan_food(file)
        # return jsonify(result)
        return jsonify({"response": result})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)