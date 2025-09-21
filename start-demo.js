#!/usr/bin/env node

/**
 * Flamy Dash iframe集成系统演示启动脚本
 * 自动检查依赖并启动开发服务器
 */

const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');

console.log(`
🎮 Flamy Dash iframe集成系统
============================

正在启动演示环境...
`);

// 检查Node.js版本
function checkNodeVersion() {
    const version = process.version;
    const majorVersion = parseInt(version.slice(1).split('.')[0]);

    if (majorVersion < 14) {
        console.error('❌ 需要Node.js 14或更高版本');
        console.error(`   当前版本: ${version}`);
        process.exit(1);
    }

    console.log(`✅ Node.js版本检查通过: ${version}`);
}

// 检查npm依赖
function checkDependencies() {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync('node_modules')) {
            console.log('📦 正在安装依赖包...');

            const npm = spawn('npm', ['install'], { stdio: 'inherit' });

            npm.on('close', (code) => {
                if (code === 0) {
                    console.log('✅ 依赖安装完成');
                    resolve();
                } else {
                    reject(new Error('依赖安装失败'));
                }
            });
        } else {
            console.log('✅ 依赖已存在');
            resolve();
        }
    });
}

// 检查关键文件
function checkFiles() {
    const requiredFiles = [
        'server/app.js',
        'server/config/games.json',
        'public/js/game-loader.js',
        'public/js/api-client.js',
        'public/css/game-integration.css',
        'games/flamy-dash/latest/index.html',
        'index.html'
    ];

    console.log('📁 检查项目文件...');

    for (const file of requiredFiles) {
        if (!fs.existsSync(file)) {
            console.error(`❌ 缺少文件: ${file}`);
            return false;
        }
    }

    console.log('✅ 所有文件检查通过');
    return true;
}

// 检查端口是否可用
function checkPort(port) {
    return new Promise((resolve) => {
        const net = require('net');
        const server = net.createServer();

        server.listen(port, () => {
            server.once('close', () => {
                resolve(true);
            });
            server.close();
        });

        server.on('error', () => {
            resolve(false);
        });
    });
}

// 启动服务器
function startServer(port = 3000) {
    return new Promise(async (resolve, reject) => {
        // 检查端口
        const isPortAvailable = await checkPort(port);
        if (!isPortAvailable) {
            console.log(`⚠️  端口 ${port} 已被占用，尝试端口 ${port + 1}`);
            return startServer(port + 1);
        }

        console.log(`🚀 启动服务器在端口 ${port}...`);

        // 设置环境变量
        process.env.PORT = port;
        process.env.NODE_ENV = 'development';

        const server = spawn('node', ['server/app.js'], {
            stdio: 'inherit',
            env: { ...process.env }
        });

        // 等待服务器启动
        setTimeout(() => {
            console.log(`
🎉 服务器启动成功！

📱 前端页面: http://localhost:${port}
🎮 游戏嵌入: http://localhost:${port}/games/flamy-dash/latest/
📊 API状态: http://localhost:${port}/api/health
📋 API文档: http://localhost:${port}/api/games

🔧 开发提示:
- 修改 server/config/games.json 来配置游戏
- 修改 public/css/game-integration.css 来定制样式
- 查看浏览器控制台以获取详细日志

按 Ctrl+C 停止服务器
`);
            resolve(server);
        }, 2000);

        server.on('error', (error) => {
            reject(error);
        });

        server.on('close', (code) => {
            if (code !== 0) {
                console.log(`服务器异常退出，代码: ${code}`);
            }
        });
    });
}

// 主函数
async function main() {
    try {
        // 系统检查
        checkNodeVersion();

        if (!checkFiles()) {
            console.error('❌ 项目文件不完整，请检查项目结构');
            process.exit(1);
        }

        // 安装依赖
        await checkDependencies();

        // 启动服务器
        const server = await startServer();

        // 处理退出信号
        process.on('SIGINT', () => {
            console.log('\n👋 正在关闭服务器...');
            server.kill('SIGINT');
            process.exit(0);
        });

        process.on('SIGTERM', () => {
            console.log('\n👋 正在关闭服务器...');
            server.kill('SIGTERM');
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ 启动失败:', error.message);
        process.exit(1);
    }
}

// 运行主函数
if (require.main === module) {
    main();
}

module.exports = { main, checkNodeVersion, checkDependencies, checkFiles };