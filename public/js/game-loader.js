/**
 * Flamy Dash iframe游戏加载器
 * 负责动态加载游戏、状态管理和用户交互
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

        // DOM元素引用
        this.elements = {};
        this.setupElements();
        this.bindEvents();
        this.setupMessageListener();

        console.log('🎮 Flamy Dash iframe loader initialized');
    }

    /**
     * 初始化DOM元素引用
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

        // 验证必需元素是否存在
        const requiredElements = ['playButton', 'loadingOverlay', 'playOverlay'];
        for (const elementKey of requiredElements) {
            if (!this.elements[elementKey]) {
                console.error(`Required element not found: ${elementKey}`);
            }
        }
    }

    /**
     * 绑定事件监听器
     */
    bindEvents() {
        // 播放按钮点击事件
        if (this.elements.playButton) {
            this.elements.playButton.addEventListener('click', () => {
                this.redirectToGame();
            });
        }

        // 重试按钮点击事件
        if (this.elements.retryButton) {
            this.elements.retryButton.addEventListener('click', () => {
                this.hideError();
                this.loadGameInIframe();
            });
        }

        // 键盘事件
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space' && !this.isLoaded && !this.isLoading) {
                event.preventDefault();
                this.redirectToGame();
            }
        });
    }

    /**
     * 设置postMessage监听器
     */
    setupMessageListener() {
        window.addEventListener('message', (event) => {
            // 安全检查：验证消息来源
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
     * 处理来自游戏iframe的消息
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
     * 处理游戏事件
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
     * 处理游戏状态更新
     */
    handleGameStatus(data) {
        if (data.loading_progress !== undefined) {
            this.updateLoadingProgress(data.loading_progress);
        }
    }

    /**
     * 处理游戏错误
     */
    handleGameError(data) {
        console.error('Game error received:', data);
        this.showError(data.message || 'Game encountered an error');
    }

    /**
     * 直接跳转到游戏页面
     */
    async redirectToGame() {
        try {
            this.recordEvent('redirect_clicked');

            // 获取游戏配置以获取重定向URL
            await this.fetchGameConfig();

            if (this.gameConfig && this.gameConfig.regisinfo && this.gameConfig.regisinfo.redirect_url) {
                const redirectUrl = this.gameConfig.regisinfo.redirect_url;
                console.log('🎮 Redirecting to:', redirectUrl);
                window.open(redirectUrl, '_blank');
            } else {
                // 备用跳转URL
                window.open('https://crossy-road.io/flamy-dash.embed', '_blank');
            }
        } catch (error) {
            console.error('Failed to redirect:', error);
            // 即使获取配置失败，也尝试跳转到备用URL
            window.open('https://crossy-road.io/flamy-dash.embed', '_blank');
        }
    }

    /**
     * 主要的游戏加载方法 (保留用于重试功能)
     */
    async loadGameInIframe() {
        if (this.isLoading || this.isLoaded) {
            return;
        }

        try {
            this.isLoading = true;
            this.showLoading();
            this.recordEvent('load_started');

            // 获取游戏配置
            await this.fetchGameConfig();

            // 验证配置
            if (!this.validateGameConfig()) {
                throw new Error('Invalid game configuration');
            }

            // 创建iframe
            await this.createGameIframe();

            // 开始加载超时检测
            this.startLoadingTimeout();

        } catch (error) {
            console.error('Failed to load game:', error);
            this.showError(error.message || 'Failed to load the game');
            this.recordEvent('load_failed', { error: error.message });
        }
    }

    /**
     * 获取游戏配置
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
     * 验证游戏配置
     */
    validateGameConfig() {
        if (!this.gameConfig || !this.gameConfig.gameinfo) {
            return false;
        }

        const { gameinfo } = this.gameConfig;
        return gameinfo.iframe_url && gameinfo.width && gameinfo.height;
    }

    /**
     * 创建游戏iframe
     */
    async createGameIframe() {
        return new Promise((resolve, reject) => {
            try {
                this.updateStatus('Loading game...');

                // 移除现有iframe
                if (this.iframe) {
                    this.iframe.remove();
                }

                // 创建新iframe
                this.iframe = document.createElement('iframe');
                this.iframe.className = 'game-iframe';
                this.iframe.src = this.buildGameUrl();
                this.iframe.allowFullscreen = true;
                this.iframe.setAttribute('loading', 'lazy');

                // 设置sandbox属性
                if (this.gameConfig.gameinfo.iframe_sandbox) {
                    this.iframe.sandbox = this.gameConfig.gameinfo.iframe_sandbox;
                }

                // 设置加载事件
                this.iframe.onload = () => {
                    console.log('🎮 Iframe loaded successfully');
                    setTimeout(() => {
                        if (!this.isLoaded) {
                            this.onGameLoaded();
                        }
                    }, 2000); // 给游戏2秒时间发送loaded消息
                    resolve();
                };

                this.iframe.onerror = () => {
                    reject(new Error('Failed to load game iframe'));
                };

                // 插入iframe
                this.container.appendChild(this.iframe);

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 构建游戏URL
     */
    buildGameUrl() {
        const { gameinfo } = this.gameConfig;
        let gameUrl = gameinfo.iframe_url;

        // 添加参数
        const params = new URLSearchParams({
            width: gameinfo.width,
            height: gameinfo.height,
            fullscreen: gameinfo.enable_fullscreen,
            sound: gameinfo.enable_sound,
            parent: window.location.origin,
            timestamp: Date.now()
        });

        const separator = gameUrl.includes('?') ? '&' : '?';
        return `${gameUrl}${separator}${params.toString()}`;
    }

    /**
     * 游戏加载完成处理
     */
    onGameLoaded() {
        if (this.isLoaded) return;

        this.isLoaded = true;
        this.isLoading = false;
        this.hideLoading();
        this.updateStatus('Game loaded! Enjoy playing Flamy Dash.');
        this.recordEvent('load_completed');

        console.log('🎮 Game loaded successfully');

        // 发送初始化消息给游戏
        this.sendMessageToGame({
            type: 'PARENT_READY',
            config: {
                origin: window.location.origin,
                fullscreen_available: this.isFullscreenSupported()
            }
        });
    }

    /**
     * 向游戏iframe发送消息
     */
    sendMessageToGame(message) {
        if (this.iframe && this.iframe.contentWindow) {
            this.iframe.contentWindow.postMessage(message, '*');
        }
    }

    /**
     * 检查是否支持全屏
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
     * 开始加载超时检测
     */
    startLoadingTimeout() {
        setTimeout(() => {
            if (this.isLoading && !this.isLoaded) {
                console.warn('⚠️ Game loading timeout');
                this.showError('Game loading is taking longer than expected. Please check your connection and try again.');
                this.recordEvent('load_timeout');
            }
        }, 30000); // 30秒超时
    }

    /**
     * 更新加载进度
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
     * 显示加载状态
     */
    showLoading() {
        this.hidePlayOverlay();
        this.hideError();

        if (this.elements.loadingOverlay) {
            this.elements.loadingOverlay.style.display = 'flex';
        }

        // 模拟加载进度
        this.simulateLoadingProgress();
    }

    /**
     * 隐藏加载状态
     */
    hideLoading() {
        if (this.elements.loadingOverlay) {
            this.elements.loadingOverlay.style.display = 'none';
        }
    }

    /**
     * 隐藏播放覆盖层
     */
    hidePlayOverlay() {
        if (this.elements.playOverlay) {
            this.elements.playOverlay.style.display = 'none';
        }
    }

    /**
     * 显示错误
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
     * 隐藏错误
     */
    hideError() {
        if (this.elements.errorOverlay) {
            this.elements.errorOverlay.style.display = 'none';
        }
    }

    /**
     * 更新状态文本
     */
    updateStatus(message) {
        if (this.elements.gameStatus) {
            this.elements.gameStatus.textContent = message;
        }
        console.log('📱 Status:', message);
    }

    /**
     * 模拟加载进度
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
                progress = 90; // 不要到达100%直到真正加载完成
            }

            this.updateLoadingProgress(progress);
        }, 500);
    }

    /**
     * 记录事件
     */
    async recordEvent(eventType, data = {}) {
        try {
            await window.apiClient.recordGameEvent(eventType, this.gameId, data);
        } catch (error) {
            console.error('Failed to record event:', error);
        }
    }

    /**
     * 销毁加载器
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

// 当DOM加载完成时初始化游戏加载器
document.addEventListener('DOMContentLoaded', () => {
    window.gameLoader = new FlamyDashIframeLoader('game-container');
});