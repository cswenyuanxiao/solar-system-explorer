/**
 * User System Management
 * Handles user authentication, profile management, and dashboard functionality
 */

class UserSystem {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.init();
    }

    init() {
        this.checkAuthentication();
        this.setupEventListeners();
        this.loadUserData();
    }

    checkAuthentication() {
        const userData = localStorage.getItem('userData');
        if (userData) {
            try {
                this.currentUser = JSON.parse(userData);
                this.isAuthenticated = true;
                this.showDashboard();
            } catch (error) {
                console.error('Error parsing user data:', error);
                this.logout();
            }
        } else {
            this.showLogin();
        }
    }

    setupEventListeners() {
        // Form submissions
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        document.getElementById('profile-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleProfileUpdate();
        });

        // Navigation
        document.getElementById('show-register').addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegister();
        });

        document.getElementById('show-login').addEventListener('click', (e) => {
            e.preventDefault();
            this.showLogin();
        });

        // Logout
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.logout();
        });

        // Settings
        document.getElementById('email-notifications').addEventListener('change', (e) => {
            this.updatePreference('emailNotifications', e.target.checked);
        });

        document.getElementById('dark-mode').addEventListener('change', (e) => {
            this.updatePreference('darkMode', e.target.checked);
        });

        document.getElementById('auto-save').addEventListener('change', (e) => {
            this.updatePreference('autoSave', e.target.checked);
        });
    }

    showLogin() {
        this.hideAllSections();
        document.getElementById('login-section').classList.add('active');
    }

    showRegister() {
        this.hideAllSections();
        document.getElementById('register-section').classList.add('active');
    }

    showDashboard() {
        this.hideAllSections();
        document.getElementById('dashboard-section').classList.add('active');
        this.updateDashboard();
    }

    hideAllSections() {
        document.querySelectorAll('.user-section').forEach(section => {
            section.classList.remove('active');
        });
    }

    async handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        if (!email || !password) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        try {
            // Simulate API call
            const user = await this.authenticateUser(email, password);
            if (user) {
                this.currentUser = user;
                this.isAuthenticated = true;
                
                if (rememberMe) {
                    localStorage.setItem('userData', JSON.stringify(user));
                } else {
                    sessionStorage.setItem('userData', JSON.stringify(user));
                }
                
                this.showMessage('Login successful!', 'success');
                setTimeout(() => {
                    this.showDashboard();
                }, 1000);
            } else {
                this.showMessage('Invalid email or password', 'error');
            }
        } catch (error) {
            this.showMessage('Login failed. Please try again.', 'error');
        }
    }

    async handleRegister() {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        const agreeTerms = document.getElementById('agree-terms').checked;

        if (!name || !email || !password || !confirmPassword) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showMessage('Passwords do not match', 'error');
            return;
        }

        if (!agreeTerms) {
            this.showMessage('Please agree to the terms and conditions', 'error');
            return;
        }

        if (password.length < 6) {
            this.showMessage('Password must be at least 6 characters long', 'error');
            return;
        }

        try {
            // Simulate API call
            const user = await this.registerUser(name, email, password);
            if (user) {
                this.currentUser = user;
                this.isAuthenticated = true;
                localStorage.setItem('userData', JSON.stringify(user));
                
                this.showMessage('Account created successfully!', 'success');
                setTimeout(() => {
                    this.showDashboard();
                }, 1000);
            } else {
                this.showMessage('Registration failed. Please try again.', 'error');
            }
        } catch (error) {
            this.showMessage('Registration failed. Please try again.', 'error');
        }
    }

    async handleProfileUpdate() {
        const name = document.getElementById('profile-name').value;
        const email = document.getElementById('profile-email').value;

        if (!name || !email) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        try {
            // Simulate API call
            const updatedUser = await this.updateProfile(name, email);
            if (updatedUser) {
                this.currentUser = updatedUser;
                localStorage.setItem('userData', JSON.stringify(updatedUser));
                this.showMessage('Profile updated successfully!', 'success');
                this.updateDashboard();
            } else {
                this.showMessage('Profile update failed. Please try again.', 'error');
            }
        } catch (error) {
            this.showMessage('Profile update failed. Please try again.', 'error');
        }
    }

    logout() {
        this.currentUser = null;
        this.isAuthenticated = false;
        localStorage.removeItem('userData');
        sessionStorage.removeItem('userData');
        this.showLogin();
        this.showMessage('Logged out successfully', 'success');
    }

    updateDashboard() {
        if (!this.currentUser) return;

        // Update user info
        document.getElementById('user-name').textContent = this.currentUser.name;
        document.getElementById('user-email').textContent = this.currentUser.email;
        document.getElementById('member-since').textContent = this.formatDate(this.currentUser.createdAt);

        // Update progress
        this.updateProgress();
        
        // Update activity
        this.updateActivity();
        
        // Update favorites
        this.updateFavorites();
        
        // Update settings
        this.updateSettings();
    }

    updateProgress() {
        const progress = this.currentUser.progress || 75;
        const progressPath = document.getElementById('progress-path');
        const progressPercentage = document.getElementById('progress-percentage');
        
        const circumference = 2 * Math.PI * 15.9155;
        const offset = circumference - (progress / 100) * circumference;
        
        progressPath.style.strokeDasharray = circumference;
        progressPath.style.strokeDashoffset = offset;
        progressPercentage.textContent = `${progress}%`;

        // Update stats
        document.getElementById('lessons-completed').textContent = this.currentUser.stats?.lessonsCompleted || 12;
        document.getElementById('quiz-score').textContent = `${this.currentUser.stats?.quizScore || 85}%`;
        document.getElementById('achievements-earned').textContent = this.currentUser.stats?.achievementsEarned || 8;
    }

    updateActivity() {
        const activityList = document.getElementById('activity-list');
        const activities = this.currentUser.activities || this.getDefaultActivities();
        
        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">${activity.icon}</div>
                <div class="activity-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                </div>
                <div class="activity-time">${activity.time}</div>
            </div>
        `).join('');
    }

    updateFavorites() {
        const favoritesGrid = document.getElementById('favorites-grid');
        const favorites = this.currentUser.favorites || this.getDefaultFavorites();
        
        favoritesGrid.innerHTML = favorites.map(planet => `
            <div class="favorite-planet">
                <div class="planet-icon">${planet.icon}</div>
                <h4>${planet.name}</h4>
                <p>${planet.description}</p>
            </div>
        `).join('');
    }

    updateSettings() {
        // Update profile form
        document.getElementById('profile-name').value = this.currentUser.name;
        document.getElementById('profile-email').value = this.currentUser.email;

        // Update preferences
        const preferences = this.currentUser.preferences || {};
        document.getElementById('email-notifications').checked = preferences.emailNotifications || false;
        document.getElementById('dark-mode').checked = preferences.darkMode || false;
        document.getElementById('auto-save').checked = preferences.autoSave || true;
    }

    updatePreference(key, value) {
        if (!this.currentUser.preferences) {
            this.currentUser.preferences = {};
        }
        this.currentUser.preferences[key] = value;
        localStorage.setItem('userData', JSON.stringify(this.currentUser));
    }

    showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;

        // Insert at the top of the container
        const container = document.querySelector('.user-container');
        container.insertBefore(messageElement, container.firstChild);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5000);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long' 
        });
    }

    // Mock API methods
    async authenticateUser(email, password) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock authentication
        if (email === 'demo@example.com' && password === 'password') {
            return {
                id: 1,
                name: 'Demo User',
                email: 'demo@example.com',
                createdAt: '2024-01-15',
                progress: 75,
                stats: {
                    lessonsCompleted: 12,
                    quizScore: 85,
                    achievementsEarned: 8
                },
                preferences: {
                    emailNotifications: true,
                    darkMode: false,
                    autoSave: true
                }
            };
        }
        return null;
    }

    async registerUser(name, email, password) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock registration
        return {
            id: Date.now(),
            name: name,
            email: email,
            createdAt: new Date().toISOString(),
            progress: 0,
            stats: {
                lessonsCompleted: 0,
                quizScore: 0,
                achievementsEarned: 0
            },
            preferences: {
                emailNotifications: true,
                darkMode: false,
                autoSave: true
            }
        };
    }

    async updateProfile(name, email) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
            ...this.currentUser,
            name: name,
            email: email
        };
    }

    getDefaultActivities() {
        return [
            {
                icon: '📚',
                title: 'Completed Lesson',
                description: 'Finished "Introduction to Solar System"',
                time: '2 hours ago'
            },
            {
                icon: '🎯',
                title: 'Quiz Completed',
                description: 'Scored 90% on Planetary Quiz',
                time: '1 day ago'
            },
            {
                icon: '🏆',
                title: 'Achievement Unlocked',
                description: 'Earned "Space Explorer" badge',
                time: '3 days ago'
            },
            {
                icon: '⭐',
                title: 'Added to Favorites',
                description: 'Added Jupiter to favorites',
                time: '1 week ago'
            }
        ];
    }

    getDefaultFavorites() {
        return [
            {
                icon: '🌍',
                name: 'Earth',
                description: 'Our home planet'
            },
            {
                icon: '🔴',
                name: 'Mars',
                description: 'The red planet'
            },
            {
                icon: '🪐',
                name: 'Saturn',
                description: 'Ringed giant'
            }
        ];
    }

    loadUserData() {
        // Load user data from localStorage or sessionStorage
        const userData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
        if (userData) {
            try {
                this.currentUser = JSON.parse(userData);
                this.isAuthenticated = true;
            } catch (error) {
                console.error('Error loading user data:', error);
            }
        }
    }
}

// Initialize user system when page loads
document.addEventListener('DOMContentLoaded', () => {
    new UserSystem();
}); 