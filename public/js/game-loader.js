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
                this.loadGameInIframe();
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
                this.loadGameInIframe();
            } else if (event.key === 'F11') {
                event.preventDefault();
                this.toggleFullscreen();
            }
        });

        // 监听全屏变化
        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement) {
                this.updateStatus('🔥 全屏冲刺模式激活！');
            } else {
                this.updateStatus('🎮 已退出全屏模式');
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
     * 主要的游戏加载方法 - 使用直接iframe方法
     */
    async loadGameInIframe() {
        if (this.isLoading || this.isLoaded) {
            return;
        }

        try {
            this.isLoading = true;
            this.showLoading();
            this.recordEvent('load_started');

            // 直接创建iframe，跳过API配置
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
     * 创建游戏iframe - 直接使用embed URL
     */
    async createGameIframe() {
        return new Promise((resolve, reject) => {
            try {
                this.updateStatus('Loading Flamy Dash...');

                // 移除现有iframe
                if (this.iframe) {
                    this.iframe.remove();
                }

                // 创建新iframe
                this.iframe = document.createElement('iframe');
                this.iframe.className = 'game-iframe';
                this.iframe.src = 'https://crossy-road.io/flamy-dash.embed';
                this.iframe.title = 'Flamy Dash Game';
                this.iframe.allowFullscreen = true;
                this.iframe.setAttribute('allow', 'autoplay; fullscreen; gamepad; microphone; camera');
                this.iframe.setAttribute('loading', 'eager');

                // 设置样式
                this.iframe.style.width = '100%';
                this.iframe.style.height = '100%';
                this.iframe.style.border = 'none';
                this.iframe.style.display = 'block';

                // 设置加载事件
                this.iframe.onload = () => {
                    console.log('🔥 Flamy Dash iframe loaded successfully');
                    setTimeout(() => {
                        if (!this.isLoaded) {
                            this.onGameLoaded();
                        }
                    }, 800); // 给游戏一点时间完全加载
                    resolve();
                };

                this.iframe.onerror = () => {
                    reject(new Error('Failed to load Flamy Dash iframe'));
                };

                // 插入iframe
                this.container.appendChild(this.iframe);

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 构建游戏URL - 现在直接返回embed URL
     */
    buildGameUrl() {
        // 直接使用已知的工作URL
        return 'https://crossy-road.io/flamy-dash.embed';
    }

    /**
     * 游戏加载完成处理
     */
    onGameLoaded() {
        if (this.isLoaded) return;

        this.isLoaded = true;
        this.isLoading = false;
        this.hideLoading();
        this.updateStatus('🔥 Flamy Dash loaded successfully! Game ready to play.');
        this.recordEvent('load_completed');

        console.log('🔥 Flamy Dash loaded successfully');

        // 聚焦iframe以确保游戏可以接收键盘输入
        if (this.iframe) {
            this.iframe.focus();
        }

        // 显示全屏按钮
        const fullscreenBtn = document.querySelector('.fullscreen-btn');
        if (fullscreenBtn) {
            fullscreenBtn.style.display = 'block';
        }
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
     * 记录事件 - 简化版本，不依赖API
     */
    async recordEvent(eventType, data = {}) {
        try {
            console.log(`🎮 Event: ${eventType}`, data);
            // 可选：如果API客户端可用，则记录事件
            if (window.apiClient && typeof window.apiClient.recordGameEvent === 'function') {
                await window.apiClient.recordGameEvent(eventType, this.gameId, data);
            }
        } catch (error) {
            console.error('Failed to record event:', error);
        }
    }

    /**
     * 全屏切换功能
     */
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            const container = this.container;
            container.requestFullscreen().then(() => {
                this.updateStatus('🔥 全屏火焰冲刺模式！按ESC退出');
            }).catch(() => {
                this.updateStatus('⚠️ 全屏模式启动失败');
            });
        } else {
            document.exitFullscreen();
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