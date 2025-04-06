from flask import Flask, request, jsonify, send_file
import os

from PIL import Image
import google.generativeai as genai
from dotenv import load_dotenv
import json

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

model = genai.GenerativeModel('gemini-1.5-flash')

# app = Flask(__name__)

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


def extract_text(uploaded_file):
    input_prompt = """
        Extract the text getting menu description of food
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

def scan_food(uploaded_file, menu_text=None, user_text=None):
    base_prompt = """
        Identify the food dish in the image. 
        Provide a JSON response with the following details:
        {
            "food_name": str, 
            "description": str,
            "ingredients": list[str],
            "recipe": str
        }
        """
    
    context = ""
    if menu_text:
        context += f"This is the menu description of the dish: {menu_text}\n"
    if user_text:
        context += f"This is the user description of the dish: {user_text}\n"

    input_prompt = context + base_prompt
        

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

def sustainable_recipe(data):
 
    input_prompt = """
    Create a recipe based on the original recipe provided. Prioritize ingredients that
    are more sustainable, focusing on lower carbon emissions and water use during production.
    Replace produce and other ingredients with alternatives that minimize environmental
    impact while maintaining the core character of the dish.

    Constraints:
    * If no suitable sustainable replacements can be made, use the original ingredient.
    * The recipe must remain the same food that was input.

    Output a JSON response with the following details:
    {
        "food_name": str, // The name of the dish.
        "ingredients": list[str], // A list of ingredients, reflecting any sustainable changes.
        "recipe": str, // The recipe instructions.
        "sustainable_choice": str // A detailed explanation of each ingredient change, including the original ingredient's environmental impact, the replacement's benefits, and sources of information.
    }
    """

    try:
        data_string = str(data)
        response = model.generate_content([input_prompt, data_string])
        
        if isinstance(response, str):
            return response
        else:
            return str(response)
        
    except Exception as e:
        return {"error": str(e)}
    
def seasonal_recipe(data, zipcode):
      
    input_prompt = f"""
    Create a recipe based on the provided recipe and 5-digit US zip code.
    Prioritize ingredients that are currently in season for the region corresponding to
    this zipcode: {zipcode}. The key is to keep the core recipe intact and make
    ingredient replacements with locally sourced, seasonal alternatives when
    possible, without altering the fundamental nature of the dish.

    Constraints:
    * If no logical seasonal replacements can be made, use the original ingredient.
    * The recipe must remain the same food that was input.
    * The seasonal information must be specific to the region that the zipcode is in and the current season.

    Output a JSON response with the following details:
    {{
        "food_name": str, // The name of the dish.
        "ingredients": list[str], // A list of ingredients, reflecting any seasonal changes.
        "recipe": str, // The recipe instructions.
        "seasonal_choice": str // An explanation of each ingredient change, and why it was made based on the region and current season.
    }}
    """

    try:
        data_string = str(data)
        response = model.generate_content([input_prompt, data_string])
        
        if isinstance(response, str):
            return response
        else:
            return str(response)
        
    except Exception as e:
        return {"error": str(e)}
    


def ingredient_info(list):
    input_prompt = """
    For each ingredient in the list, provide a qualitative environmental assessment using a "high," "medium," or "low" scale for each of the following factors:
    * Carbon emissions
    * Water usage
    * Food miles

    Respond in the following JSON format:
    {
        "ingredient": str, // cleaned, standardized name
        "carbon_emissions": "high" | "medium" | "low",
        "water_usage": "high" | "medium" | "low",
        "food_miles": "high" | "medium" | "low"
    }
    """

    try:
        response = model.generate_content([input_prompt, list])
        if isinstance(response, str):
            return response
        else:
            return str(response)
        # for item in list:
        #     response = model.generate_content([input_prompt, item])
        #     if isinstance(response, str):
        #         results.append({"ingredient": item, "raw": response})
        #     else:
        #         # Try to extract structured content from response
        #         try:
        #             json_data = response.text.strip()
        #             results.append(json.loads(json_data))
        #         except:
        #             results.append({"ingredient": item, "raw": str(response)})
        
        # return results  # or jsonify(results) if you're returning via Flask
    except Exception as e:
        return {"error": str(e)}
    

def ingredient_list(text):
    start_index = text.find('"ingredients": [')
    end_index = text.find('"recipe"')
    ingredients = text[start_index + len('"ingredients": ['):end_index].strip()
    
    return ingredient_info(ingredients)


def final_recipe(data):
    input_prompt = """
    Given the previous information with a basic recipe and ingredient list, provide
    a fully fleshed out step-by-step recipe that a beginner can follow to make this dish.

    Generate the complete recipe in the following JSON format:
    {
    "title": str,                    // Name of the dish
    "ingredients": [str],           // List of ingredients with quantities and cleaned descriptions
    "instructions": [str]           // Step-by-step cooking instructions
    }

    Make sure to:
    - Include ingredient quantities where possible
    - Specify any cooking times and temperatures
    - Use clear, easy-to-follow instructions
    - Format the output like a traditional recipe with "Ingredients" and "Instructions" sections
    """

    try:
        response = model.generate_content([input_prompt, data])
        if isinstance(response, str):
            return response
        else:
            return str(response)

    except Exception as e:
        return {"error": str(e)}

