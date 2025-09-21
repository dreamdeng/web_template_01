const ParameterEncoder = require('../utils/encoder');
const gameConfig = require('../config/games.json');

/**
 * 游戏控制器
 * 处理游戏相关的API请求
 */
class GameController {
    /**
     * 获取游戏配置信息
     * 仿照AzGame的gmadsv1 API格式
     */
    static async getGameConfig(req, res) {
        try {
            const { params } = req.query;

            if (!params) {
                return res.status(400).json({
                    error: 'Missing required parameters',
                    code: 'MISSING_PARAMS'
                });
            }

            // 解码Base64参数
            let decodedParams;
            try {
                decodedParams = ParameterEncoder.decode(params);
            } catch (error) {
                return res.status(400).json({
                    error: 'Invalid parameter format',
                    code: 'INVALID_PARAMS'
                });
            }

            // 验证参数
            if (!ParameterEncoder.validateParams(decodedParams)) {
                return res.status(400).json({
                    error: 'Invalid parameters',
                    code: 'INVALID_PARAMS'
                });
            }

            // 验证时间戳（1小时有效期）
            if (!ParameterEncoder.validateTimestamp(decodedParams.ts, 3600)) {
                return res.status(400).json({
                    error: 'Request expired',
                    code: 'EXPIRED_REQUEST'
                });
            }

            const gameId = decodedParams.gid || 'flamy-dash';
            const game = gameConfig.games[gameId];

            if (!game) {
                return res.status(404).json({
                    error: 'Game not found',
                    code: 'GAME_NOT_FOUND'
                });
            }

            // 构建AzGame兼容的响应格式
            const response = {
                adsinfo: {
                    enable: gameConfig.ads_config.enable,
                    ads_debug: gameConfig.ads_config.ads_debug,
                    time_show_inter: gameConfig.ads_config.time_show_inter,
                    time_show_reward: gameConfig.ads_config.time_show_reward,
                    sdk_type: gameConfig.ads_config.sdk_type
                },
                regisinfo: {
                    allow_play: gameConfig.default_settings.allow_play,
                    unlock_timer: game.unlock_timer,
                    name: game.name,
                    description: game.description,
                    image: game.image,
                    rtype: gameConfig.default_settings.rtype,
                    redirect_url: game.redirect_url,
                    rating: game.rating,
                    category: game.category,
                    tags: game.tags
                },
                gameinfo: {
                    iframe_url: game.iframe_url,
                    width: game.width,
                    height: game.height,
                    version: game.version,
                    enable_fullscreen: game.enable_fullscreen,
                    enable_sound: game.enable_sound,
                    controls: game.controls,
                    iframe_sandbox: gameConfig.default_settings.iframe_sandbox
                },
                request_info: {
                    domain: decodedParams.d,
                    hostname: decodedParams.hn,
                    timestamp: decodedParams.ts,
                    api_version: decodedParams.v || '1.0'
                }
            };

            // 记录API调用
            console.log(`Game config requested for ${gameId} from ${decodedParams.d}`);

            res.json(response);

        } catch (error) {
            console.error('Game config error:', error);
            res.status(500).json({
                error: 'Internal server error',
                code: 'INTERNAL_ERROR'
            });
        }
    }

    /**
     * 记录游戏事件和分析数据
     */
    static async recordGameEvent(req, res) {
        try {
            const { event_type, game_id, data } = req.body;

            if (!event_type || !game_id) {
                return res.status(400).json({
                    error: 'Missing required fields',
                    code: 'MISSING_FIELDS'
                });
            }

            // 记录事件（在生产环境中，这里会连接到数据库或分析服务）
            const eventRecord = {
                timestamp: new Date().toISOString(),
                event_type,
                game_id,
                data: data || {},
                ip: req.ip,
                user_agent: req.get('User-Agent'),
                referrer: req.get('Referer')
            };

            console.log('Game Event:', JSON.stringify(eventRecord, null, 2));

            res.json({
                success: true,
                message: 'Event recorded successfully'
            });

        } catch (error) {
            console.error('Event recording error:', error);
            res.status(500).json({
                error: 'Failed to record event',
                code: 'RECORDING_ERROR'
            });
        }
    }

    /**
     * 获取游戏嵌入页面
     */
    static async getGameEmbed(req, res) {
        try {
            const { gameId } = req.params;
            const game = gameConfig.games[gameId];

            if (!game) {
                return res.status(404).json({
                    error: 'Game not found',
                    code: 'GAME_NOT_FOUND'
                });
            }

            // 在实际应用中，这里会渲染游戏嵌入页面
            res.json({
                game_id: gameId,
                embed_url: game.iframe_url,
                width: game.width,
                height: game.height,
                instructions: 'Use this data to create iframe embed'
            });

        } catch (error) {
            console.error('Game embed error:', error);
            res.status(500).json({
                error: 'Failed to get game embed',
                code: 'EMBED_ERROR'
            });
        }
    }

    /**
     * 健康检查端点
     */
    static async healthCheck(req, res) {
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            games_available: Object.keys(gameConfig.games).length
        });
    }
}

module.exports = GameController;