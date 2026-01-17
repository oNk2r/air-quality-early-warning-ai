async function getAdvisory() {
    const city = document.getElementById('city').value.trim();
    const aqi = parseInt(document.getElementById('aqi').value);
    const profile = document.getElementById('profile').value;

    // Validation
    if (!city) {
        alert('Please enter a city name');
        return;
    }

    if (isNaN(aqi) || aqi < 0 || aqi > 500) {
        alert('Please enter a valid AQI between 0 and 500');
        return;
    }

    // Show loading, hide results
    document.getElementById('loading').classList.add('active');
    document.getElementById('results').classList.remove('active');

    try {
        const response = await fetch('http://localhost:5000/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                city: city,
                aqi: aqi,
                user_profile: profile
            })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        // Hide loading, show results
        document.getElementById('loading').classList.remove('active');
        document.getElementById('results').classList.add('active');

        // Update AQI header
        const aqiHeader = document.getElementById('aqiHeader');
        const category = data.category.toLowerCase().replace(/\s+/g, '-');
        aqiHeader.className = 'aqi-header ' + getCategoryClass(category);
        document.getElementById('aqiCategory').textContent = 'AQI Category: ' + data.category + ' (AQI: ' + data.aqi + ')';
        document.getElementById('aqiValue').textContent = '';

        // Update advisory sections
        document.getElementById('healthImplications').textContent = data.health_implications || 'No specific health implications available.';
        document.getElementById('generalAdvice').textContent = data.general_advice || 'Follow general air quality guidelines.';
        document.getElementById('sensitiveGroups').textContent = data.sensitive_groups || 'Sensitive groups should take extra precautions.';
        document.getElementById('outdoorActivities').textContent = data.outdoor_activities || 'Limit outdoor activities based on AQI level.';
        document.getElementById('protectiveMeasures').textContent = data.protective_measures || 'Take appropriate protective measures.';
        document.getElementById('maskRecommendation').textContent = data.mask_recommendation || 'Follow mask recommendations based on AQI level.';

        // Show warning if AQI > 150
        if (aqi > 150) {
            document.getElementById('warningBox').style.display = 'block';
        } else {
            document.getElementById('warningBox').style.display = 'none';
        }

        // Smooth scroll to results
        document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (error) {
        document.getElementById('loading').classList.remove('active');
        alert('Error: Could not connect to the backend server. Please make sure the Flask server is running on localhost:5000\n\nError details: ' + error.message);
        console.error('Error:', error);
    }
}

function getCategoryClass(category) {
    const cat = category.toLowerCase();
    if (cat.includes('hazardous')) return 'hazardous';
    if (cat.includes('very') && cat.includes('unhealthy')) return 'very-unhealthy';
    if (cat.includes('unhealthy') && cat.includes('sensitive')) return 'unhealthy-sensitive';
    if (cat.includes('unhealthy')) return 'unhealthy';
    if (cat.includes('moderate')) return 'moderate';
    if (cat.includes('good')) return 'good';
    return 'moderate';
}

// Allow Enter key to submit
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('aqi').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            getAdvisory();
        }
    });

    document.getElementById('city').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            getAdvisory();
        }
    });
});

