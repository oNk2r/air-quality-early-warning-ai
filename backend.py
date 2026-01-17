from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings

app = Flask(__name__)
CORS(app)

# Initialize embeddings (no API key needed)
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Global variable to store vector store
vector_store = None

def get_aqi_category(aqi):
    """Returns category name and colored emoji based on AQI value"""
    if aqi <= 50:
        return "Good", "🟢"
    elif aqi <= 100:
        return "Moderate", "🟡"
    elif aqi <= 150:
        return "Unhealthy for Sensitive Groups", "🟠"
    elif aqi <= 200:
        return "Unhealthy", "🔴"
    elif aqi <= 300:
        return "Very Unhealthy", "🟣"
    else:
        return "Hazardous", "🟤"

def get_mask_recommendation(aqi):
    """Returns mask recommendation based on AQI"""
    if aqi <= 50:
        return "No mask needed. Air quality is good."
    elif aqi <= 100:
        return "Optional: N95 mask for sensitive individuals during prolonged outdoor activities."
    elif aqi <= 150:
        return "Recommended: N95 or KN95 mask for sensitive groups and during outdoor activities."
    elif aqi <= 200:
        return "Strongly Recommended: N95 or KN95 mask for all individuals, especially during outdoor activities."
    elif aqi <= 300:
        return "Essential: N95 or KN95 mask required for all outdoor activities. Consider P100 respirator for extended exposure."
    else:
        return "Critical: P100 respirator or equivalent required. Minimize all outdoor exposure."

def load_and_process_guidelines():
    """Load health guidelines and create vector database"""
    global vector_store
    
    # Check if guidelines file exists
    guidelines_path = "data/health_guidelines.txt"
    if not os.path.exists(guidelines_path):
        raise FileNotFoundError(f"Health guidelines file not found at {guidelines_path}")
    
    # Read guidelines
    with open(guidelines_path, 'r', encoding='utf-8') as f:
        guidelines_text = f.read()
    
    # Split text into chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )
    chunks = text_splitter.split_text(guidelines_text)
    
    # Create or load vector database
    persist_directory = "health_db"
    
    if os.path.exists(persist_directory) and os.listdir(persist_directory):
        # Load existing database
        vector_store = Chroma(
            persist_directory=persist_directory,
            embedding_function=embeddings
        )
    else:
        # Create new database
        vector_store = Chroma.from_texts(
            texts=chunks,
            embedding=embeddings,
            persist_directory=persist_directory
        )
    
    print(f"Vector database initialized with {len(chunks)} chunks")

def parse_advisory_from_context(context, aqi, user_profile):
    """Parse retrieved context to extract structured advisory information"""
    category, icon = get_aqi_category(aqi)
    
    # Initialize advisory fields
    advisory = {
        "health_implications": "",
        "general_advice": "",
        "sensitive_groups": "",
        "outdoor_activities": "",
        "protective_measures": ""
    }
    
    # Extract information based on keywords
    context_lower = context.lower()
    
    # Health Implications
    if "health implications" in context_lower or "health effects" in context_lower:
        start = context_lower.find("health implications")
        if start == -1:
            start = context_lower.find("health effects")
        if start != -1:
            end = context.find(".", start + 200) if context.find(".", start + 200) != -1 else len(context)
            advisory["health_implications"] = context[start:end].strip()
    
    # General Advice
    if "general" in context_lower and ("advice" in context_lower or "recommendation" in context_lower):
        start = context_lower.find("general")
        if start != -1:
            end = context.find(".", start + 200) if context.find(".", start + 200) != -1 else len(context)
            advisory["general_advice"] = context[start:end].strip()
    
    # Sensitive Groups
    profile_keywords = {
        "asthma": ["asthma", "respiratory"],
        "heart disease": ["heart", "cardiovascular", "cardiac"],
        "elderly": ["elderly", "senior", "older adults"],
        "children": ["children", "child", "pediatric"],
        "pregnant": ["pregnant", "pregnancy", "expecting"]
    }
    
    if user_profile in profile_keywords:
        keywords = profile_keywords[user_profile]
        for keyword in keywords:
            if keyword in context_lower:
                start = context_lower.find(keyword)
                if start != -1:
                    end = context.find(".", start + 300) if context.find(".", start + 300) != -1 else len(context)
                    advisory["sensitive_groups"] = context[start:end].strip()
                    break
    
    # Outdoor Activities
    if "outdoor" in context_lower or "exercise" in context_lower:
        start = context_lower.find("outdoor")
        if start == -1:
            start = context_lower.find("exercise")
        if start != -1:
            end = context.find(".", start + 200) if context.find(".", start + 200) != -1 else len(context)
            advisory["outdoor_activities"] = context[start:end].strip()
    
    # Protective Measures
    if "protective" in context_lower or "precaution" in context_lower or "measure" in context_lower:
        start = context_lower.find("protective")
        if start == -1:
            start = context_lower.find("precaution")
        if start == -1:
            start = context_lower.find("measure")
        if start != -1:
            end = context.find(".", start + 200) if context.find(".", start + 200) != -1 else len(context)
            advisory["protective_measures"] = context[start:end].strip()
    
    # If fields are empty, use context as fallback
    if not advisory["health_implications"]:
        advisory["health_implications"] = context[:300] + "..." if len(context) > 300 else context
    if not advisory["general_advice"]:
        advisory["general_advice"] = "Follow general air quality guidelines for your area."
    if not advisory["sensitive_groups"]:
        advisory["sensitive_groups"] = f"Individuals with {user_profile} should take extra precautions."
    if not advisory["outdoor_activities"]:
        advisory["outdoor_activities"] = "Limit outdoor activities based on AQI level."
    if not advisory["protective_measures"]:
        advisory["protective_measures"] = "Stay indoors when possible, use air purifiers, and wear appropriate masks."
    
    return advisory

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "Air Quality Health Advisory API is running"})

@app.route('/analyze', methods=['POST'])
def analyze_aqi():
    """Main endpoint to analyze AQI and provide health advisory"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        city = data.get('city', 'Unknown')
        aqi = int(data.get('aqi', 0))
        user_profile = data.get('user_profile', 'general')
        
        # Validate inputs
        if aqi < 0 or aqi > 500:
            return jsonify({"error": "AQI must be between 0 and 500"}), 400
        
        if user_profile not in ['general', 'asthma', 'heart disease', 'elderly', 'children', 'pregnant']:
            return jsonify({"error": "Invalid user profile"}), 400
        
        # Get AQI category
        category, icon = get_aqi_category(aqi)
        
        # Create query for semantic search
        query = f"AQI {aqi} {category} health advisory for {user_profile} profile"
        
        # Retrieve relevant chunks using RAG
        if vector_store is None:
            return jsonify({"error": "Vector database not initialized"}), 500
        
        # Get top 4 relevant chunks
        docs = vector_store.similarity_search(query, k=4)
        
        # Combine retrieved context
        context = "\n\n".join([doc.page_content for doc in docs])
        
        # Parse advisory from context
        advisory = parse_advisory_from_context(context, aqi, user_profile)
        
        # Get mask recommendation
        mask_recommendation = get_mask_recommendation(aqi)
        
        # Build response
        response = {
            "city": city,
            "aqi": aqi,
            "category": category,
            "icon": icon,
            "health_implications": advisory["health_implications"],
            "general_advice": advisory["general_advice"],
            "sensitive_groups": advisory["sensitive_groups"],
            "outdoor_activities": advisory["outdoor_activities"],
            "protective_measures": advisory["protective_measures"],
            "mask_recommendation": mask_recommendation
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Loading health guidelines and initializing vector database...")
    try:
        load_and_process_guidelines()
        print("Backend ready! Starting Flask server...")
        app.run(debug=True, port=5000)
    except Exception as e:
        print(f"Error initializing backend: {e}")
        raise

