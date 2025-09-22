// Cloudflare Pages Functions - 游戏列表
// 文件路径: /functions/api/games.js

const GAME_CONFIG = {
  "games": {
    "flamy-dash": {
      "id": "flamy-dash",
      "name": "Flamy Dash",
      "description": "Master the flames of precision in this challenging one-button arcade game",
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
  }
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Content-Type': 'application/json'
};

// 获取游戏列表
export async function onRequestGet(context) {
  try {
    const gamesList = Object.keys(GAME_CONFIG.games).map(gameId => {
      const game = GAME_CONFIG.games[gameId];
      return {
        id: gameId,
        name: game.name,
        description: game.description,
        image: game.image,
        category: game.category,
        tags: game.tags,
        rating: game.rating,
        version: game.version,
        unlock_timer: game.unlock_timer,
        redirect_url: game.redirect_url
      };
    });

    const response = {
      games: gamesList,
      total: gamesList.length,
      timestamp: new Date().toISOString(),
      api_version: "azgame-compatible"
    };

    return new Response(JSON.stringify(response, null, 2), {
      status: 200,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Games list error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to get games list',
      code: 'GAMES_LIST_ERROR'
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
    headers: corsHeaders
  });
}