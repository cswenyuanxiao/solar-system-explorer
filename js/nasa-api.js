// NASA API Integration for Solar System Explorer

class NASAAPI {
    constructor() {
        this.apiKey = 'DEMO_KEY'; // Default demo key
        this.baseURL = 'https://api.nasa.gov';
        this.endpoints = {
            apod: '/planetary/apod', // Astronomy Picture of the Day
            neo: '/neo/rest/v1/feed', // Near Earth Objects
            mars: '/mars-photos/api/v1/rovers/curiosity/photos', // Mars Rover Photos
            earth: '/planetary/earth/assets', // Earth imagery
            search: '/search' // General search
        };
        this.cache = new Map();
        this.cacheTimeout = 30 * 60 * 1000; // 30 minutes
        this.init();
    }

    init() {
        this.loadAPIKey();
        // setupErrorHandling is not needed as error handling is done in individual methods
        console.log('NASA API initialized with key:', this.apiKey);
    }

    loadAPIKey() {
        // Try to load API key from localStorage or use demo key
        const savedKey = localStorage.getItem('nasa_api_key');
        if (savedKey && savedKey !== 'DEMO_KEY') {
            this.apiKey = savedKey;
        }
    }

    setAPIKey(key) {
        this.apiKey = key;
        localStorage.setItem('nasa_api_key', key);
        console.log('API key updated to:', key); // Debug log
        
        // Clear cache when API key changes
        this.cache.clear();
        
        // Trigger stats update
        if (window.apiManagement) {
            window.apiManagement.updateAPIStats();
        }
    }

    async makeRequest(endpoint, params = {}) {
        const url = new URL(this.baseURL + endpoint);
        
        // Add API key
        url.searchParams.append('api_key', this.apiKey);
        
        // Add other parameters
        Object.keys(params).forEach(key => {
            url.searchParams.append(key, params[key]);
        });

        const cacheKey = url.toString();
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        try {
            const response = await fetch(url.toString());
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            // Cache the response
            this.cache.set(cacheKey, {
                data: data,
                timestamp: Date.now()
            });

            return data;
        } catch (error) {
            this.handleError(error, endpoint);
            throw error;
        }
    }

    // Get Astronomy Picture of the Day
    async getAPOD(date = null) {
        const params = {};
        if (date) {
            params.date = date;
        }

        try {
            const data = await this.makeRequest(this.endpoints.apod, params);
            return this.formatAPODData(data);
        } catch (error) {
            console.error('Error fetching APOD:', error);
            return this.getFallbackAPOD();
        }
    }

    // Get multiple APOD images
    async getAPODRange(startDate, endDate) {
        const params = {
            start_date: startDate,
            end_date: endDate
        };

        try {
            const data = await this.makeRequest(this.endpoints.apod, params);
            return data.map(item => this.formatAPODData(item));
        } catch (error) {
            console.error('Error fetching APOD range:', error);
            return [];
        }
    }

    // Get Mars Rover photos
    async getMarsPhotos(sol = null, camera = null) {
        const params = {};
        if (sol) params.sol = sol;
        if (camera) params.camera = camera;

        try {
            const data = await this.makeRequest(this.endpoints.mars, params);
            return this.formatMarsData(data);
        } catch (error) {
            console.error('Error fetching Mars photos:', error);
            return [];
        }
    }

    // Get Near Earth Objects
    async getNEOs(startDate, endDate) {
        const params = {
            start_date: startDate,
            end_date: endDate
        };

        try {
            const data = await this.makeRequest(this.endpoints.neo, params);
            return this.formatNEOData(data);
        } catch (error) {
            console.error('Error fetching NEOs:', error);
            return [];
        }
    }

    // Search NASA content
    async searchNASA(query, mediaType = 'image') {
        const params = {
            q: query,
            media_type: mediaType
        };

        try {
            const data = await this.makeRequest(this.endpoints.search, params);
            return this.formatSearchData(data);
        } catch (error) {
            console.error('Error searching NASA:', error);
            return [];
        }
    }

    // Format APOD data
    formatAPODData(data) {
        return {
            title: data.title,
            explanation: data.explanation,
            url: data.url,
            hdurl: data.hdurl,
            date: data.date,
            copyright: data.copyright,
            mediaType: data.media_type,
            serviceVersion: data.service_version
        };
    }

    // Format Mars data
    formatMarsData(data) {
        return data.photos.map(photo => ({
            id: photo.id,
            sol: photo.sol,
            camera: photo.camera,
            imgSrc: photo.img_src,
            earthDate: photo.earth_date,
            rover: photo.rover
        }));
    }

    // Format NEO data
    formatNEOData(data) {
        const asteroids = [];
        Object.keys(data.near_earth_objects).forEach(date => {
            data.near_earth_objects[date].forEach(asteroid => {
                asteroids.push({
                    id: asteroid.id,
                    name: asteroid.name,
                    diameter: asteroid.estimated_diameter,
                    distance: asteroid.close_approach_data[0]?.miss_distance,
                    velocity: asteroid.close_approach_data[0]?.relative_velocity,
                    hazardous: asteroid.is_potentially_hazardous_asteroid,
                    date: date
                });
            });
        });
        return asteroids;
    }

    // Format search data
    formatSearchData(data) {
        return data.collection.items.map(item => ({
            title: item.data[0]?.title,
            description: item.data[0]?.description,
            url: item.links[0]?.href,
            date: item.data[0]?.date_created,
            keywords: item.data[0]?.keywords
        }));
    }

    // Get fallback APOD data
    getFallbackAPOD() {
        return {
            title: 'Hubble Space Telescope',
            explanation: 'The Hubble Space Telescope has been one of the most productive scientific instruments ever built. Astronomers using Hubble data have published more than 18,000 scientific papers, making it one of the most productive scientific instruments ever built.',
            url: 'images/background.jpg',
            hdurl: 'images/background.jpg',
            date: new Date().toISOString().split('T')[0],
            copyright: 'NASA',
            mediaType: 'image',
            serviceVersion: 'v1'
        };
    }

    // Handle API errors
    handleError(error, endpoint) {
        console.error(`NASA API Error (${endpoint}):`, error);
        
        // Show user-friendly error message
        this.showErrorMessage(error.message);
        
        // Track error for analytics
        this.trackError(error, endpoint);
    }

    // Show error message to user
    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'nasa-api-error';
        errorDiv.innerHTML = `
            <div class="error-content">
                <h4>🚀 NASA API Error</h4>
                <p>${message}</p>
                <p>Using fallback data...</p>
                <button onclick="this.parentElement.parentElement.remove()">Dismiss</button>
            </div>
        `;
        
        // Add styles
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(244, 67, 54, 0.9);
            color: white;
            padding: 1rem;
            border-radius: 10px;
            z-index: 1000;
            max-width: 300px;
            backdrop-filter: blur(10px);
        `;
        
        document.body.appendChild(errorDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 5000);
    }

    // Track errors for analytics
    trackError(error, endpoint) {
        const errorLog = {
            timestamp: new Date().toISOString(),
            endpoint: endpoint,
            error: error.message,
            apiKey: this.apiKey === 'DEMO_KEY' ? 'demo' : 'custom'
        };

        // Store in localStorage for debugging
        const errorHistory = JSON.parse(localStorage.getItem('nasa_api_errors') || '[]');
        errorHistory.push(errorLog);
        
        // Keep only last 10 errors
        if (errorHistory.length > 10) {
            errorHistory.splice(0, errorHistory.length - 10);
        }
        
        localStorage.setItem('nasa_api_errors', JSON.stringify(errorHistory));
    }

    // Get API usage statistics
    getAPIStats() {
        const errorHistory = JSON.parse(localStorage.getItem('nasa_api_errors') || '[]');
        const cacheSize = this.cache.size;
        
        return {
            cacheSize: cacheSize,
            errorCount: errorHistory.length,
            lastError: errorHistory[errorHistory.length - 1] || null,
            apiKeyType: this.apiKey === 'DEMO_KEY' ? 'demo' : 'custom'
        };
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
        console.log('NASA API cache cleared');
    }

    // Test API connection
    async testConnection() {
        try {
            const data = await this.getAPOD();
            return {
                success: true,
                message: 'API connection successful',
                data: data
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                error: error
            };
        }
    }

    // Get daily space fact
    async getDailySpaceFact() {
        const facts = [
            "The Sun contains 99.86% of the solar system's mass",
            "Jupiter's Great Red Spot has been raging for over 400 years",
            "Saturn's rings are mostly made of ice particles",
            "Venus rotates backwards compared to most planets",
            "Mars has the largest volcano in the solar system",
            "Neptune has the fastest winds in the solar system",
            "Uranus rotates on its side with a 98-degree tilt",
            "Mercury has the most extreme temperature variations"
        ];

        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        
        return facts[dayOfYear % facts.length];
    }

    // Get space weather data (simulated)
    getSpaceWeather() {
        const conditions = ['Quiet', 'Minor Storm', 'Moderate Storm', 'Major Storm'];
        const solarFlare = Math.random() > 0.7;
        const geomagneticStorm = Math.random() > 0.8;
        
        return {
            condition: conditions[Math.floor(Math.random() * conditions.length)],
            solarFlare: solarFlare,
            geomagneticStorm: geomagneticStorm,
            sunspotCount: Math.floor(Math.random() * 50) + 10,
            solarWindSpeed: Math.floor(Math.random() * 500) + 300
        };
    }
}

// Initialize NASA API when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing NASA API...');
    window.nasaAPI = new NASAAPI();
    console.log('NASA API initialized:', !!window.nasaAPI);
}); 