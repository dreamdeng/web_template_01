const express = require('express');
const router = express.Router();
const GameController = require('../controllers/gameController');

/**
 * 游戏API路由
 * 仿照AzGame的API端点结构
 */

// 主要的游戏配置API - 仿照AzGame的gmadsv1端点
router.get('/sdk/gmadsv1', GameController.getGameConfig);

// 游戏事件分析API
router.post('/analytics/events', GameController.recordGameEvent);

// 游戏嵌入信息API
router.get('/games/:gameId/embed', GameController.getGameEmbed);

// 健康检查
router.get('/health', GameController.healthCheck);

// 获取所有可用游戏列表
router.get('/games', (req, res) => {
    const gameConfig = require('../config/games.json');

    const gamesList = Object.keys(gameConfig.games).map(gameId => {
        const game = gameConfig.games[gameId];
        return {
            id: gameId,
            name: game.name,
            description: game.description,
            image: game.image,
            category: game.category,
            tags: game.tags,
            rating: game.rating
        };
    });

    res.json({
        games: gamesList,
        total: gamesList.length
    });
});

// 错误处理中间件
router.use((error, req, res, next) => {
    console.error('API Error:', error);
    res.status(500).json({
        error: 'Internal server error',
        code: 'API_ERROR',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

module.exports = router;