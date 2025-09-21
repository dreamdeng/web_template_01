#!/usr/bin/env node

/**
 * Flamy Dash iframe集成系统测试脚本
 * 验证API、文件结构和功能完整性
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

console.log(`
🧪 Flamy Dash iframe集成系统测试
================================
`);

// 测试结果收集器
class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    async test(name, testFn) {
        try {
            console.log(`⏳ 测试: ${name}`);
            await testFn();
            console.log(`✅ 通过: ${name}`);
            this.passed++;
        } catch (error) {
            console.log(`❌ 失败: ${name} - ${error.message}`);
            this.failed++;
        }
    }

    summary() {
        console.log(`
📊 测试结果摘要:
================
✅ 通过: ${this.passed}
❌ 失败: ${this.failed}
📈 总计: ${this.passed + this.failed}
${this.failed === 0 ? '🎉 所有测试都通过了！' : '⚠️  有测试失败，请检查上面的错误信息'}
`);
        return this.failed === 0;
    }
}

// HTTP请求工具
function makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const req = http.request(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const result = {
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data: res.headers['content-type']?.includes('application/json')
                            ? JSON.parse(data)
                            : data
                    };
                    resolve(result);
                } catch (error) {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data
                    });
                }
            });
        });

        req.on('error', reject);
        req.setTimeout(5000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
        req.end();
    });
}

// Base64编码工具 (复制自encoder.js)
function encodeParams(params) {
    const jsonString = JSON.stringify(params);
    return Buffer.from(jsonString, 'utf8').toString('base64');
}

async function runTests() {
    const runner = new TestRunner();
    const baseUrl = 'http://localhost:3000';

    // 测试1: 文件结构检查
    await runner.test('项目文件结构', () => {
        const requiredFiles = [
            'server/app.js',
            'server/config/games.json',
            'server/controllers/gameController.js',
            'server/routes/game-api.js',
            'server/utils/encoder.js',
            'public/index.html',
            'public/js/game-loader.js',
            'public/js/api-client.js',
            'public/css/game-integration.css',
            'games/flamy-dash/latest/index.html',
            'package.json'
        ];

        for (const file of requiredFiles) {
            if (!fs.existsSync(file)) {
                throw new Error(`缺少文件: ${file}`);
            }
        }
    });

    // 测试2: 服务器健康检查
    await runner.test('服务器健康检查', async () => {
        const response = await makeRequest(`${baseUrl}/api/health`);

        if (response.statusCode !== 200) {
            throw new Error(`健康检查失败，状态码: ${response.statusCode}`);
        }

        if (!response.data.status || response.data.status !== 'healthy') {
            throw new Error('服务器状态不健康');
        }
    });

    // 测试3: 主页面加载
    await runner.test('主页面加载', async () => {
        const response = await makeRequest(`${baseUrl}/`);

        if (response.statusCode !== 200) {
            throw new Error(`主页加载失败，状态码: ${response.statusCode}`);
        }

        if (!response.data.includes('Flamy Dash')) {
            throw new Error('主页内容不正确');
        }
    });

    // 测试4: 游戏列表API
    await runner.test('游戏列表API', async () => {
        const response = await makeRequest(`${baseUrl}/api/games`);

        if (response.statusCode !== 200) {
            throw new Error(`游戏列表API失败，状态码: ${response.statusCode}`);
        }

        if (!response.data.games || !Array.isArray(response.data.games)) {
            throw new Error('游戏列表格式不正确');
        }

        const flamyDash = response.data.games.find(game => game.id === 'flamy-dash');
        if (!flamyDash) {
            throw new Error('找不到Flamy Dash游戏');
        }
    });

    // 测试5: 游戏配置API (AzGame兼容)
    await runner.test('游戏配置API', async () => {
        const params = {
            d: 'flamydash.com',
            gid: 'flamy-dash',
            hn: 'localhost',
            pn: '/',
            ts: Math.floor(Date.now() / 1000),
            ie: 'yes',
            v: '1.0'
        };

        const encodedParams = encodeParams(params);
        const response = await makeRequest(`${baseUrl}/api/sdk/gmadsv1?params=${encodedParams}`);

        if (response.statusCode !== 200) {
            throw new Error(`游戏配置API失败，状态码: ${response.statusCode}`);
        }

        const { adsinfo, regisinfo, gameinfo } = response.data;

        if (!adsinfo || !regisinfo || !gameinfo) {
            throw new Error('API响应格式不完整');
        }

        if (!gameinfo.iframe_url || !gameinfo.width || !gameinfo.height) {
            throw new Error('游戏信息不完整');
        }
    });

    // 测试6: 游戏嵌入页面
    await runner.test('游戏嵌入页面', async () => {
        const response = await makeRequest(`${baseUrl}/games/flamy-dash/latest/`);

        if (response.statusCode !== 200) {
            throw new Error(`游戏嵌入页面失败，状态码: ${response.statusCode}`);
        }

        if (!response.data.includes('GameEmbedController')) {
            throw new Error('游戏嵌入页面内容不正确');
        }
    });

    // 测试7: 静态资源
    await runner.test('静态资源加载', async () => {
        const resources = [
            '/js/game-loader.js',
            '/js/api-client.js',
            '/css/game-integration.css',
            '/flamy-dash.png'
        ];

        for (const resource of resources) {
            const response = await makeRequest(`${baseUrl}${resource}`);
            if (response.statusCode !== 200) {
                throw new Error(`资源加载失败: ${resource} (${response.statusCode})`);
            }
        }
    });

    // 测试8: API错误处理
    await runner.test('API错误处理', async () => {
        // 测试无效参数
        const response1 = await makeRequest(`${baseUrl}/api/sdk/gmadsv1`);
        if (response1.statusCode !== 400) {
            throw new Error('缺少参数时应返回400错误');
        }

        // 测试无效Base64
        const response2 = await makeRequest(`${baseUrl}/api/sdk/gmadsv1?params=invalid-base64`);
        if (response2.statusCode !== 400) {
            throw new Error('无效Base64时应返回400错误');
        }

        // 测试不存在的游戏
        const response3 = await makeRequest(`${baseUrl}/games/non-existent/latest/`);
        if (response3.statusCode !== 404) {
            throw new Error('不存在的游戏应返回404错误');
        }
    });

    // 测试9: CORS配置
    await runner.test('CORS配置', async () => {
        const response = await makeRequest(`${baseUrl}/api/health`, {
            headers: {
                'Origin': 'http://localhost:3000'
            }
        });

        if (!response.headers['access-control-allow-origin']) {
            throw new Error('CORS头缺失');
        }
    });

    // 测试10: 安全头
    await runner.test('安全头配置', async () => {
        const response = await makeRequest(`${baseUrl}/`);

        const securityHeaders = [
            'x-content-type-options',
            'x-frame-options',
            'x-xss-protection'
        ];

        for (const header of securityHeaders) {
            if (!response.headers[header]) {
                throw new Error(`安全头缺失: ${header}`);
            }
        }
    });

    return runner.summary();
}

// 主函数
async function main() {
    console.log('🔍 开始运行集成测试...\n');

    try {
        const success = await runTests();
        process.exit(success ? 0 : 1);
    } catch (error) {
        console.error('❌ 测试运行失败:', error.message);
        process.exit(1);
    }
}

// 当直接运行时执行测试
if (require.main === module) {
    // 检查服务器是否运行
    makeRequest('http://localhost:3000/api/health')
        .then(() => {
            console.log('✅ 检测到服务器运行中，开始测试...\n');
            main();
        })
        .catch(() => {
            console.error(`
❌ 无法连接到服务器 (http://localhost:3000)

请先启动服务器:
  npm run demo
  或
  npm start

然后再运行测试:
  node test-integration.js
`);
            process.exit(1);
        });
}

module.exports = { runTests, TestRunner };