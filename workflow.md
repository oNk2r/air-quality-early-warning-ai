# System Workflow

## High-Level Process Flow

```
User Input
    │
    ├── City Name
    ├── AQI Value
    └── Time of Day
    │
    ▼
Input Validation
    │
    ▼
AI Processing
    │
    ├── AQI Categorization
    ├── Contextual Analysis
    ├── Risk Assessment
    └── Advisory Generation
    │
    ▼
Structured Output
    │
    ├── AQI Category
    ├── Health Implications
    ├── Recommended Actions
    ├── Special Considerations
    └── Outlook
    │
    ▼
User Advisory Display
```

## Detailed Component Interactions

### 1. Input Stage
- User provides location, AQI value, and temporal context
- System validates input format and ranges
- Data is prepared for AI processing

### 2. Processing Stage
- AQI value is categorized according to standard scales
- Time of day context is analyzed for exposure patterns
- Health risk levels are assessed
- Appropriate advisory templates are selected

### 3. Output Stage
- Structured advisory is generated
- Information is formatted for user consumption
- Recommendations are prioritized by urgency
- Special considerations are highlighted

## Decision Tree Logic

```
IF AQI <= 50:
    Category: Good
    Risk: Minimal
    Action: No restrictions

ELSE IF AQI <= 100:
    Category: Moderate
    Risk: Low (sensitive groups)
    Action: Sensitive groups reduce exertion

ELSE IF AQI <= 150:
    Category: Unhealthy for Sensitive Groups
    Risk: Moderate (sensitive groups)
    Action: Sensitive groups avoid outdoor activity

ELSE IF AQI <= 200:
    Category: Unhealthy
    Risk: High (all groups)
    Action: Everyone reduce outdoor activity

ELSE IF AQI <= 300:
    Category: Very Unhealthy
    Risk: Very High
    Action: Avoid all outdoor activity

ELSE:
    Category: Hazardous
    Risk: Extreme
    Action: Emergency conditions, stay indoors
```

