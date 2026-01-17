# 🌍 AQI Health Advisory System 

**AI-Powered Personalized Air Quality Health Guidance**

## 🎓 SDG Alignment

**Primary:** SDG 3 (Good Health and Well-being)
- Reduces health risks from air pollution
- Provides preventive health guidance
- Protects vulnerable populations

**Secondary:**
- SDG 11 (Sustainable Cities) - Urban health management
- SDG 13 (Climate Action) - Climate health adaptation

---

## ✨ Features

- 🎯 **Personalized Advisories** - Tailored to health profile (asthma, elderly, children)
- 📊 **AQI Analysis** - Real-time categorization and risk assessment
- 🏥 **Health Guidance** - Specific actions based on air quality
- 😷 **Mask Recommendations** - Appropriate protection for pollution levels
- 🏃 **Activity Guidance** - Outdoor exercise safety recommendations
- 🛡️ **Protective Measures** - Actionable steps to reduce exposure

---

## 🛠️ Technology Stack

**Frontend:**
- HTML5, CSS3, Vanilla JavaScript
- Responsive design, no frameworks needed

**Backend:**
- Python Flask - Lightweight API
- LangChain - RAG orchestration
- ChromaDB - Vector database
- HuggingFace Embeddings - Free, no API key

**Data:**
- WHO Air Quality Guidelines
- EPA Health Advisory Standards
- ~40 knowledge chunks covering all AQI ranges

---

## 🚀 Installation & Setup

### Prerequisites:
- Python 3.8+
- No API keys needed!

### Steps:
```bash
# Clone repository
git clone https://github.com/yourusername/aqi-health-advisor.git
cd aqi-health-advisor

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start backend
python backend.py
```

Backend will run on: http://localhost:5000

### Open Frontend:
Simply open `index.html` in your browser

---

## 📊 Demo

### Input:
- **City:** Delhi
- **AQI:** 180
- **Profile:** Person with Asthma

### Output:
```
🔴 AQI: 180 - Unhealthy

Health Implications:
Some members of the general public may experience health effects; 
members of sensitive groups may experience more serious health effects.

Recommendations for You:
People with asthma should avoid prolonged or heavy exertion. 
Keep quick-relief medicine handy and follow asthma action plan.

Outdoor Activities:
Avoid prolonged outdoor exertion. Consider indoor alternatives.

Protective Measures:
Wear N95 masks if you must go outside. Use air purifiers indoors.

Mask Recommendation:
N95 mask for everyone during outdoor exposure
```

---

## 🏗️ Architecture

User Input (City, AQI, Health Profile)

↓
Flask API Endpoint
↓
RAG System (LangChain + ChromaDB)
↓
Vector Search: Find relevant health guidelines
↓
Context Assembly: Combine relevant information
↓
Advisory Generation:Personalized recommendations
↓
JSON Response to Frontend
↓
Display: Color-coded, categorized advisory


---

## ⚖️ Responsible AI Considerations

### Fairness:
- Uses WHO/EPA standards applicable globally
- No bias based on location, demographics
- Equal access to health information

### Transparency:
- Clear explanation of AQI categories
- Source attribution (WHO, EPA guidelines)
- No hidden decision-making logic

### Privacy:
- No user data stored
- No tracking or analytics
- Runs completely offline-capable

### Limitations:
- **Not medical advice** - Consult healthcare professionals
- **General guidelines** - Individual needs may vary
- **Static data** - Based on established health standards
- **No real-time sensors** - Relies on user-provided AQI

### Safety:
- Conservative recommendations for safety
- Clear warnings for hazardous conditions
- Emergency guidance included


---

## 📝 Project Structure
