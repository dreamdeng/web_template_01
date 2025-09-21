const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');

const gameApiRoutes = require('./routes/game-api');

const app = express();
const PORT = process.env.PORT || 3000;

// 安全中间件
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'self'", "https://idev.games", "https://flamydash.com"]
        }
    },
    crossOriginEmbedderPolicy: false
}));

// CORS配置
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:8000',
        'https://flamydash.com',
        'https://*.flamydash.com'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 速率限制
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 100, // 每个IP最多100次请求
    message: {
        error: 'Too many requests',
        code: 'RATE_LIMIT_EXCEEDED'
    }
});
app.use('/api', limiter);

// 日志中间件
app.use(morgan('combined'));

// 压缩中间件
app.use(compression());

// JSON解析
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 静态文件服务
app.use(express.static(path.join(__dirname, '../public')));
app.use('/games', express.static(path.join(__dirname, '../games')));

// API路由
app.use('/api', gameApiRoutes);

// 主页路由 - 返回现有的HTML页面
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 游戏嵌入页面路由
app.get('/games/:gameId/latest/', (req, res) => {
    const { gameId } = req.params;
    const gamePath = path.join(__dirname, `../games/${gameId}/latest/index.html`);

    // 检查游戏文件是否存在
    const fs = require('fs');
    if (fs.existsSync(gamePath)) {
        res.sendFile(gamePath);
    } else {
        res.status(404).json({
            error: 'Game not found',
            code: 'GAME_NOT_FOUND',
            gameId: gameId
        });
    }
});

// 404处理
app.use((req, res) => {
    res.status(404).json({
        error: 'Not found',
        code: 'NOT_FOUND',
        path: req.path
    });
});

// 全局错误处理
app.use((error, req, res, next) => {
    console.error('Server Error:', error);
    res.status(500).json({
        error: 'Internal server error',
        code: 'SERVER_ERROR',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`🚀 Flamy Dash iframe integration server running on port ${PORT}`);
    console.log(`📱 Frontend: http://localhost:${PORT}`);
    console.log(`🎮 API: http://localhost:${PORT}/api`);
    console.log(`💡 Health check: http://localhost:${PORT}/api/health`);
});

// 优雅关闭
process.on('SIGTERM', () => {
    console.log('🛑 Received SIGTERM, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 Received SIGINT, shutting down gracefully');
    process.exit(0);
});

module.exports = app;