// Cloudflare Pages Functions
// 文件路径: /functions/api/sdk/gmadsv1.js

const GAME_CONFIG = {
  "games": {
    "flamy-dash": {
      "id": "flamy-dash",
      "name": "Flamy Dash",
      "description": "",
      "image": "https://api.azgame.io/data/image/game/800x47082.png",
      "version": "25091502",
      "redirect_url": "https://flamydash.com/flamy-dash",
      "moregames_url": "https://flamydash.com/?gid=G211",
      "enable_moregame": "yes",
      "unlock_timer": 15,
      "category": "arcade",
      "tags": ["one-button", "precision", "grappling-hook", "endless"],
      "rating": "4.5",
      "promotion": {
        "enable": "no",
        "call_to_action": "no",
        "promotion_list": []
      }
    }
  },
  "ads_config": {
    "enable": "no",
    "ads_debug": "yes",
    "ads_code": "",
    "time_show_inter": 60,
    "time_show_reward": 60,
    "sdk_type": "gm"
  },
  "default_settings": {
    "allow_play": "yes",
    "rtype": "1"
  }
};

// 解码参数
function decodeParams(encodedParams) {
  if (!encodedParams) {
    throw new Error('No parameters provided');
  }

  try {
    const decodedString = atob(encodedParams);

    // 尝试 JSON 解析
    try {
      return JSON.parse(decodedString);
    } catch (jsonError) {
      // 尝试 URL 参数解析
      const params = {};
      const urlParams = new URLSearchParams(decodedString);
      for (const [key, value] of urlParams) {
        params[key] = value;
      }
      return params;
    }
  } catch (error) {
    throw new Error('Failed to decode parameters');
  }
}

// 验证参数
function validateParams(params) {
  if (!params || typeof params !== 'object') {
    return false;
  }

  const requiredFields = ['d', 'gid', 'hn', 'ts'];
  return requiredFields.every(field =>
    params.hasOwnProperty(field) && params[field] !== null && params[field] !== undefined
  );
}

// 生成签名令牌
function generateSignedToken(params) {
  const tokenData = {
    signed: "base64_encoded_signature_placeholder",
    ap: "yes",
    hn: params.hn || "game.azgame.io",
    domain: params.d || "flamydash.com",
    s: "yes",
    stype: 2
  };

  return btoa(JSON.stringify(tokenData));
}

// 验证时间戳
function validateTimestamp(timestamp, maxAge = 3600) {
  const currentTime = Math.floor(Date.now() / 1000);
  const age = currentTime - timestamp;
  return age >= 0 && age <= maxAge;
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const params = url.searchParams.get('params');

  // CORS 头部
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Content-Type': 'application/json'
  };

  try {
    if (!params) {
      return new Response(JSON.stringify({
        error: 'Missing required parameters',
        code: 'MISSING_PARAMS'
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // 解码参数
    let decodedParams;
    try {
      decodedParams = decodeParams(params);
    } catch (error) {
      return new Response(JSON.stringify({
        error: 'Invalid parameter format',
        code: 'INVALID_PARAMS'
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // 验证参数
    if (!validateParams(decodedParams)) {
      return new Response(JSON.stringify({
        error: 'Invalid parameters',
        code: 'INVALID_PARAMS'
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // 验证时间戳
    if (!validateTimestamp(decodedParams.ts, 3600)) {
      return new Response(JSON.stringify({
        error: 'Request expired',
        code: 'EXPIRED_REQUEST'
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    const gameId = decodedParams.gid || 'flamy-dash';
    const game = GAME_CONFIG.games[gameId];

    if (!game) {
      return new Response(JSON.stringify({
        error: 'Game not found',
        code: 'GAME_NOT_FOUND'
      }), {
        status: 404,
        headers: corsHeaders
      });
    }

    // 构建 AzGame 兼容响应
    const response = {
      adsinfo: {
        enable: GAME_CONFIG.ads_config.enable,
        ads_debug: GAME_CONFIG.ads_config.ads_debug,
        ads_code: GAME_CONFIG.ads_config.ads_code,
        time_show_inter: GAME_CONFIG.ads_config.time_show_inter,
        time_show_reward: GAME_CONFIG.ads_config.time_show_reward,
        sdk_type: GAME_CONFIG.ads_config.sdk_type
      },
      regisinfo: {
        allow_play: GAME_CONFIG.default_settings.allow_play,
        unlock_timer: game.unlock_timer,
        name: game.name,
        description: game.description,
        image: game.image,
        rtype: GAME_CONFIG.default_settings.rtype,
        redirect_url: game.redirect_url,
        signed: generateSignedToken(decodedParams)
      },
      gameinfo: {
        // 游戏资源 URLs - 仿照 AzGame 结构
        game_url: `https://flamydash.com/games/flamy-dash/${game.version}/`,
        loader_url: `https://flamydash.com/games/flamy-dash/${game.version}/Build/flamy-dash-v${game.version}.loader.js`,
        framework_url: `https://flamydash.com/games/flamy-dash/${game.version}/Build/flamy-dash-v${game.version}.framework.js.unityweb`,
        wasm_url: `https://flamydash.com/games/flamy-dash/${game.version}/Build/flamy-dash-v${game.version}.wasm.unityweb`,
        data_url: `https://flamydash.com/games/flamy-dash/${game.version}/Build/flamy-dash-v${game.version}.data.unityweb`,

        // 原有的链接信息
        moregames_url: game.moregames_url,
        enable_moregame: game.enable_moregame,
        promotion: game.promotion,
        redirect_url: game.redirect_url,

        // Unity WebGL 配置
        unity_config: {
          dataUrl: `https://flamydash.com/games/flamy-dash/${game.version}/Build/flamy-dash-v${game.version}.data.unityweb`,
          frameworkUrl: `https://flamydash.com/games/flamy-dash/${game.version}/Build/flamy-dash-v${game.version}.framework.js.unityweb`,
          codeUrl: `https://flamydash.com/games/flamy-dash/${game.version}/Build/flamy-dash-v${game.version}.wasm.unityweb`,
          loaderUrl: `https://flamydash.com/games/flamy-dash/${game.version}/Build/flamy-dash-v${game.version}.loader.js`,
          companyName: "Flamy Dash Team",
          productName: "Flamy Dash",
          productVersion: game.version
        }
      }
    };

    console.log(`Game config requested for ${gameId} from ${decodedParams.d}`);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Game config error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

// 处理 OPTIONS 请求 (CORS 预检)
export async function onRequestOptions(context) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
    }
  });
}