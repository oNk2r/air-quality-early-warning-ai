# Prototype Explanation

## Overview

This prototype demonstrates an AI-powered air quality early warning and advisory system. The system uses a structured prompt-based approach to analyze air quality data and generate actionable public health advisories.

## System Architecture

The prototype consists of three main components:

1. **System Prompt** (`system_prompt.txt`): Defines the AI assistant's role, expertise, and response guidelines
2. **User Prompt Template** (`user_prompt_template.txt`): Provides a structured format for inputting air quality data
3. **Sample Inputs/Outputs** (`sample_inputs_outputs.md`): Demonstrates expected system behavior across different scenarios

## How It Works

### Input Processing
The system accepts three key inputs:
- **City**: Geographic location for context
- **AQI Value**: Air Quality Index numerical value
- **Time of Day**: Temporal context affecting exposure patterns

### AI Decision Logic
The AI assistant processes these inputs through the following steps:

1. **AQI Categorization**: Interprets the numerical AQI value according to standard EPA/WHO categories:
   - 0-50: Good
   - 51-100: Moderate
   - 101-150: Unhealthy for Sensitive Groups
   - 151-200: Unhealthy
   - 201-300: Very Unhealthy
   - 301+: Hazardous

2. **Contextual Analysis**: Considers time of day factors:
   - Morning: Higher traffic emissions, temperature inversions
   - Afternoon: Potential for photochemical reactions, wind patterns
   - Evening: Rush hour impacts, settling of pollutants
   - Night: Temperature inversions, reduced dispersion

3. **Risk Assessment**: Evaluates health implications based on:
   - AQI category severity
   - Population sensitivity factors
   - Exposure duration considerations

4. **Advisory Generation**: Produces structured recommendations including:
   - Health implications
   - Recommended actions
   - Special considerations for vulnerable groups
   - Outlook for the day

## UI Mapping to AI Decision Logic

The demo UI (`ui-demo/`) simulates the AI decision-making process using client-side JavaScript. The UI implementation maps to the AI logic as follows:

### AQI Categorization Logic
The UI implements the same EPA/WHO AQI categorization standards:
- JavaScript functions categorize input AQI values into the same ranges as the AI system
- Each category triggers appropriate advisory templates

### Advisory Generation
The UI generates advisories using predefined templates that mirror the AI's structured output format:
- Health implications are derived from AQI category
- Recommended actions are selected based on severity level
- Time of day considerations influence specific recommendations

### Assumptions and Limitations

**Assumptions:**
- AQI values follow standard EPA/WHO scale (0-500)
- User inputs are valid and within expected ranges
- Local interpretation of AQI standards applies globally
- Time of day impacts follow general patterns (may vary by region)

**Limitations:**
- The UI provides simplified, rule-based logic rather than true AI reasoning
- No real-time data integration or historical trend analysis
- No personalized health recommendations based on individual medical history
- Geographic and meteorological context is limited
- Does not account for specific pollutant types (PM2.5, PM10, O3, etc.)
- No machine learning or adaptive learning capabilities

**Note:** The UI serves as a demonstration of the advisory system's output format and decision structure. A production system would require integration with actual AI models, real-time air quality data sources, and more sophisticated contextual analysis.

## Use Cases

1. **Public Health Advisories**: Quick assessment for daily activity planning
2. **Educational Tool**: Demonstrating AQI interpretation and health implications
3. **Prototype Validation**: Testing advisory format and user experience
4. **Research Foundation**: Base for developing more sophisticated AI models

## Future Enhancements

- Integration with real-time air quality APIs
- Machine learning models for predictive advisories
- Personalized recommendations based on user health profiles
- Multi-pollutant analysis and source attribution
- Historical trend analysis and forecasting
- Multi-language support for global accessibility

