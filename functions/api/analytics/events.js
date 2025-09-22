// Cloudflare Pages Functions - 游戏事件记录
// 文件路径: /functions/api/analytics/events.js

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Content-Type': 'application/json'
};

// 记录游戏事件
export async function onRequestPost(context) {
  const { request } = context;

  try {
    const body = await request.json();
    const { event_type, game_id, data } = body;

    if (!event_type || !game_id) {
      return new Response(JSON.stringify({
        error: 'Missing required fields',
        code: 'MISSING_FIELDS'
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // 记录事件（在生产环境中，这里会连接到数据库或分析服务）
    const eventRecord = {
      timestamp: new Date().toISOString(),
      event_type,
      game_id,
      data: data || {},
      ip: request.headers.get('CF-Connecting-IP') || 'unknown',
      user_agent: request.headers.get('User-Agent'),
      referrer: request.headers.get('Referer'),
      country: request.cf?.country || 'unknown'
    };

    // 输出到日志（Cloudflare 会记录到控制台）
    console.log('Game Event:', JSON.stringify(eventRecord, null, 2));

    return new Response(JSON.stringify({
      success: true,
      message: 'Event recorded successfully',
      event_id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }), {
      status: 200,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Event recording error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to record event',
      code: 'RECORDING_ERROR'
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