// Learning Progress Tracker for Solar System Education

class ProgressTracker {
    constructor() {
        this.progress = this.loadProgress();
        this.achievements = this.loadAchievements();
        this.init();
    }

    init() {
        this.setupProgressUI();
        this.updateAllProgress();
        this.checkAchievements();
    }

    loadProgress() {
        const saved = localStorage.getItem('learningProgress');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            quizScores: [],
            lessonsCompleted: [],
            totalPoints: 0,
            studyTime: 0,
            lastStudyDate: null,
            streakDays: 0,
            achievements: []
        };
    }

    loadAchievements() {
        return [
            {
                id: 'first_lesson',
                title: 'First Steps',
                description: 'Complete your first lesson',
                icon: '📚',
                points: 10,
                unlocked: false
            },
            {
                id: 'quiz_master',
                title: 'Quiz Master',
                description: 'Score 90% or higher on a quiz',
                icon: '🏆',
                points: 25,
                unlocked: false
            },
            {
                id: 'streak_3',
                title: 'Consistent Learner',
                description: 'Study for 3 consecutive days',
                icon: '🔥',
                points: 15,
                unlocked: false
            },
            {
                id: 'streak_7',
                title: 'Dedicated Student',
                description: 'Study for 7 consecutive days',
                icon: '⭐',
                points: 50,
                unlocked: false
            },
            {
                id: 'all_lessons',
                title: 'Course Completer',
                description: 'Complete all lessons',
                icon: '🎓',
                points: 100,
                unlocked: false
            },
            {
                id: 'perfect_score',
                title: 'Perfect Score',
                description: 'Get 100% on any quiz',
                icon: '💎',
                points: 50,
                unlocked: false
            },
            {
                id: 'explorer',
                title: 'Solar System Explorer',
                description: 'Visit all planet pages',
                icon: '🚀',
                points: 30,
                unlocked: false
            },
            {
                id: 'chart_master',
                title: 'Data Visualizer',
                description: 'View all chart types',
                icon: '📊',
                points: 20,
                unlocked: false
            }
        ];
    }

    setupProgressUI() {
        const progressContainer = document.getElementById('progressTracker');
        if (!progressContainer) return;

        progressContainer.innerHTML = `
            <div class="progress-dashboard">
                <div class="dashboard-header">
                    <h2>Learning Progress</h2>
                    <div class="overall-stats">
                        <div class="stat-card">
                            <div class="stat-icon">📊</div>
                            <div class="stat-info">
                                <span class="stat-number" id="totalPoints">0</span>
                                <span class="stat-label">Total Points</span>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">📚</div>
                            <div class="stat-info">
                                <span class="stat-number" id="lessonsCompleted">0</span>
                                <span class="stat-label">Lessons</span>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">🏆</div>
                            <div class="stat-info">
                                <span class="stat-number" id="achievementsUnlocked">0</span>
                                <span class="stat-label">Achievements</span>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">🔥</div>
                            <div class="stat-info">
                                <span class="stat-number" id="streakDays">0</span>
                                <span class="stat-label">Day Streak</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="progress-sections">
                    <div class="section">
                        <h3>Recent Activity</h3>
                        <div id="recentActivity"></div>
                    </div>
                    
                    <div class="section">
                        <h3>Achievements</h3>
                        <div id="achievementsList"></div>
                    </div>
                    
                    <div class="section">
                        <h3>Learning Goals</h3>
                        <div id="learningGoals"></div>
                    </div>
                </div>
            </div>
        `;

        this.renderRecentActivity();
        this.renderAchievements();
        this.renderLearningGoals();
    }

    renderRecentActivity() {
        const activityContainer = document.getElementById('recentActivity');
        if (!activityContainer) return;

        const recentItems = this.getRecentActivity();
        
        if (recentItems.length === 0) {
            activityContainer.innerHTML = '<p class="no-activity">No recent activity. Start learning to see your progress!</p>';
            return;
        }

        activityContainer.innerHTML = recentItems.map(item => `
            <div class="activity-item">
                <div class="activity-icon">${item.icon}</div>
                <div class="activity-info">
                    <div class="activity-title">${item.title}</div>
                    <div class="activity-time">${item.time}</div>
                </div>
                <div class="activity-points">+${item.points}</div>
            </div>
        `).join('');
    }

    renderAchievements() {
        const achievementsContainer = document.getElementById('achievementsList');
        if (!achievementsContainer) return;

        achievementsContainer.innerHTML = this.achievements.map(achievement => `
            <div class="achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <div class="achievement-title">${achievement.title}</div>
                    <div class="achievement-description">${achievement.description}</div>
                </div>
                <div class="achievement-status">
                    ${achievement.unlocked ? '✅' : '🔒'}
                </div>
            </div>
        `).join('');
    }

    renderLearningGoals() {
        const goalsContainer = document.getElementById('learningGoals');
        if (!goalsContainer) return;

        const goals = this.generateLearningGoals();
        
        goalsContainer.innerHTML = goals.map(goal => `
            <div class="goal-item ${goal.completed ? 'completed' : ''}">
                <div class="goal-icon">${goal.icon}</div>
                <div class="goal-info">
                    <div class="goal-title">${goal.title}</div>
                    <div class="goal-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${goal.progress}%"></div>
                        </div>
                        <span class="progress-text">${goal.current}/${goal.target}</span>
                    </div>
                </div>
                <div class="goal-status">
                    ${goal.completed ? '✅' : '⏳'}
                </div>
            </div>
        `).join('');
    }

    generateLearningGoals() {
        const totalLessons = 5; // Based on astronomy module
        const totalQuizzes = 1; // Main quiz
        const totalPlanets = 9; // Sun + 8 planets
        const totalCharts = 4; // 4 chart types

        return [
            {
                title: 'Complete All Lessons',
                icon: '📚',
                current: this.progress.lessonsCompleted.length,
                target: totalLessons,
                progress: Math.round((this.progress.lessonsCompleted.length / totalLessons) * 100),
                completed: this.progress.lessonsCompleted.length >= totalLessons
            },
            {
                title: 'Take All Quizzes',
                icon: '🧠',
                current: this.progress.quizScores.length,
                target: totalQuizzes,
                progress: Math.round((this.progress.quizScores.length / totalQuizzes) * 100),
                completed: this.progress.quizScores.length >= totalQuizzes
            },
            {
                title: 'Explore All Planets',
                icon: '🚀',
                current: this.getVisitedPlanets().length,
                target: totalPlanets,
                progress: Math.round((this.getVisitedPlanets().length / totalPlanets) * 100),
                completed: this.getVisitedPlanets().length >= totalPlanets
            },
            {
                title: 'View All Charts',
                icon: '📊',
                current: this.getViewedCharts().length,
                target: totalCharts,
                progress: Math.round((this.getViewedCharts().length / totalCharts) * 100),
                completed: this.getViewedCharts().length >= totalCharts
            }
        ];
    }

    getRecentActivity() {
        const activities = [];
        const now = new Date();

        // Add recent quiz scores
        this.progress.quizScores.slice(-3).forEach(score => {
            activities.push({
                icon: '🧠',
                title: `Quiz Score: ${score.score}/${score.total}`,
                time: this.getTimeAgo(score.date),
                points: score.score
            });
        });

        // Add recent lesson completions
        this.progress.lessonsCompleted.slice(-3).forEach(lesson => {
            activities.push({
                icon: '📚',
                title: `Completed: ${lesson.title}`,
                time: this.getTimeAgo(lesson.date),
                points: 50
            });
        });

        // Sort by date and return recent 5
        return activities
            .sort((a, b) => new Date(b.time) - new Date(a.time))
            .slice(0, 5);
    }

    getTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        if (diffInHours < 48) return 'Yesterday';
        return `${Math.floor(diffInHours / 24)} days ago`;
    }

    updateAllProgress() {
        this.updateStreak();
        this.updateStats();
    }

    updateStreak() {
        const today = new Date().toDateString();
        const lastStudy = this.progress.lastStudyDate ? new Date(this.progress.lastStudyDate).toDateString() : null;

        if (lastStudy !== today) {
            if (lastStudy === new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()) {
                // Consecutive day
                this.progress.streakDays++;
            } else if (lastStudy !== today) {
                // Break in streak
                this.progress.streakDays = 1;
            }
            this.progress.lastStudyDate = new Date().toISOString();
        }
    }

    updateStats() {
        const totalPoints = document.getElementById('totalPoints');
        const lessonsCompleted = document.getElementById('lessonsCompleted');
        const achievementsUnlocked = document.getElementById('achievementsUnlocked');
        const streakDays = document.getElementById('streakDays');

        if (totalPoints) totalPoints.textContent = this.progress.totalPoints;
        if (lessonsCompleted) lessonsCompleted.textContent = this.progress.lessonsCompleted.length;
        if (achievementsUnlocked) achievementsUnlocked.textContent = this.achievements.filter(a => a.unlocked).length;
        if (streakDays) streakDays.textContent = this.progress.streakDays;
    }

    addQuizScore(score, total) {
        this.progress.quizScores.push({
            score: score,
            total: total,
            date: new Date().toISOString()
        });
        this.progress.totalPoints += score;
        this.saveProgress();
        this.updateAllProgress();
        this.checkAchievements();
    }

    addLessonCompletion(lessonId, lessonTitle) {
        this.progress.lessonsCompleted.push({
            id: lessonId,
            title: lessonTitle,
            date: new Date().toISOString()
        });
        this.progress.totalPoints += 50;
        this.saveProgress();
        this.updateAllProgress();
        this.checkAchievements();
    }

    addPlanetVisit(planetName) {
        if (!this.progress.visitedPlanets) {
            this.progress.visitedPlanets = [];
        }
        
        if (!this.progress.visitedPlanets.includes(planetName)) {
            this.progress.visitedPlanets.push(planetName);
            this.progress.totalPoints += 5;
            this.saveProgress();
            this.updateAllProgress();
            this.checkAchievements();
        }
    }

    addChartView(chartType) {
        if (!this.progress.viewedCharts) {
            this.progress.viewedCharts = [];
        }
        
        if (!this.progress.viewedCharts.includes(chartType)) {
            this.progress.viewedCharts.push(chartType);
            this.progress.totalPoints += 5;
            this.saveProgress();
            this.updateAllProgress();
            this.checkAchievements();
        }
    }

    getVisitedPlanets() {
        return this.progress.visitedPlanets || [];
    }

    getViewedCharts() {
        return this.progress.viewedCharts || [];
    }

    checkAchievements() {
        let newAchievements = [];

        // Check for first lesson
        if (this.progress.lessonsCompleted.length >= 1 && !this.achievements[0].unlocked) {
            this.achievements[0].unlocked = true;
            newAchievements.push(this.achievements[0]);
        }

        // Check for quiz master (90%+ score)
        const highScores = this.progress.quizScores.filter(score => 
            (score.score / score.total) >= 0.9
        );
        if (highScores.length > 0 && !this.achievements[1].unlocked) {
            this.achievements[1].unlocked = true;
            newAchievements.push(this.achievements[1]);
        }

        // Check for streak achievements
        if (this.progress.streakDays >= 3 && !this.achievements[2].unlocked) {
            this.achievements[2].unlocked = true;
            newAchievements.push(this.achievements[2]);
        }

        if (this.progress.streakDays >= 7 && !this.achievements[3].unlocked) {
            this.achievements[3].unlocked = true;
            newAchievements.push(this.achievements[3]);
        }

        // Check for all lessons completed
        if (this.progress.lessonsCompleted.length >= 5 && !this.achievements[4].unlocked) {
            this.achievements[4].unlocked = true;
            newAchievements.push(this.achievements[4]);
        }

        // Check for perfect score
        const perfectScores = this.progress.quizScores.filter(score => 
            score.score === score.total
        );
        if (perfectScores.length > 0 && !this.achievements[5].unlocked) {
            this.achievements[5].unlocked = true;
            newAchievements.push(this.achievements[5]);
        }

        // Check for all planets visited
        if (this.getVisitedPlanets().length >= 9 && !this.achievements[6].unlocked) {
            this.achievements[6].unlocked = true;
            newAchievements.push(this.achievements[6]);
        }

        // Check for all charts viewed
        if (this.getViewedCharts().length >= 4 && !this.achievements[7].unlocked) {
            this.achievements[7].unlocked = true;
            newAchievements.push(this.achievements[7]);
        }

        // Award points for new achievements
        newAchievements.forEach(achievement => {
            this.progress.totalPoints += achievement.points;
            this.showAchievementNotification(achievement);
        });

        if (newAchievements.length > 0) {
            this.saveProgress();
            this.updateAllProgress();
        }
    }

    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <h4>Achievement Unlocked!</h4>
                    <p>${achievement.title}</p>
                    <p>+${achievement.points} points</p>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }

    saveProgress() {
        localStorage.setItem('learningProgress', JSON.stringify(this.progress));
    }

    resetProgress() {
        this.progress = {
            quizScores: [],
            lessonsCompleted: [],
            totalPoints: 0,
            studyTime: 0,
            lastStudyDate: null,
            streakDays: 0,
            achievements: []
        };
        this.achievements.forEach(achievement => {
            achievement.unlocked = false;
        });
        this.saveProgress();
        this.updateAllProgress();
    }
}

// Initialize progress tracker when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.progressTracker = new ProgressTracker();
}); 