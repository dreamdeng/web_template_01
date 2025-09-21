#!/usr/bin/env node

/**
 * Cloudflare Pages 静态构建脚本
 * 将完整的iframe集成系统构建为纯静态版本
 */

const fs = require('fs');
const path = require('path');

console.log(`
🌐 Cloudflare Pages 静态构建
==========================

正在构建静态版本到 out/ 目录...
`);

class StaticBuilder {
    constructor() {
        this.outDir = 'out';
        this.domain = 'flamydash.com'; // 可以通过环境变量覆盖
        this.gameConfig = require('./server/config/games.json');
    }

    async build() {
        try {
            // 清理输出目录
            this.cleanOutputDir();

            // 创建目录结构
            this.createDirectories();

            // 复制静态资源
            this.copyStaticFiles();

            // 生成静态配置文件
            this.generateStaticConfig();

            // 创建静态版本的API客户端
            this.createStaticApiClient();

            // 创建静态版本的游戏加载器
            this.createStaticGameLoader();

            // 复制并优化HTML
            this.processHTML();

            // 复制游戏文件
            this.copyGameFiles();

            // 生成Cloudflare配置
            this.generateCloudflareConfig();

            console.log(`
✅ 静态构建完成！

📁 输出目录: ${this.outDir}/
🌐 部署到: Cloudflare Pages
📋 文件清单:
   - index.html (主页面)
   - js/ (JavaScript文件)
   - css/ (样式文件)
   - games/ (游戏文件)
   - config/ (静态配置)
   - _headers (Cloudflare配置)

🚀 部署步骤:
1. 将 ${this.outDir}/ 目录上传到Cloudflare Pages
2. 或连接Git仓库，设置构建命令为: npm run build:static
`);

        } catch (error) {
            console.error('❌ 构建失败:', error.message);
            process.exit(1);
        }
    }

    cleanOutputDir() {
        if (fs.existsSync(this.outDir)) {
            fs.rmSync(this.outDir, { recursive: true, force: true });
        }
        console.log('🧹 清理输出目录');
    }

    createDirectories() {
        const dirs = [
            this.outDir,
            `${this.outDir}/js`,
            `${this.outDir}/css`,
            `${this.outDir}/games`,
            `${this.outDir}/config`,
            `${this.outDir}/assets`
        ];

        dirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });

        console.log('📁 创建目录结构');
    }

    copyStaticFiles() {
        // 复制CSS文件
        this.copyFile('public/css/game-integration.css', `${this.outDir}/css/game-integration.css`);

        // 复制图片资源
        if (fs.existsSync('public/flamy-dash.png')) {
            this.copyFile('public/flamy-dash.png', `${this.outDir}/flamy-dash.png`);
        }

        // 复制其他静态资源
        if (fs.existsSync('public/assets')) {
            this.copyDirectory('public/assets', `${this.outDir}/assets`);
        }

        console.log('📄 复制静态文件');
    }

    generateStaticConfig() {
        // 生成静态游戏配置
        const staticConfig = {
            games: this.gameConfig.games,
            domain: this.domain,
            version: '1.0.0',
            build_time: new Date().toISOString(),
            api_mode: 'static'
        };

        fs.writeFileSync(
            `${this.outDir}/config/games.json`,
            JSON.stringify(staticConfig, null, 2)
        );

        // 生成AzGame兼容的静态响应
        const azGameResponse = this.generateAzGameResponse();
        fs.writeFileSync(
            `${this.outDir}/config/azgame-response.json`,
            JSON.stringify(azGameResponse, null, 2)
        );

        console.log('⚙️  生成静态配置');
    }

    generateAzGameResponse() {
        const game = this.gameConfig.games['flamy-dash'];

        return {
            adsinfo: {
                enable: this.gameConfig.ads_config.enable,
                ads_debug: this.gameConfig.ads_config.ads_debug,
                time_show_inter: this.gameConfig.ads_config.time_show_inter,
                time_show_reward: this.gameConfig.ads_config.time_show_reward,
                sdk_type: this.gameConfig.ads_config.sdk_type
            },
            regisinfo: {
                allow_play: this.gameConfig.default_settings.allow_play,
                unlock_timer: game.unlock_timer,
                name: game.name,
                description: game.description,
                image: `https://${this.domain}/flamy-dash.png`,
                rtype: this.gameConfig.default_settings.rtype,
                redirect_url: game.redirect_url,
                rating: game.rating,
                category: game.category,
                tags: game.tags
            },
            gameinfo: {
                iframe_url: `https://${this.domain}/games/flamy-dash/latest/`,
                width: game.width,
                height: game.height,
                version: game.version,
                enable_fullscreen: game.enable_fullscreen,
                enable_sound: game.enable_sound,
                controls: game.controls,
                iframe_sandbox: this.gameConfig.default_settings.iframe_sandbox
            },
            static_mode: true,
            domain: this.domain
        };
    }

    createStaticApiClient() {
        const staticApiClient = `/**
 * 静态版API客户端 - Cloudflare Pages优化版本
 * 使用预生成的配置文件替代动态API调用
 */
class StaticAPIClient {
    constructor() {
        this.domain = '${this.domain}';
        this.gameConfig = null;
        this.isStatic = true;

        // 预加载配置
        this.loadStaticConfig();

        console.log('🌐 Static API Client initialized for Cloudflare Pages');
    }

    async loadStaticConfig() {
        try {
            const response = await fetch('/config/games.json');
            if (response.ok) {
                this.gameConfig = await response.json();
            } else {
                console.warn('Failed to load static config, using fallback');
                this.gameConfig = this.getFallbackConfig();
            }
        } catch (error) {
            console.warn('Error loading static config:', error);
            this.gameConfig = this.getFallbackConfig();
        }
    }

    getFallbackConfig() {
        return {
            games: {
                'flamy-dash': {
                    id: 'flamy-dash',
                    name: 'Flamy Dash',
                    description: 'Master the flames of precision',
                    image: \`https://\${this.domain}/flamy-dash.png\`,
                    iframe_url: \`https://\${this.domain}/games/flamy-dash/latest/\`,
                    width: 960,
                    height: 600,
                    enable_fullscreen: 'yes',
                    enable_sound: 'yes'
                }
            }
        };
    }

    /**
     * 静态版本的游戏配置获取
     */
    async getGameConfig(gameId = 'flamy-dash') {
        try {
            // 等待配置加载完成
            if (!this.gameConfig) {
                await this.loadStaticConfig();
            }

            // 加载预生成的AzGame响应
            const response = await fetch('/config/azgame-response.json');
            if (response.ok) {
                const azGameResponse = await response.json();

                // 记录静态API调用
                this.recordEvent('static_api_call', { gameId, timestamp: Date.now() });

                return azGameResponse;
            } else {
                throw new Error('Failed to load static game config');
            }
        } catch (error) {
            console.error('Failed to get static game config:', error);

            // 返回fallback配置
            const game = this.gameConfig?.games?.[gameId] || this.getFallbackConfig().games[gameId];

            return {
                adsinfo: {
                    enable: 'no',
                    ads_debug: 'yes',
                    time_show_inter: 60,
                    time_show_reward: 60,
                    sdk_type: 'iframe'
                },
                regisinfo: {
                    allow_play: 'yes',
                    unlock_timer: 15,
                    name: game.name,
                    description: game.description,
                    image: game.image,
                    rtype: '1',
                    redirect_url: \`https://\${this.domain}/\`
                },
                gameinfo: {
                    iframe_url: game.iframe_url,
                    width: game.width,
                    height: game.height,
                    version: '1.0.0',
                    enable_fullscreen: game.enable_fullscreen,
                    enable_sound: game.enable_sound
                },
                static_mode: true
            };
        }
    }

    /**
     * 静态版本的事件记录（使用localStorage）
     */
    async recordGameEvent(eventType, gameId, data = {}) {
        try {
            const event = {
                event_type: eventType,
                game_id: gameId,
                data: {
                    ...data,
                    timestamp: new Date().toISOString(),
                    url: window.location.href,
                    user_agent: navigator.userAgent,
                    static_mode: true
                }
            };

            // 存储到localStorage进行本地分析
            const events = JSON.parse(localStorage.getItem('flamydash_events') || '[]');
            events.push(event);

            // 只保留最近100个事件
            if (events.length > 100) {
                events.splice(0, events.length - 100);
            }

            localStorage.setItem('flamydash_events', JSON.stringify(events));

            // 可以集成Google Analytics或其他第三方分析服务
            if (typeof gtag !== 'undefined') {
                gtag('event', eventType, {
                    custom_parameter_game_id: gameId,
                    custom_parameter_data: JSON.stringify(data)
                });
            }

            console.log('📊 Event recorded (static):', event);
        } catch (error) {
            console.error('Failed to record event:', error);
        }
    }

    /**
     * 获取游戏列表
     */
    async getGamesList() {
        if (!this.gameConfig) {
            await this.loadStaticConfig();
        }

        const gamesList = Object.keys(this.gameConfig.games).map(gameId => {
            const game = this.gameConfig.games[gameId];
            return {
                id: gameId,
                name: game.name,
                description: game.description,
                image: game.image,
                category: game.category || 'arcade',
                tags: game.tags || [],
                rating: game.rating || '4.5'
            };
        });

        return {
            games: gamesList,
            total: gamesList.length,
            static_mode: true
        };
    }

    /**
     * 健康检查（静态版本）
     */
    async healthCheck() {
        return {
            status: 'healthy',
            mode: 'static',
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            games_available: Object.keys(this.gameConfig?.games || {}).length,
            domain: this.domain
        };
    }

    // 保持与原API客户端的兼容性
    async request() { throw new Error('Dynamic requests not available in static mode'); }
    async get() { throw new Error('Dynamic requests not available in static mode'); }
    async post() { throw new Error('Dynamic requests not available in static mode'); }

    // 编码工具方法保持不变
    encodeGameParams(params) {
        try {
            const jsonString = JSON.stringify(params);
            return btoa(unescape(encodeURIComponent(jsonString)));
        } catch (error) {
            console.error('Parameter encoding failed:', error);
            throw new Error('Failed to encode parameters');
        }
    }

    createGameParams(gameId = 'flamy-dash') {
        return {
            d: this.domain,
            gid: gameId,
            hn: window.location.hostname,
            pn: window.location.pathname,
            ts: Math.floor(Date.now() / 1000),
            ie: 'yes',
            ref: document.referrer || '',
            ua: navigator.userAgent,
            lang: navigator.language || 'en-US',
            v: '1.0',
            static: 'true'
        };
    }

    // 辅助方法
    recordEvent(type, data) {
        console.log(\`📊 \${type}:\`, data);
    }
}

// 创建全局静态API客户端实例
window.apiClient = new StaticAPIClient();`;

        fs.writeFileSync(`${this.outDir}/js/api-client.js`, staticApiClient);
        console.log('🔌 创建静态API客户端');
    }

    createStaticGameLoader() {
        // 读取原始游戏加载器并进行静态化修改
        let gameLoader = fs.readFileSync('public/js/game-loader.js', 'utf8');

        // 添加静态模式标识
        gameLoader = gameLoader.replace(
            'console.log(\'🎮 Flamy Dash iframe loader initialized\');',
            `console.log('🎮 Flamy Dash iframe loader initialized (Static Mode)');
        this.staticMode = true;
        this.domain = '${this.domain}';`
        );

        // 修改iframe URL构建逻辑
        gameLoader = gameLoader.replace(
            'buildGameUrl() {',
            `buildGameUrl() {
        // 静态模式下使用固定的iframe URL
        if (this.staticMode) {
            const baseUrl = \`https://\${this.domain}/games/flamy-dash/latest/\`;
            const params = new URLSearchParams({
                width: this.gameConfig.gameinfo.width,
                height: this.gameConfig.gameinfo.height,
                fullscreen: this.gameConfig.gameinfo.enable_fullscreen,
                sound: this.gameConfig.gameinfo.enable_sound,
                parent: window.location.origin,
                timestamp: Date.now(),
                static: 'true'
            });
            const separator = baseUrl.includes('?') ? '&' : '?';
            return \`\${baseUrl}\${separator}\${params.toString()}\`;
        }`
        );

        fs.writeFileSync(`${this.outDir}/js/game-loader.js`, gameLoader);
        console.log('🎮 创建静态游戏加载器');
    }

    processHTML() {
        let html = fs.readFileSync('public/index.html', 'utf8');

        // 更新域名相关的URL
        html = html.replace(/flamydash\.com/g, this.domain);

        // 确保使用正确的静态资源路径
        html = html.replace(/src="\/js\//g, 'src="/js/');
        html = html.replace(/href="\/css\//g, 'href="/css/');

        // 添加静态模式标识
        html = html.replace(
            '<title>',
            `<!-- Static build for Cloudflare Pages -->
    <meta name="build-mode" content="static">
    <meta name="build-time" content="${new Date().toISOString()}">
    <title>`
        );

        fs.writeFileSync(`${this.outDir}/index.html`, html);
        console.log('📄 处理HTML文件');
    }

    copyGameFiles() {
        if (fs.existsSync('games')) {
            this.copyDirectory('games', `${this.outDir}/games`);
            console.log('🎮 复制游戏文件');
        }
    }

    generateCloudflareConfig() {
        // 生成 _headers 文件
        const headers = `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin

/games/*
  X-Frame-Options: ALLOWALL

/*.json
  Cache-Control: public, max-age=300

/js/*
  Cache-Control: public, max-age=86400

/css/*
  Cache-Control: public, max-age=86400

/*.png
  Cache-Control: public, max-age=604800

/*.jpg
  Cache-Control: public, max-age=604800`;

        fs.writeFileSync(`${this.outDir}/_headers`, headers);

        // 生成 _redirects 文件 (如果需要)
        const redirects = `# Cloudflare Pages redirects
/api/* https://api.${this.domain}/:splat 200
/health /config/health.json 200`;

        fs.writeFileSync(`${this.outDir}/_redirects`, redirects);

        // 生成健康检查文件
        const healthCheck = {
            status: 'healthy',
            mode: 'static',
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            platform: 'cloudflare-pages',
            domain: this.domain
        };

        fs.writeFileSync(`${this.outDir}/config/health.json`, JSON.stringify(healthCheck, null, 2));

        console.log('☁️  生成Cloudflare配置');
    }

    // 工具方法
    copyFile(src, dest) {
        if (fs.existsSync(src)) {
            const destDir = path.dirname(dest);
            if (!fs.existsSync(destDir)) {
                fs.mkdirSync(destDir, { recursive: true });
            }
            fs.copyFileSync(src, dest);
        }
    }

    copyDirectory(src, dest) {
        if (!fs.existsSync(src)) return;

        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }

        const entries = fs.readdirSync(src, { withFileTypes: true });

        for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);

            if (entry.isDirectory()) {
                this.copyDirectory(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }
}

// 主函数
async function main() {
    // 从环境变量获取域名配置
    if (process.env.DOMAIN) {
        console.log(`🌐 使用指定域名: ${process.env.DOMAIN}`);
    }

    const builder = new StaticBuilder();
    if (process.env.DOMAIN) {
        builder.domain = process.env.DOMAIN;
    }

    await builder.build();
}

// 执行构建
if (require.main === module) {
    main().catch(error => {
        console.error('❌ 构建过程出错:', error);
        process.exit(1);
    });
}

module.exports = StaticBuilder;