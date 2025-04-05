# import streamlit as st
import os

from PIL import Image
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

model = genai.GenerativeModel('gemini-pro-vision')

def get_gemini_response(input, image, prompt):
    try:
        response = model.generate_content([input, image[0], prompt])
        return response.text
    except Exception as e:
        return f"Error: {str(e)}"

def input_image_details(uploaded_file):
    if uploaded_file is not None:
        bytes_data = uploaded_file.file.read()
        image_parts = [
            {
                "mime_type": uploaded_file.type,
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
        
        if "error" in response:
            return response  # Return any error message from the response
        return response

    except FileNotFoundError:
        return {"error": "No image file uploaded"}
    except Exception as e:
        return {"error": str(e)}