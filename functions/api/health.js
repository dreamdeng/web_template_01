// Cloudflare Pages Functions - 健康检查
// 文件路径: /functions/api/health.js

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Content-Type': 'application/json'
};

// 健康检查端点
export async function onRequestGet(context) {
  const { request } = context;

  try {
    const response = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      api_version: 'azgame-compatible',
      games_available: 1,
      endpoints: [
        '/api/sdk/gmadsv1',
        '/api/analytics/events',
        '/api/health',
        '/api/games'
      ],
      server_info: {
        provider: 'Cloudflare Pages Functions',
        region: request.cf?.colo || 'unknown',
        country: request.cf?.country || 'unknown'
      }
    };

    return new Response(JSON.stringify(response, null, 2), {
      status: 200,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Health check error:', error);
    return new Response(JSON.stringify({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
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