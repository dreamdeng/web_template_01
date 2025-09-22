/**
 * Base64 编码解码工具类
 * 仿照AzGame的参数编码格式
 */
class ParameterEncoder {
    /**
     * 编码参数为Base64字符串
     * @param {Object} params - 参数对象
     * @returns {string} Base64编码的字符串
     */
    static encode(params) {
        try {
            const jsonString = JSON.stringify(params);
            return Buffer.from(jsonString, 'utf8').toString('base64');
        } catch (error) {
            console.error('Parameter encoding failed:', error);
            throw new Error('Failed to encode parameters');
        }
    }

    /**
     * 解码Base64字符串为参数对象
     * @param {string} encodedParams - Base64编码的字符串
     * @returns {Object} 解码后的参数对象
     */
    static decode(encodedParams) {
        if (!encodedParams) {
            throw new Error('No parameters provided');
        }

        try {
            const decodedString = Buffer.from(encodedParams, 'base64').toString('utf8');

            // 尝试作为 JSON 解析
            try {
                return JSON.parse(decodedString);
            } catch (jsonError) {
                // 如果不是 JSON，尝试作为 URL 参数解析 (兼容 AzGame 格式)
                const params = {};
                const urlParams = new URLSearchParams(decodedString);
                for (const [key, value] of urlParams) {
                    params[key] = value;
                }
                return params;
            }
        } catch (error) {
            console.error('Parameter decoding failed:', error);
            throw new Error('Failed to decode parameters');
        }
    }

    /**
     * 创建AzGame风格的参数对象
     * @param {Object} options - 配置选项
     * @returns {Object} 格式化的参数对象
     */
    static createGameParams(options = {}) {
        const {
            domain = 'flamydash.com',
            gameId = 'flamy-dash',
            hostname = 'localhost',
            pathname = '/',
            referrer = '',
            userAgent = 'Mozilla/5.0',
            language = 'en-US'
        } = options;

        return {
            d: domain,           // 域名
            gid: gameId,         // 游戏ID
            hn: hostname,        // 主机名
            pn: pathname,        // 路径名
            ts: Math.floor(Date.now() / 1000), // 时间戳
            ie: 'yes',           // iframe嵌入启用
            ref: referrer,       // 来源页面
            ua: userAgent,       // 用户代理
            lang: language,      // 语言设置
            v: '1.0'             // API版本
        };
    }

    /**
     * 验证参数的有效性
     * @param {Object} params - 要验证的参数
     * @returns {boolean} 参数是否有效
     */
    static validateParams(params) {
        if (!params || typeof params !== 'object') {
            return false;
        }

        // 检查必需的参数
        const requiredFields = ['d', 'gid', 'hn', 'ts'];
        return requiredFields.every(field =>
            params.hasOwnProperty(field) && params[field] !== null && params[field] !== undefined
        );
    }

    /**
     * 生成安全的时间戳验证
     * @param {number} timestamp - 要验证的时间戳
     * @param {number} maxAge - 最大年龄（秒）
     * @returns {boolean} 时间戳是否有效
     */
    static validateTimestamp(timestamp, maxAge = 3600) {
        const currentTime = Math.floor(Date.now() / 1000);
        const age = currentTime - timestamp;
        return age >= 0 && age <= maxAge;
    }
}

module.exports = ParameterEncoder;