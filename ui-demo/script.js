// AQI Categorization Constants
const AQI_CATEGORIES = {
    GOOD: { min: 0, max: 50, label: 'Good', class: 'good' },
    MODERATE: { min: 51, max: 100, label: 'Moderate', class: 'moderate' },
    UNHEALTHY_SENSITIVE: { min: 101, max: 150, label: 'Unhealthy for Sensitive Groups', class: 'unhealthy-sensitive' },
    UNHEALTHY: { min: 151, max: 200, label: 'Unhealthy', class: 'unhealthy' },
    VERY_UNHEALTHY: { min: 201, max: 300, label: 'Very Unhealthy', class: 'very-unhealthy' },
    HAZARDOUS: { min: 301, max: 500, label: 'Hazardous', class: 'hazardous' }
};

// Time of day considerations
const TIME_CONSIDERATIONS = {
    morning: {
        factors: ['Higher traffic emissions', 'Temperature inversions', 'Rush hour impacts'],
        note: 'Morning conditions often show higher pollutant concentrations due to traffic and weather patterns.'
    },
    afternoon: {
        factors: ['Photochemical reactions', 'Wind patterns', 'Temperature effects'],
        note: 'Afternoon conditions may improve with increased wind and temperature, but photochemical reactions can increase ozone levels.'
    },
    evening: {
        factors: ['Rush hour impacts', 'Pollutant settling', 'Reduced dispersion'],
        note: 'Evening conditions may show elevated levels from afternoon rush hour and reduced atmospheric mixing.'
    },
    night: {
        factors: ['Temperature inversions', 'Reduced dispersion', 'Accumulation'],
        note: 'Nighttime conditions often show higher concentrations due to temperature inversions and reduced atmospheric mixing.'
    }
};

// Advisory templates
const ADVISORY_TEMPLATES = {
    good: {
        healthImplications: 'Air quality is satisfactory and poses little to no risk to public health.',
        recommendedActions: [
            'All outdoor activities are safe and recommended',
            'No special precautions needed',
            'Good time for outdoor exercise and recreation'
        ],
        specialConsiderations: 'No special considerations required for sensitive groups.',
        outlook: 'Conditions are expected to remain favorable.'
    },
    moderate: {
        healthImplications: 'Air quality is acceptable for most people. Sensitive individuals may experience minor respiratory discomfort.',
        recommendedActions: [
            'Sensitive individuals should consider reducing prolonged outdoor exertion',
            'General population can proceed with normal activities',
            'Monitor air quality updates throughout the day'
        ],
        specialConsiderations: 'People with asthma, heart conditions, or other respiratory issues should take extra precautions. Children and elderly may experience mild symptoms.',
        outlook: 'Air quality may vary throughout the day. Check updates before planning extended outdoor activities.'
    },
    'unhealthy-sensitive': {
        healthImplications: 'Sensitive groups may experience health effects. The general public is less likely to be affected.',
        recommendedActions: [
            'Sensitive groups should reduce outdoor activities, especially prolonged exertion',
            'General population can continue normal activities but should be aware of symptoms',
            'Consider indoor alternatives for sensitive individuals',
            'Keep windows closed and use air purifiers if available'
        ],
        specialConsiderations: 'Children, elderly, and those with pre-existing respiratory or cardiovascular conditions should avoid prolonged outdoor activity. Monitor symptoms closely.',
        outlook: 'Conditions may persist. Sensitive individuals should check updates before planning outdoor activities.'
    },
    unhealthy: {
        healthImplications: 'Everyone may begin to experience health effects. Sensitive groups are likely to experience more serious effects.',
        recommendedActions: [
            'Reduce outdoor activities, especially prolonged exertion',
            'Sensitive groups should avoid outdoor activities',
            'Keep windows closed and use air purifiers if available',
            'Consider postponing non-essential outdoor activities',
            'If outdoor activity is necessary, use N95 masks'
        ],
        specialConsiderations: 'Children, elderly, and those with pre-existing conditions should remain indoors. Monitor symptoms and seek medical attention if severe.',
        outlook: 'Conditions are expected to persist. Air quality may improve, but check updates before planning activities.'
    },
    'very-unhealthy': {
        healthImplications: 'Health alert: everyone may experience more serious health effects. Sensitive groups are at high risk.',
        recommendedActions: [
            'Avoid all outdoor activities',
            'Stay indoors with windows and doors closed',
            'Use air purifiers if available',
            'If outdoor activity is unavoidable, use N95 masks and limit time outside',
            'Postpone all non-essential outdoor activities'
        ],
        specialConsiderations: 'All sensitive groups must remain indoors. General population should also avoid outdoor exposure. Seek medical attention if experiencing severe symptoms.',
        outlook: 'Conditions are severe and expected to persist. Monitor updates closely and follow health advisories.'
    },
    hazardous: {
        healthImplications: 'Health warning of emergency conditions. The entire population is likely to be affected.',
        recommendedActions: [
            'Remain indoors at all times',
            'Keep all windows and doors closed',
            'Use air purifiers on high settings',
            'Avoid any outdoor exposure',
            'Follow emergency health advisories from local authorities',
            'Consider relocating if conditions persist and you have respiratory conditions'
        ],
        specialConsiderations: 'This is an emergency situation. All individuals, especially sensitive groups, must remain indoors. Seek immediate medical attention if experiencing severe respiratory distress.',
        outlook: 'Emergency conditions are present. Follow all local health advisories and emergency protocols.'
    }
};

/**
 * Categorizes AQI value into appropriate category
 * @param {number} aqi - Air Quality Index value
 * @returns {Object} Category object with label and class
 */
function categorizeAQI(aqi) {
    if (aqi <= AQI_CATEGORIES.GOOD.max) {
        return { ...AQI_CATEGORIES.GOOD, key: 'good' };
    } else if (aqi <= AQI_CATEGORIES.MODERATE.max) {
        return { ...AQI_CATEGORIES.MODERATE, key: 'moderate' };
    } else if (aqi <= AQI_CATEGORIES.UNHEALTHY_SENSITIVE.max) {
        return { ...AQI_CATEGORIES.UNHEALTHY_SENSITIVE, key: 'unhealthy-sensitive' };
    } else if (aqi <= AQI_CATEGORIES.UNHEALTHY.max) {
        return { ...AQI_CATEGORIES.UNHEALTHY, key: 'unhealthy' };
    } else if (aqi <= AQI_CATEGORIES.VERY_UNHEALTHY.max) {
        return { ...AQI_CATEGORIES.VERY_UNHEALTHY, key: 'very-unhealthy' };
    } else {
        return { ...AQI_CATEGORIES.HAZARDOUS, key: 'hazardous' };
    }
}

/**
 * Generates advisory content based on AQI category and time of day
 * @param {Object} category - AQI category object
 * @param {string} city - City name
 * @param {number} aqi - AQI value
 * @param {string} timeOfDay - Time of day key
 * @returns {string} HTML content for advisory
 */
function generateAdvisory(category, city, aqi, timeOfDay) {
    const template = ADVISORY_TEMPLATES[category.key];
    const timeInfo = TIME_CONSIDERATIONS[timeOfDay] || TIME_CONSIDERATIONS.morning;

    let html = `
        <h3>Health Implications</h3>
        <p>${template.healthImplications}</p>

        <h3>Recommended Actions</h3>
        <ul>
            ${template.recommendedActions.map(action => `<li>${action}</li>`).join('')}
        </ul>

        <h3>Special Considerations for Sensitive Groups</h3>
        <p>${template.specialConsiderations}</p>

        <h3>Time of Day Considerations</h3>
        <p>${timeInfo.note}</p>
        <ul>
            ${timeInfo.factors.map(factor => `<li>${factor}</li>`).join('')}
        </ul>

        <h3>Outlook</h3>
        <p>${template.outlook}</p>
    `;

    return html;
}

/**
 * Validates form inputs
 * @param {string} city - City name
 * @param {number} aqi - AQI value
 * @param {string} timeOfDay - Time of day
 * @returns {Object} Validation result with isValid flag and message
 */
function validateInputs(city, aqi, timeOfDay) {
    if (!city || city.trim().length === 0) {
        return { isValid: false, message: 'Please enter a city name.' };
    }

    if (isNaN(aqi) || aqi < 0 || aqi > 500) {
        return { isValid: false, message: 'Please enter a valid AQI value between 0 and 500.' };
    }

    if (!timeOfDay) {
        return { isValid: false, message: 'Please select a time of day.' };
    }

    return { isValid: true, message: '' };
}

/**
 * Displays the advisory in the UI
 * @param {Object} category - AQI category object
 * @param {string} city - City name
 * @param {number} aqi - AQI value
 * @param {string} timeOfDay - Time of day
 */
function displayAdvisory(category, city, aqi, timeOfDay) {
    const outputSection = document.getElementById('output-section');
    const categoryElement = document.getElementById('aqi-category');
    const contentElement = document.getElementById('advisory-content');

    // Set category display
    categoryElement.textContent = `AQI Category: ${category.label} (AQI: ${aqi})`;
    categoryElement.className = `aqi-category ${category.class}`;

    // Generate and set advisory content
    contentElement.innerHTML = generateAdvisory(category, city, aqi, timeOfDay);

    // Show output section
    outputSection.style.display = 'block';

    // Scroll to output section
    outputSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Handles form submission
 */
function handleFormSubmit(event) {
    event.preventDefault();

    // Get form values
    const city = document.getElementById('city').value.trim();
    const aqi = parseInt(document.getElementById('aqi').value, 10);
    const timeOfDay = document.getElementById('time').value;

    // Validate inputs
    const validation = validateInputs(city, aqi, timeOfDay);
    if (!validation.isValid) {
        alert(validation.message);
        return;
    }

    // Categorize AQI
    const category = categorizeAQI(aqi);

    // Display advisory
    displayAdvisory(category, city, aqi, timeOfDay);
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('aqi-form');
    form.addEventListener('submit', handleFormSubmit);
});

