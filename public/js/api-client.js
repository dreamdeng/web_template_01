/**
 * API客户端类
 * 负责与后端API通信
 */
class APIClient {
    constructor(baseUrl = '/api') {
        this.baseUrl = baseUrl;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        };
    }

    /**
     * 通用HTTP请求方法
     */
    async request(url, options = {}) {
        const fullUrl = `${this.baseUrl}${url}`;
        const config = {
            headers: { ...this.defaultHeaders, ...options.headers },
            ...options
        };

        try {
            const response = await fetch(fullUrl, config);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else {
                return await response.text();
            }
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    /**
     * GET请求
     */
    async get(url, params = {}) {
        const searchParams = new URLSearchParams(params);
        const queryString = searchParams.toString();
        const fullUrl = queryString ? `${url}?${queryString}` : url;

        return this.request(fullUrl, { method: 'GET' });
    }

    /**
     * POST请求
     */
    async post(url, data = {}) {
        return this.request(url, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    /**
     * 编码游戏参数为Base64
     */
    encodeGameParams(params) {
        try {
            const jsonString = JSON.stringify(params);
            return btoa(unescape(encodeURIComponent(jsonString)));
        } catch (error) {
            console.error('Parameter encoding failed:', error);
            throw new Error('Failed to encode parameters');
        }
    }

    /**
     * 创建游戏请求参数
     */
    createGameParams(gameId = 'flamy-dash') {
        return {
            d: window.location.hostname || 'flamydash.com',
            gid: gameId,
            hn: window.location.hostname,
            pn: window.location.pathname,
            ts: Math.floor(Date.now() / 1000),
            ie: 'yes',
            ref: document.referrer || '',
            ua: navigator.userAgent,
            lang: navigator.language || 'en-US',
            v: '1.0'
        };
    }

    /**
     * 获取游戏配置
     */
    async getGameConfig(gameId = 'flamy-dash') {
        try {
            const params = this.createGameParams(gameId);
            const encodedParams = this.encodeGameParams(params);

            return await this.get('/sdk/gmadsv1', { params: encodedParams });
        } catch (error) {
            console.error('Failed to get game config:', error);
            throw error;
        }
    }

    /**
     * 记录游戏事件
     */
    async recordGameEvent(eventType, gameId, data = {}) {
        try {
            return await this.post('/analytics/events', {
                event_type: eventType,
                game_id: gameId,
                data: {
                    ...data,
                    timestamp: new Date().toISOString(),
                    url: window.location.href,
                    user_agent: navigator.userAgent
                }
            });
        } catch (error) {
            console.error('Failed to record game event:', error);
            // 事件记录失败不应该影响游戏功能
        }
    }

    /**
     * 获取游戏列表
     */
    async getGamesList() {
        try {
            return await this.get('/games');
        } catch (error) {
            console.error('Failed to get games list:', error);
            throw error;
        }
    }

    /**
     * 健康检查
     */
    async healthCheck() {
        try {
            return await this.get('/health');
        } catch (error) {
            console.error('Health check failed:', error);
            throw error;
        }
    }
}

// 创建全局API客户端实例
window.apiClient = new APIClient();