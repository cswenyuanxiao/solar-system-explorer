// Unified Planet Data Source
// This file contains all planet data to avoid duplication across different modules

const planetData = {
    planets: [
        {
            name: 'Sun',
            displayName: 'THE SUN',
            description: 'Our star - the heart of the solar system',
            image: '../images/sun.jpg',
            url: 'sun.html',
            keywords: ['star', 'solar', 'fusion', 'energy', 'light', 'heat', 'sun'],
            color: '#FFD700',
            diameter: 1392684, // km
            mass: 333000, // Earth masses
            distance: 0, // AU
            temperature: 5778, // K
            moons: 0,
            type: 'star'
        },
        {
            name: 'Mercury',
            displayName: 'MERCURY',
            description: 'The smallest planet, closest to the Sun',
            image: '../images/mercury.jpg',
            url: 'mercury.html',
            keywords: ['smallest', 'closest', 'hot', 'cold', 'extreme', 'temperature', 'mercury'],
            color: '#8C8C8C',
            diameter: 4879, // km
            mass: 0.055, // Earth masses
            distance: 0.39, // AU
            temperature: 167, // K
            moons: 0,
            type: 'terrestrial'
        },
        {
            name: 'Venus',
            displayName: 'VENUS',
            description: 'The hottest planet, Earth\'s twin',
            image: '../images/venus.jpg',
            url: 'venus.html',
            keywords: ['hottest', 'twin', 'greenhouse', 'thick', 'atmosphere', 'backwards', 'venus'],
            color: '#FFA500',
            diameter: 12104, // km
            mass: 0.815, // Earth masses
            distance: 0.72, // AU
            temperature: 462, // K
            moons: 0,
            type: 'terrestrial'
        },
        {
            name: 'Earth',
            displayName: 'EARTH',
            description: 'Our home planet, the blue marble',
            image: '../images/earth.jpg',
            url: 'earth.html',
            keywords: ['home', 'blue', 'life', 'water', 'atmosphere', 'habitable', 'earth'],
            color: '#4CAF50',
            diameter: 12742, // km
            mass: 1, // Earth masses
            distance: 1, // AU
            temperature: 288, // K
            moons: 1,
            type: 'terrestrial'
        },
        {
            name: 'Mars',
            displayName: 'MARS',
            description: 'The red planet, future human destination',
            image: '../images/mars.jpg',
            url: 'mars.html',
            keywords: ['red', 'rust', 'future', 'human', 'colonization', 'rovers', 'mars'],
            color: '#FF4444',
            diameter: 6779, // km
            mass: 0.107, // Earth masses
            distance: 1.52, // AU
            temperature: 210, // K
            moons: 2,
            type: 'terrestrial'
        },
        {
            name: 'Jupiter',
            displayName: 'JUPITER',
            description: 'The largest planet, gas giant',
            image: '../images/jupiter.jpg',
            url: 'jupiter.html',
            keywords: ['largest', 'gas', 'giant', 'great', 'red', 'spot', 'moons', 'jupiter'],
            color: '#FFB347',
            diameter: 139822, // km
            mass: 317.8, // Earth masses
            distance: 5.2, // AU
            temperature: 165, // K
            moons: 95,
            type: 'gas_giant'
        },
        {
            name: 'Saturn',
            displayName: 'SATURN',
            description: 'The ringed planet, most beautiful',
            image: '../images/saturn.jpg',
            url: 'saturn.html',
            keywords: ['rings', 'beautiful', 'gas', 'giant', 'float', 'water', 'saturn'],
            color: '#F4A460',
            diameter: 116464, // km
            mass: 95.2, // Earth masses
            distance: 9.58, // AU
            temperature: 134, // K
            moons: 146,
            type: 'gas_giant'
        },
        {
            name: 'Uranus',
            displayName: 'URANUS',
            description: 'The ice giant, tilted on its side',
            image: '../images/uranus.jpg',
            url: 'uranus.html',
            keywords: ['ice', 'giant', 'tilted', 'sideways', 'cold', 'methane', 'uranus'],
            color: '#40E0D0',
            diameter: 50724, // km
            mass: 14.5, // Earth masses
            distance: 19.18, // AU
            temperature: 76, // K
            moons: 27,
            type: 'ice_giant'
        },
        {
            name: 'Neptune',
            displayName: 'NEPTUNE',
            description: 'The windiest planet, deep blue',
            image: '../images/neptune.jpg',
            url: 'neptune.html',
            keywords: ['windy', 'blue', 'ice', 'giant', 'storms', 'farthest', 'neptune'],
            color: '#4169E1',
            diameter: 49244, // km
            mass: 17.1, // Earth masses
            distance: 30.07, // AU
            temperature: 72, // K
            moons: 16,
            type: 'ice_giant'
        }
    ],

    // Get planet by name
    getPlanetByName(name) {
        return this.planets.find(planet => 
            planet.name.toLowerCase() === name.toLowerCase() ||
            planet.displayName.toLowerCase() === name.toLowerCase()
        );
    },

    // Get all planets
    getAllPlanets() {
        return this.planets;
    },

    // Get planets by type
    getPlanetsByType(type) {
        return this.planets.filter(planet => planet.type === type);
    },

    // Search planets by keyword
    searchPlanets(query) {
        const searchTerm = query.toLowerCase().trim();
        return this.planets.filter(planet => {
            // Search in name
            if (planet.name.toLowerCase().includes(searchTerm) ||
                planet.displayName.toLowerCase().includes(searchTerm)) {
                return true;
            }
            
            // Search in description
            if (planet.description.toLowerCase().includes(searchTerm)) {
                return true;
            }
            
            // Search in keywords
            return planet.keywords.some(keyword => 
                keyword.toLowerCase().includes(searchTerm)
            );
        });
    },

    // Get planet statistics
    getStatistics() {
        const stats = {
            totalPlanets: this.planets.length,
            terrestrial: this.getPlanetsByType('terrestrial').length,
            gasGiants: this.getPlanetsByType('gas_giant').length,
            iceGiants: this.getPlanetsByType('ice_giant').length,
            totalMoons: this.planets.reduce((sum, planet) => sum + planet.moons, 0),
            averageDistance: this.planets.reduce((sum, planet) => sum + planet.distance, 0) / this.planets.length,
            largestPlanet: this.planets.reduce((largest, planet) => 
                planet.diameter > largest.diameter ? planet : largest
            ),
            smallestPlanet: this.planets.reduce((smallest, planet) => 
                planet.diameter < smallest.diameter ? planet : smallest
            )
        };
        return stats;
    },

    // Get comparison data for two planets
    comparePlanets(planet1Name, planet2Name) {
        const planet1 = this.getPlanetByName(planet1Name);
        const planet2 = this.getPlanetByName(planet2Name);
        
        if (!planet1 || !planet2) {
            return null;
        }

        return {
            planet1,
            planet2,
            comparisons: {
                diameterRatio: planet1.diameter / planet2.diameter,
                massRatio: planet1.mass / planet2.mass,
                distanceRatio: planet1.distance / planet2.distance,
                temperatureRatio: planet1.temperature / planet2.temperature,
                moonsRatio: planet2.moons > 0 ? planet1.moons / planet2.moons : 'N/A'
            }
        };
    },

    // Get planets for charts
    getChartData() {
        return {
            names: this.planets.map(p => p.name),
            diameters: this.planets.map(p => p.diameter),
            masses: this.planets.map(p => p.mass),
            distances: this.planets.map(p => p.distance),
            temperatures: this.planets.map(p => p.temperature),
            moons: this.planets.map(p => p.moons),
            colors: this.planets.map(p => p.color)
        };
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = planetData;
}

// Make available globally
window.planetData = planetData; 