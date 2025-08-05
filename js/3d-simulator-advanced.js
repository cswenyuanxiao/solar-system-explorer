/**
 * Advanced 3D Solar System Simulator
 * A highly realistic 3D solar system visualization with advanced features
 */

// Wait for Three.js to be available
function waitForThreeJS() {
    return new Promise((resolve, reject) => {
        if (typeof THREE !== 'undefined') {
            resolve();
        } else {
            let attempts = 0;
            const maxAttempts = 10;
            const interval = setInterval(() => {
                attempts++;
                if (typeof THREE !== 'undefined') {
                    clearInterval(interval);
                    resolve();
                } else if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    reject(new Error('Three.js failed to load'));
                }
            }, 500);
        }
    });
}

class AdvancedSolarSystemSimulator {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.planets = {};
        this.isPlaying = false;
        this.simulationSpeed = 1;
        this.selectedObject = null;
        this.raycaster = null;
        this.mouse = null;
        this.textureLoader = null;
        this.planetTextures = null;
        this.clock = new THREE.Clock();
        
        this.init();
    }

    async init() {
        try {
            // Wait for Three.js
            await waitForThreeJS();
            
            // Initialize Three.js objects
            this.raycaster = new THREE.Raycaster();
            this.mouse = new THREE.Vector2();
            this.textureLoader = new THREE.TextureLoader();
            this.planetTextures = new PlanetTextures();
            
            // Create scene
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x000000);

            // Get container dimensions
            const container = document.getElementById('simulator-canvas');
            if (!container) {
                throw new Error('Container not found');
            }
            
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

            // Add stars background
            this.createStars();
            
            // Create Sun
            this.createSun();
            
            // Create planets
            await this.createPlanets();
            
            // Add lighting
            this.setupLighting();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Start animation
            this.animate();
            
            // Hide loading animation
            setTimeout(() => {
                const container = document.querySelector('.simulator-container');
                if (container) {
                    container.classList.add('loaded');
                }
            }, 1000);
            
            console.log('Advanced 3D Simulator initialized successfully');
        } catch (error) {
            console.error('Error initializing 3D simulator:', error);
            this.showErrorMessage(error.message);
        }
    }

    showErrorMessage(message) {
        const container = document.querySelector('.simulator-container');
        if (container) {
            container.innerHTML = `
                <div style="color: white; text-align: center; padding: 2rem;">
                    <h3>3D Simulator Error</h3>
                    <p>${message}</p>
                    <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #4facfe; border: none; color: white; border-radius: 5px; cursor: pointer;">Reload Page</button>
                </div>
            `;
        }
    }

    createStars() {
        const starsGeometry = new THREE.BufferGeometry();
        const starsMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.2,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.8
        });

        const starsVertices = [];
        for (let i = 0; i < 8000; i++) {
            const x = (Math.random() - 0.5) * 4000;
            const y = (Math.random() - 0.5) * 4000;
            const z = (Math.random() - 0.5) * 4000;
            starsVertices.push(x, y, z);
        }

        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
        const stars = new THREE.Points(starsGeometry, starsMaterial);
        this.scene.add(stars);
    }

    createSun() {
        // Create sun with realistic texture and animation
        const sunGeometry = new THREE.SphereGeometry(10, 64, 64);
        
        // Create sun material with emission
        const sunMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            emissive: 0xffff00,
            emissiveIntensity: 1.0
        });
        
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        sun.name = 'Sun';
        sun.userData = {
            type: 'star',
            name: 'Sun',
            description: 'Our star - the heart of the solar system. The Sun provides light and heat to all the planets.',
            distance: '0 AU',
            diameter: '1,392,700 km',
            orbitalPeriod: 'N/A',
            rotationSpeed: 0.01
        };
        
        this.scene.add(sun);
        this.planets.sun = sun;

        // Add sun glow effect
        const sunGlowGeometry = new THREE.SphereGeometry(10.5, 64, 64);
        const sunGlowMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            transparent: true,
            opacity: 0.4
        });
        const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
        this.scene.add(sunGlow);
    }

    async createPlanets() {
        const planetData = [
            {
                name: 'Mercury',
                distance: 15,
                size: 1.5,
                color: 0x8C7853,
                orbitalPeriod: 88,
                rotationPeriod: 58.6,
                description: 'The smallest planet, closest to the Sun. Mercury has extreme temperature variations.',
                diameter: '4,879 km',
                orbitalPeriodText: '88 Earth days',
                hasAtmosphere: false
            },
            {
                name: 'Venus',
                distance: 22,
                size: 2.2,
                color: 0xFFC649,
                orbitalPeriod: 225,
                rotationPeriod: -243, // Retrograde rotation
                description: 'The hottest planet, often called Earth\'s twin due to similar size.',
                diameter: '12,104 km',
                orbitalPeriodText: '225 Earth days',
                hasAtmosphere: true,
                atmosphereColor: 0xFFE4B5
            },
            {
                name: 'Earth',
                distance: 30,
                size: 2.4,
                color: 0x6B93D6,
                orbitalPeriod: 365,
                rotationPeriod: 1,
                description: 'Our home planet, the only known planet with life.',
                diameter: '12,742 km',
                orbitalPeriodText: '365 Earth days',
                hasAtmosphere: true,
                atmosphereColor: 0x87CEEB
            },
            {
                name: 'Mars',
                distance: 38,
                size: 1.8,
                color: 0xC1440E,
                orbitalPeriod: 687,
                rotationPeriod: 1.03,
                description: 'The red planet, target for future human exploration.',
                diameter: '6,780 km',
                orbitalPeriodText: '687 Earth days',
                hasAtmosphere: true,
                atmosphereColor: 0xFF6B35
            },
            {
                name: 'Jupiter',
                distance: 52,
                size: 5.0,
                color: 0xD8CA9D,
                orbitalPeriod: 4333,
                rotationPeriod: 0.41,
                description: 'The largest planet, a gas giant with many moons.',
                diameter: '139,820 km',
                orbitalPeriodText: '12 Earth years',
                hasAtmosphere: true,
                atmosphereColor: 0xF4A460
            },
            {
                name: 'Saturn',
                distance: 65,
                size: 4.2,
                color: 0xFAD5A5,
                orbitalPeriod: 10759,
                rotationPeriod: 0.45,
                description: 'Known for its beautiful ring system.',
                diameter: '116,460 km',
                orbitalPeriodText: '29 Earth years',
                hasAtmosphere: true,
                atmosphereColor: 0xF0E68C
            },
            {
                name: 'Uranus',
                distance: 78,
                size: 3.2,
                color: 0x4FD0E7,
                orbitalPeriod: 30687,
                rotationPeriod: -0.72, // Retrograde rotation
                description: 'An ice giant with a tilted axis.',
                diameter: '50,724 km',
                orbitalPeriodText: '84 Earth years',
                hasAtmosphere: true,
                atmosphereColor: 0x40E0D0
            },
            {
                name: 'Neptune',
                distance: 90,
                size: 3.1,
                color: 0x4B70DD,
                orbitalPeriod: 60190,
                rotationPeriod: 0.67,
                description: 'The windiest planet with the fastest winds in the solar system.',
                diameter: '49,244 km',
                orbitalPeriodText: '165 Earth years',
                hasAtmosphere: true,
                atmosphereColor: 0x4169E1
            }
        ];

        for (let i = 0; i < planetData.length; i++) {
            const data = planetData[i];
            const planet = await this.createPlanet(data, i);
            this.planets[data.name.toLowerCase()] = planet;
        }
    }

    async createPlanet(data, index) {
        const planetGeometry = new THREE.SphereGeometry(data.size, 64, 64);
        
        // Try to load texture, fallback to color if failed
        let planetMaterial;
        try {
            const texture = await this.planetTextures.getTexture(data.name);
            if (texture) {
                planetMaterial = new THREE.MeshLambertMaterial({ 
                    map: texture,
                    color: data.color 
                });
            } else {
                // Use procedural texture as fallback
                const proceduralTexture = this.planetTextures.createProceduralTexture(data.name);
                planetMaterial = new THREE.MeshLambertMaterial({ 
                    map: proceduralTexture,
                    color: data.color 
                });
            }
        } catch (error) {
            console.warn(`Failed to load texture for ${data.name}, using color fallback`);
            planetMaterial = new THREE.MeshLambertMaterial({ color: data.color });
        }
        
        const planet = new THREE.Mesh(planetGeometry, planetMaterial);
        planet.name = data.name;
        planet.userData = {
            type: 'planet',
            ...data,
            angle: (index * Math.PI * 2) / 8,
            rotationAngle: 0
        };
        
        this.scene.add(planet);

        // Add atmosphere if specified
        if (data.hasAtmosphere) {
            this.addAtmosphere(planet, data.size, data.atmosphereColor);
        }

        // Add rings for Saturn
        if (data.name === 'Saturn') {
            this.addRings(planet, data.size);
        }

        return planet;
    }

    addAtmosphere(planet, size, color) {
        const atmosphereGeometry = new THREE.SphereGeometry(size * 1.15, 64, 64);
        const atmosphereMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.2,
            side: THREE.BackSide
        });
        
        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        planet.add(atmosphere);
    }

    addRings(planet, size) {
        // Create multiple ring layers for more realistic appearance
        const ringLayers = [
            { innerRadius: size * 1.6, outerRadius: size * 2.2, opacity: 0.8 },
            { innerRadius: size * 2.3, outerRadius: size * 2.8, opacity: 0.6 },
            { innerRadius: size * 2.9, outerRadius: size * 3.4, opacity: 0.4 }
        ];

        ringLayers.forEach(layer => {
            const ringGeometry = new THREE.RingGeometry(layer.innerRadius, layer.outerRadius, 64);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: 0xFAD5A5,
                transparent: true,
                opacity: layer.opacity,
                side: THREE.DoubleSide
            });
            
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;
            planet.add(ring);
        });
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.1);
        this.scene.add(ambientLight);

        // Point light from sun
        const sunLight = new THREE.PointLight(0xffffff, 3, 300);
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
        if (this.camera) {
            this.camera.position.set(0, 50, 100);
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

        const deltaTime = this.clock.getDelta();
        const timeScale = deltaTime * this.simulationSpeed;

        Object.values(this.planets).forEach(planet => {
            if (planet.name === 'Sun') return;
            
            const data = planet.userData;
            
            // Update orbital position
            data.angle += (timeScale * 0.1) / data.orbitalPeriod;
            const x = Math.cos(data.angle) * data.distance;
            const z = Math.sin(data.angle) * data.distance;
            planet.position.set(x, 0, z);
            
            // Update rotation
            data.rotationAngle += (timeScale * 0.1) / Math.abs(data.rotationPeriod);
            planet.rotation.y = data.rotationAngle;
        });
    }

    animate() {
        if (this.renderer && this.scene && this.camera) {
            requestAnimationFrame(() => this.animate());
            
            this.updatePlanetPositions();
            this.renderer.render(this.scene, this.camera);
            
            // 定期检查导航状态（每5秒检查一次）
            if (!this.lastNavigationCheck) {
                this.lastNavigationCheck = Date.now();
            }
            
            if (Date.now() - this.lastNavigationCheck > 5000) {
                this.checkAndResetNavigation();
                this.lastNavigationCheck = Date.now();
            }
        }
    }
    
    // 检查并重置导航状态
    checkAndResetNavigation() {
        // 检查是否有导航问题
        const navLinks = document.querySelectorAll('.main-nav a');
        let hasNavigationIssue = false;
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('http')) {
                // 检查链接是否被正确设置
                if (window.location.pathname.includes('/pages/') && href.startsWith('pages/')) {
                    hasNavigationIssue = true;
                } else if (!window.location.pathname.includes('/pages/') && !href.startsWith('pages/')) {
                    hasNavigationIssue = true;
                }
            }
        });
        
        if (hasNavigationIssue) {
            console.log('🔧 检测到导航问题，正在重置...');
            this.resetNavigationState();
        }
    }
    
    // 重置导航状态
    resetNavigationState() {
        // 重新设置导航链接
        const navLinks = document.querySelectorAll('.main-nav a');
        const isPagesDirectory = window.location.pathname.includes('/pages/');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                if (isPagesDirectory) {
                    // 在pages目录下，移除pages/前缀
                    if (href.startsWith('pages/')) {
                        link.href = href.replace('pages/', '');
                    }
                } else {
                    // 在根目录下，添加pages/前缀
                    if (!href.startsWith('pages/') && !href.startsWith('http')) {
                        link.href = 'pages/' + href;
                    }
                }
            }
        });
        
        // 确保点击事件正常工作
        navLinks.forEach(link => {
            // 移除可能存在的旧事件监听器
            link.removeEventListener('click', this.handleNavClick);
            // 添加新的事件监听器
            link.addEventListener('click', this.handleNavClick);
        });
    }
    
    // 导航点击处理
    handleNavClick = function(e) {
        const href = this.getAttribute('href');
        if (href && !href.startsWith('http')) {
            console.log('🔗 导航到:', href);
            // 使用window.location进行导航
            window.location.href = href;
            e.preventDefault();
        }
    }
}

// Initialize the simulator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AdvancedSolarSystemSimulator();
}); 