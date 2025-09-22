/**
 * Flamy Dash iframe game loader
 * Handles dynamic game loading, state management and user interaction
 */
class FlamyDashIframeLoader {
    constructor(containerId) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.gameId = 'flamy-dash';
        this.gameConfig = null;
        this.iframe = null;
        this.isLoading = false;
        this.isLoaded = false;
        this.loadingProgress = 0;

        // DOM element references
        this.elements = {};
        this.setupElements();
        this.bindEvents();
        this.setupMessageListener();

        console.log('🎮 Flamy Dash iframe loader initialized');
    }

    /**
     * Initialize DOM element references
     */
    setupElements() {
        this.elements = {
            gameStatus: document.getElementById('game-status'),
            loadingOverlay: document.getElementById('loading-overlay'),
            playOverlay: document.getElementById('play-overlay'),
            errorOverlay: document.getElementById('error-overlay'),
            playButton: document.getElementById('play-button'),
            retryButton: document.getElementById('retry-button'),
            loadingText: document.querySelector('.loading-text'),
            loadingProgressBar: document.getElementById('loading-progress-bar'),
            loadingPercentage: document.getElementById('loading-percentage'),
            errorText: document.getElementById('error-text')
        };

        // Verify required elements exist
        const requiredElements = ['playButton', 'loadingOverlay', 'playOverlay'];
        for (const elementKey of requiredElements) {
            if (!this.elements[elementKey]) {
                console.error(`Required element not found: ${elementKey}`);
            }
        }
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Play button click event
        if (this.elements.playButton) {
            this.elements.playButton.addEventListener('click', () => {
                this.loadGameInIframe();
            });
        }

        // Retry button click event
        if (this.elements.retryButton) {
            this.elements.retryButton.addEventListener('click', () => {
                this.hideError();
                this.loadGameInIframe();
            });
        }

        // Keyboard events
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space' && !this.isLoaded && !this.isLoading) {
                event.preventDefault();
                this.loadGameInIframe();
            } else if (event.key === 'F11') {
                event.preventDefault();
                this.toggleFullscreen();
            }
        });

        // Listen for fullscreen changes
        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement) {
                this.updateStatus('🔥 Fullscreen dash mode activated!');
            } else {
                this.updateStatus('🎮 Exited fullscreen mode');
            }
        });
    }

    /**
     * Setup postMessage listener
     */
    setupMessageListener() {
        window.addEventListener('message', (event) => {
            // Security check: verify message source
            if (!this.iframe || event.source !== this.iframe.contentWindow) {
                return;
            }

            try {
                const message = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
                this.handleGameMessage(message);
            } catch (error) {
                console.error('Failed to parse game message:', error);
            }
        });
    }

    /**
     * Handle messages from game iframe
     */
    handleGameMessage(message) {
        const { type, event: eventName, data } = message;

        switch (type) {
            case 'GAME_EVENT':
                this.handleGameEvent(eventName, data);
                break;
            case 'GAME_STATUS':
                this.handleGameStatus(data);
                break;
            case 'GAME_ERROR':
                this.handleGameError(data);
                break;
            default:
                console.log('Unknown game message:', message);
        }
    }

    /**
     * Handle game events
     */
    handleGameEvent(eventName, data) {
        console.log(`🎮 Game event: ${eventName}`, data);

        switch (eventName) {
            case 'loaded':
                this.onGameLoaded();
                break;
            case 'started':
                this.recordEvent('game_started');
                break;
            case 'paused':
                this.recordEvent('game_paused');
                break;
            case 'resumed':
                this.recordEvent('game_resumed');
                break;
            case 'ended':
                this.recordEvent('game_ended', data);
                break;
            case 'score':
                this.recordEvent('score_achieved', data);
                break;
        }
    }

    /**
     * Handle game status updates
     */
    handleGameStatus(data) {
        if (data.loading_progress !== undefined) {
            this.updateLoadingProgress(data.loading_progress);
        }
    }

    /**
     * Handle game errors
     */
    handleGameError(data) {
        console.error('Game error received:', data);
        this.showError(data.message || 'Game encountered an error');
    }

    /**
     * Main game loading method - using direct iframe approach
     */
    async loadGameInIframe() {
        if (this.isLoading || this.isLoaded) {
            return;
        }

        try {
            this.isLoading = true;
            this.showLoading();
            this.recordEvent('load_started');

            // Create iframe directly, skip API configuration
            await this.createGameIframe();

            // Start loading timeout detection
            this.startLoadingTimeout();

        } catch (error) {
            console.error('Failed to load game:', error);
            this.showError(error.message || 'Failed to load the game');
            this.recordEvent('load_failed', { error: error.message });
        }
    }

    /**
     * Get game configuration
     */
    async fetchGameConfig() {
        try {
            this.updateStatus('Fetching game configuration...');
            this.gameConfig = await window.apiClient.getGameConfig(this.gameId);
            console.log('🎮 Game config loaded:', this.gameConfig);
        } catch (error) {
            throw new Error('Failed to fetch game configuration');
        }
    }

    /**
     * Validate game configuration
     */
    validateGameConfig() {
        if (!this.gameConfig || !this.gameConfig.gameinfo) {
            return false;
        }

        const { gameinfo } = this.gameConfig;
        return gameinfo.iframe_url && gameinfo.width && gameinfo.height;
    }

    /**
     * Create game iframe - directly using embed URL
     */
    async createGameIframe() {
        return new Promise((resolve, reject) => {
            try {
                this.updateStatus('Loading Flamy Dash...');

                // Remove existing iframe
                if (this.iframe) {
                    this.iframe.remove();
                }

                // Create new iframe
                this.iframe = document.createElement('iframe');
                this.iframe.className = 'game-iframe';
                this.iframe.src = 'https://crossy-road.io/flamy-dash.embed';
                this.iframe.title = 'Flamy Dash Game';
                this.iframe.allowFullscreen = true;
                this.iframe.setAttribute('allow', 'autoplay; fullscreen; gamepad; microphone; camera');
                this.iframe.setAttribute('loading', 'eager');

                // Set styles
                this.iframe.style.width = '100%';
                this.iframe.style.height = '100%';
                this.iframe.style.border = 'none';
                this.iframe.style.display = 'block';

                // Set loading events
                this.iframe.onload = () => {
                    console.log('🔥 Flamy Dash iframe loaded successfully');
                    setTimeout(() => {
                        if (!this.isLoaded) {
                            this.onGameLoaded();
                        }
                    }, 800); // Give game time to fully load
                    resolve();
                };

                this.iframe.onerror = () => {
                    reject(new Error('Failed to load Flamy Dash iframe'));
                };

                // Insert iframe
                this.container.appendChild(this.iframe);

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Build game URL - now directly returns embed URL
     */
    buildGameUrl() {
        // Use known working URL directly
        return 'https://crossy-road.io/flamy-dash.embed';
    }

    /**
     * Game loading completion handler
     */
    onGameLoaded() {
        if (this.isLoaded) return;

        this.isLoaded = true;
        this.isLoading = false;
        this.hideLoading();
        this.updateStatus('🔥 Flamy Dash loaded successfully! Game ready to play.');
        this.recordEvent('load_completed');

        console.log('🔥 Flamy Dash loaded successfully');

        // Focus iframe to ensure game can receive keyboard input
        if (this.iframe) {
            this.iframe.focus();
        }

        // Show fullscreen button
        const fullscreenBtn = document.querySelector('.fullscreen-btn');
        if (fullscreenBtn) {
            fullscreenBtn.style.display = 'block';
        }
    }

    /**
     * Send message to game iframe
     */
    sendMessageToGame(message) {
        if (this.iframe && this.iframe.contentWindow) {
            this.iframe.contentWindow.postMessage(message, '*');
        }
    }

    /**
     * Check if fullscreen is supported
     */
    isFullscreenSupported() {
        return !!(
            document.fullscreenEnabled ||
            document.webkitFullscreenEnabled ||
            document.mozFullScreenEnabled ||
            document.msFullscreenEnabled
        );
    }

    /**
     * Start loading timeout detection
     */
    startLoadingTimeout() {
        setTimeout(() => {
            if (this.isLoading && !this.isLoaded) {
                console.warn('⚠️ Game loading timeout');
                this.showError('Game loading is taking longer than expected. Please check your connection and try again.');
                this.recordEvent('load_timeout');
            }
        }, 30000); // 30 second timeout
    }

    /**
     * Update loading progress
     */
    updateLoadingProgress(progress) {
        this.loadingProgress = Math.max(0, Math.min(100, progress));

        if (this.elements.loadingProgressBar) {
            this.elements.loadingProgressBar.style.width = `${this.loadingProgress}%`;
        }

        if (this.elements.loadingPercentage) {
            this.elements.loadingPercentage.textContent = `${Math.round(this.loadingProgress)}%`;
        }
    }

    /**
     * Show loading state
     */
    showLoading() {
        this.hidePlayOverlay();
        this.hideError();

        if (this.elements.loadingOverlay) {
            this.elements.loadingOverlay.style.display = 'flex';
        }

        // Simulate loading progress
        this.simulateLoadingProgress();
    }

    /**
     * Hide loading state
     */
    hideLoading() {
        if (this.elements.loadingOverlay) {
            this.elements.loadingOverlay.style.display = 'none';
        }
    }

    /**
     * Hide play overlay
     */
    hidePlayOverlay() {
        if (this.elements.playOverlay) {
            this.elements.playOverlay.style.display = 'none';
        }
    }

    /**
     * Show error
     */
    showError(message) {
        this.isLoading = false;
        this.hideLoading();

        if (this.elements.errorOverlay) {
            this.elements.errorOverlay.style.display = 'flex';
        }

        if (this.elements.errorText) {
            this.elements.errorText.textContent = message;
        }
    }

    /**
     * Hide error
     */
    hideError() {
        if (this.elements.errorOverlay) {
            this.elements.errorOverlay.style.display = 'none';
        }
    }

    /**
     * Update status text
     */
    updateStatus(message) {
        if (this.elements.gameStatus) {
            this.elements.gameStatus.textContent = message;
        }
        console.log('📱 Status:', message);
    }

    /**
     * Simulate loading progress
     */
    simulateLoadingProgress() {
        let progress = 0;
        const interval = setInterval(() => {
            if (!this.isLoading || this.isLoaded) {
                clearInterval(interval);
                return;
            }

            progress += Math.random() * 15;
            if (progress > 90) {
                progress = 90; // Don't reach 100% until actually loaded
            }

            this.updateLoadingProgress(progress);
        }, 500);
    }

    /**
     * Record event - simplified version, doesn't depend on API
     */
    async recordEvent(eventType, data = {}) {
        try {
            console.log(`🎮 Event: ${eventType}`, data);
            // Optional: record event if API client available
            if (window.apiClient && typeof window.apiClient.recordGameEvent === 'function') {
                await window.apiClient.recordGameEvent(eventType, this.gameId, data);
            }
        } catch (error) {
            console.error('Failed to record event:', error);
        }
    }

    /**
     * Fullscreen toggle functionality
     */
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            const container = this.container;
            container.requestFullscreen().then(() => {
                this.updateStatus('🔥 Fullscreen flame dash mode! Press ESC to exit');
            }).catch(() => {
                this.updateStatus('⚠️ Fullscreen mode failed to start');
            });
        } else {
            document.exitFullscreen();
        }
    }

    /**
     * Destroy loader
     */
    destroy() {
        if (this.iframe) {
            this.iframe.remove();
            this.iframe = null;
        }

        this.isLoading = false;
        this.isLoaded = false;
        this.gameConfig = null;

        console.log('🎮 Game loader destroyed');
    }
}

// Initialize game loader when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gameLoader = new FlamyDashIframeLoader('game-container');
});