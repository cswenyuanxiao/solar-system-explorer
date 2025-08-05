/**
 * Planet Textures Manager
 * Provides realistic planet textures with fallback options
 */

class PlanetTextures {
    constructor() {
        this.textureLoader = new THREE.TextureLoader();
        this.textureCache = new Map();
    }

    // Get texture with fallback
    async getTexture(planetName) {
        const textureUrls = this.getTextureUrls(planetName);
        
        for (const url of textureUrls) {
            try {
                const texture = await this.loadTexture(url);
                if (texture) {
                    console.log(`Loaded texture for ${planetName} from ${url}`);
                    return texture;
                }
            } catch (error) {
                console.warn(`Failed to load texture from ${url} for ${planetName}`);
                continue;
            }
        }
        
        // Return null if all textures fail
        console.warn(`All texture loading failed for ${planetName}, using color fallback`);
        return null;
    }

    getTextureUrls(planetName) {
        const baseUrls = {
            'mercury': [
                'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/mercury.jpg',
                'https://upload.wikimedia.org/wikipedia/commons/d/d9/Mercury_in_color_-_Prockter07_centered.jpg'
            ],
            'venus': [
                'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/venus.jpg',
                'https://upload.wikimedia.org/wikipedia/commons/e/e5/Venus-real_color.jpg'
            ],
            'earth': [
                'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth.jpg',
                'https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg'
            ],
            'mars': [
                'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/mars.jpg',
                'https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg'
            ],
            'jupiter': [
                'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/jupiter.jpg',
                'https://upload.wikimedia.org/wikipedia/commons/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg'
            ],
            'saturn': [
                'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/saturn.jpg',
                'https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg'
            ],
            'uranus': [
                'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/uranus.jpg',
                'https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg'
            ],
            'neptune': [
                'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/neptune.jpg',
                'https://upload.wikimedia.org/wikipedia/commons/6/63/Neptune_-_Voyager_2.jpg'
            ]
        };

        return baseUrls[planetName.toLowerCase()] || [];
    }

    loadTexture(url) {
        return new Promise((resolve, reject) => {
            // Check cache first
            if (this.textureCache.has(url)) {
                resolve(this.textureCache.get(url));
                return;
            }

            this.textureLoader.load(
                url,
                (texture) => {
                    // Cache the texture
                    this.textureCache.set(url, texture);
                    resolve(texture);
                },
                undefined,
                (error) => {
                    console.error(`Failed to load texture from ${url}:`, error);
                    reject(error);
                }
            );
        });
    }

    // Create procedural texture as fallback
    createProceduralTexture(planetName, size = 512) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // Base colors for each planet
        const colors = {
            'mercury': { base: '#8C7853', features: '#6B5B47' },
            'venus': { base: '#FFC649', features: '#E6B800' },
            'earth': { base: '#6B93D6', features: '#4A7C59' },
            'mars': { base: '#C1440E', features: '#8B2E0A' },
            'jupiter': { base: '#D8CA9D', features: '#B8A87D' },
            'saturn': { base: '#FAD5A5', features: '#E6C085' },
            'uranus': { base: '#4FD0E7', features: '#3BA8B8' },
            'neptune': { base: '#4B70DD', features: '#3A5BB8' }
        };

        const color = colors[planetName.toLowerCase()] || { base: '#888888', features: '#666666' };

        // Create base color
        ctx.fillStyle = color.base;
        ctx.fillRect(0, 0, size, size);

        // Add some noise and features
        for (let i = 0; i < 1000; i++) {
            const x = Math.random() * size;
            const y = Math.random() * size;
            const radius = Math.random() * 3 + 1;
            
            ctx.fillStyle = color.features;
            ctx.globalAlpha = Math.random() * 0.3;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }

        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);

        return texture;
    }
}

// Export for use in other files
window.PlanetTextures = PlanetTextures; 