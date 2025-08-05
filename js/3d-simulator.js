/**
 * 3D Solar System Simulator
 * A comprehensive 3D solar system visualization using Three.js
 */

class SolarSystemSimulator {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.planets = {};
        this.orbits = {};
        this.isPlaying = false;
        this.simulationSpeed = 1;
        this.showOrbits = true;
        this.selectedObject = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        this.init();
        this.setupEventListeners();
        this.animate();
    }

    init() {
        try {
            // Create scene
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x000000);

            // Get container dimensions
            const container = document.getElementById('simulator-canvas');
            const containerWidth = container.clientWidth || 800;
            const containerHeight = container.clientHeight || 600;
            
            // Create camera
            this.camera = new THREE.PerspectiveCamera(
                75,
                containerWidth / containerHeight,
                0.1,
                1000
            );
            this.camera.position.set(0, 50, 100);

            // Create renderer
            this.renderer = new THREE.WebGLRenderer({ antialias: true });
            this.renderer.setSize(containerWidth, containerHeight);
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            
            container.appendChild(this.renderer.domElement);

            // Create controls
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.maxDistance = 200;
            this.controls.minDistance = 10;

            // Add stars background
            this.createStars();
            
            // Create Sun
            this.createSun();
            
            // Create planets
            this.createPlanets();
            
            // Create orbits
            this.createOrbits();
            
            // Add lighting
            this.setupLighting();
            
            // Hide loading animation
            setTimeout(() => {
                const container = document.querySelector('.simulator-container');
                if (container) {
                    container.classList.add('loaded');
                }
            }, 1000);
            
            console.log('3D Simulator initialized successfully');
        } catch (error) {
            console.error('Error initializing 3D simulator:', error);
            this.showErrorMessage();
        }
    }

    showErrorMessage() {
        const container = document.querySelector('.simulator-container');
        if (container) {
            container.innerHTML = `
                <div style="color: white; text-align: center; padding: 2rem;">
                    <h3>3D Simulator Error</h3>
                    <p>Unable to initialize 3D graphics. Please check your browser supports WebGL.</p>
                    <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #4facfe; border: none; color: white; border-radius: 5px; cursor: pointer;">Reload Page</button>
                </div>
            `;
        }
    }

    createStars() {
        const starsGeometry = new THREE.BufferGeometry();
        const starsMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.5,
            sizeAttenuation: true
        });

        const starsVertices = [];
        for (let i = 0; i < 5000; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;
            starsVertices.push(x, y, z);
        }

        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
        const stars = new THREE.Points(starsGeometry, starsMaterial);
        this.scene.add(stars);
    }

    createSun() {
        const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            emissive: 0xffff00,
            emissiveIntensity: 0.5
        });
        
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        sun.name = 'Sun';
        sun.userData = {
            type: 'star',
            name: 'Sun',
            description: 'Our star - the heart of the solar system. The Sun provides light and heat to all the planets.',
            distance: '0 AU',
            diameter: '1,392,700 km',
            orbitalPeriod: 'N/A'
        };
        
        this.scene.add(sun);
        this.planets.sun = sun;

        // Add sun glow effect
        const sunGlowGeometry = new THREE.SphereGeometry(5.5, 32, 32);
        const sunGlowMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            transparent: true,
            opacity: 0.3
        });
        const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
        this.scene.add(sunGlow);
    }

    createPlanets() {
        const planetData = [
            {
                name: 'Mercury',
                distance: 10,
                size: 0.8,
                color: 0x8C7853,
                orbitalPeriod: 88,
                description: 'The smallest planet, closest to the Sun. Mercury has extreme temperature variations.',
                diameter: '4,879 km',
                orbitalPeriodText: '88 Earth days'
            },
            {
                name: 'Venus',
                distance: 15,
                size: 1.2,
                color: 0xFFC649,
                orbitalPeriod: 225,
                description: 'The hottest planet, often called Earth\'s twin due to similar size.',
                diameter: '12,104 km',
                orbitalPeriodText: '225 Earth days'
            },
            {
                name: 'Earth',
                distance: 20,
                size: 1.3,
                color: 0x6B93D6,
                orbitalPeriod: 365,
                description: 'Our home planet, the only known planet with life.',
                diameter: '12,742 km',
                orbitalPeriodText: '365 Earth days'
            },
            {
                name: 'Mars',
                distance: 25,
                size: 1.1,
                color: 0xC1440E,
                orbitalPeriod: 687,
                description: 'The red planet, target for future human exploration.',
                diameter: '6,780 km',
                orbitalPeriodText: '687 Earth days'
            },
            {
                name: 'Jupiter',
                distance: 35,
                size: 2.5,
                color: 0xD8CA9D,
                orbitalPeriod: 4333,
                description: 'The largest planet, a gas giant with many moons.',
                diameter: '139,820 km',
                orbitalPeriodText: '12 Earth years'
            },
            {
                name: 'Saturn',
                distance: 45,
                size: 2.2,
                color: 0xFAD5A5,
                orbitalPeriod: 10759,
                description: 'Known for its beautiful ring system.',
                diameter: '116,460 km',
                orbitalPeriodText: '29 Earth years'
            },
            {
                name: 'Uranus',
                distance: 55,
                size: 1.8,
                color: 0x4FD0E7,
                orbitalPeriod: 30687,
                description: 'An ice giant with a tilted axis.',
                diameter: '50,724 km',
                orbitalPeriodText: '84 Earth years'
            },
            {
                name: 'Neptune',
                distance: 65,
                size: 1.7,
                color: 0x4B70DD,
                orbitalPeriod: 60190,
                description: 'The windiest planet with the fastest winds in the solar system.',
                diameter: '49,244 km',
                orbitalPeriodText: '165 Earth years'
            }
        ];

        planetData.forEach((data, index) => {
            const planetGeometry = new THREE.SphereGeometry(data.size, 32, 32);
            const planetMaterial = new THREE.MeshLambertMaterial({ color: data.color });
            
            const planet = new THREE.Mesh(planetGeometry, planetMaterial);
            planet.name = data.name;
            planet.userData = {
                type: 'planet',
                ...data,
                angle: (index * Math.PI * 2) / planetData.length
            };
            
            this.scene.add(planet);
            this.planets[data.name.toLowerCase()] = planet;
        });
    }

    createOrbits() {
        Object.values(this.planets).forEach(planet => {
            if (planet.name === 'Sun') return;
            
            const orbitGeometry = new THREE.RingGeometry(
                planet.userData.distance - 0.1,
                planet.userData.distance + 0.1,
                64
            );
            const orbitMaterial = new THREE.MeshBasicMaterial({
                color: 0x444444,
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide
            });
            
            const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
            orbit.rotation.x = Math.PI / 2;
            this.scene.add(orbit);
            this.orbits[planet.name] = orbit;
        });
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);

        // Point light from sun
        const sunLight = new THREE.PointLight(0xffffff, 1, 100);
        sunLight.position.set(0, 0, 0);
        sunLight.castShadow = true;
        this.scene.add(sunLight);

        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(50, 50, 50);
        this.scene.add(directionalLight);
    }

    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', () => {
            if (this.renderer && this.camera) {
                const container = document.getElementById('simulator-canvas');
                const containerWidth = container.clientWidth;
                const containerHeight = container.clientHeight;
                
                this.camera.aspect = containerWidth / containerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(containerWidth, containerHeight);
            }
        });

        // Mouse click for object selection
        if (this.renderer) {
            this.renderer.domElement.addEventListener('click', (event) => {
                this.handleObjectClick(event);
            });
        }

        // Control buttons
        const playPauseBtn = document.getElementById('play-pause');
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => {
                this.togglePlayPause();
            });
        }

        const resetViewBtn = document.getElementById('reset-view');
        if (resetViewBtn) {
            resetViewBtn.addEventListener('click', () => {
                this.resetView();
            });
        }

        const toggleOrbitsBtn = document.getElementById('toggle-orbits');
        if (toggleOrbitsBtn) {
            toggleOrbitsBtn.addEventListener('click', () => {
                this.toggleOrbits();
            });
        }

        const closeInfoBtn = document.getElementById('close-info');
        if (closeInfoBtn) {
            closeInfoBtn.addEventListener('click', () => {
                this.hideInfoPanel();
            });
        }

        // Speed control
        const speedControl = document.getElementById('speed-control');
        if (speedControl) {
            speedControl.addEventListener('input', (event) => {
                this.simulationSpeed = parseFloat(event.target.value);
                const speedValue = document.getElementById('speed-value');
                if (speedValue) {
                    speedValue.textContent = this.simulationSpeed + 'x';
                }
            });
        }

        // Camera distance control
        const cameraDistanceControl = document.getElementById('camera-distance');
        if (cameraDistanceControl) {
            cameraDistanceControl.addEventListener('input', (event) => {
                const distance = parseInt(event.target.value);
                this.camera.position.set(0, distance * 0.5, distance);
                const distanceValue = document.getElementById('distance-value');
                if (distanceValue) {
                    distanceValue.textContent = distance + ' AU';
                }
            });
        }

        // Keyboard controls
        document.addEventListener('keydown', (event) => {
            this.handleKeyboard(event);
        });
    }

    handleObjectClick(event) {
        if (!this.renderer || !this.camera) return;
        
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children);

        if (intersects.length > 0) {
            const object = intersects[0].object;
            if (object.userData.type === 'planet' || object.userData.type === 'star') {
                this.selectObject(object);
            }
        }
    }

    selectObject(object) {
        this.selectedObject = object;
        this.showInfoPanel(object);
    }

    showInfoPanel(object) {
        const panel = document.getElementById('info-panel');
        const title = document.getElementById('selected-object');
        const description = document.getElementById('object-description');
        const distanceStat = document.getElementById('distance-stat');
        const diameterStat = document.getElementById('diameter-stat');
        const orbitalPeriodStat = document.getElementById('orbital-period-stat');

        if (panel && title && description && distanceStat && diameterStat && orbitalPeriodStat) {
            title.textContent = object.userData.name;
            description.textContent = object.userData.description;
            distanceStat.textContent = object.userData.distance;
            diameterStat.textContent = object.userData.diameter;
            orbitalPeriodStat.textContent = object.userData.orbitalPeriodText;

            panel.classList.add('active');
        }
    }

    hideInfoPanel() {
        const panel = document.getElementById('info-panel');
        if (panel) {
            panel.classList.remove('active');
        }
        this.selectedObject = null;
    }

    togglePlayPause() {
        this.isPlaying = !this.isPlaying;
        const button = document.getElementById('play-pause');
        if (button) {
            const icon = button.querySelector('.btn-icon');
            const text = button.querySelector('.btn-text');
            
            if (this.isPlaying) {
                icon.textContent = '⏸';
                text.textContent = 'Pause';
            } else {
                icon.textContent = '▶';
                text.textContent = 'Play';
            }
        }
    }

    resetView() {
        if (this.camera && this.controls) {
            this.camera.position.set(0, 50, 100);
            this.controls.reset();
        }
    }

    toggleOrbits() {
        this.showOrbits = !this.showOrbits;
        const button = document.getElementById('toggle-orbits');
        
        Object.values(this.orbits).forEach(orbit => {
            orbit.visible = this.showOrbits;
        });
        
        if (button) {
            button.classList.toggle('active');
        }
    }

    handleKeyboard(event) {
        if (!this.camera) return;
        
        const speed = 5;
        switch(event.key.toLowerCase()) {
            case 'w':
                this.camera.position.z -= speed;
                break;
            case 's':
                this.camera.position.z += speed;
                break;
            case 'a':
                this.camera.position.x -= speed;
                break;
            case 'd':
                this.camera.position.x += speed;
                break;
            case 'q':
                this.camera.position.y += speed;
                break;
            case 'e':
                this.camera.position.y -= speed;
                break;
        }
    }

    updatePlanetPositions() {
        if (!this.isPlaying) return;

        Object.values(this.planets).forEach(planet => {
            if (planet.name === 'Sun') return;
            
            const data = planet.userData;
            data.angle += (0.01 * this.simulationSpeed) / data.orbitalPeriod;
            
            const x = Math.cos(data.angle) * data.distance;
            const z = Math.sin(data.angle) * data.distance;
            
            planet.position.set(x, 0, z);
        });
    }

    animate() {
        if (this.renderer && this.scene && this.camera) {
            requestAnimationFrame(() => this.animate());
            
            this.updatePlanetPositions();
            if (this.controls) {
                this.controls.update();
            }
            this.renderer.render(this.scene, this.camera);
        }
    }
}

// Initialize the simulator when the page loads and Three.js is available
document.addEventListener('DOMContentLoaded', () => {
    // Wait for Three.js to be available
    if (typeof THREE !== 'undefined') {
        new SolarSystemSimulator();
    } else {
        // Fallback: wait a bit more for CDN to load
        setTimeout(() => {
            if (typeof THREE !== 'undefined') {
                new SolarSystemSimulator();
            } else {
                console.error('Three.js not loaded');
                const container = document.querySelector('.simulator-container');
                if (container) {
                    container.innerHTML = 
                        '<div style="color: white; text-align: center; padding: 2rem;">' +
                        '<h3>3D Simulator Loading Error</h3>' +
                        '<p>Unable to load 3D graphics library. Please refresh the page or check your internet connection.</p>' +
                        '<button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #4facfe; border: none; color: white; border-radius: 5px; cursor: pointer;">Reload Page</button>' +
                        '</div>';
                }
            }
        }, 3000);
    }
}); 