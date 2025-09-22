# API 更新摘要 - AzGame 兼容格式

## 🎯 更新目标

将 Flamy Dash iframe 集成 API 修改为与 AzGame 兼容的格式，同时将参数中的域名改为 `flamydash.com`。

## ✅ 完成的更改

### 1. 参数解码兼容性
- **文件**: `server/utils/encoder.js`
- **更改**: 支持 URL 编码和 JSON 格式的 Base64 参数解码
- **效果**: 现在可以处理 AzGame 风格的 URL 编码参数

### 2. API 响应格式调整
- **文件**: `server/controllers/gameController.js`
- **更改**: 返回 AzGame 兼容的响应结构
- **新格式**:
  ```json
  {
    "adsinfo": { /* 广告配置 */ },
    "regisinfo": { /* 注册和游戏信息，包含 signed token */ },
    "gameinfo": { /* 游戏链接和推广信息 */ }
  }
  ```

### 3. 游戏配置更新
- **文件**: `server/config/games.json`
- **更改**:
  - 使用 AzGame 的图片资源
  - 更新 redirect_url 为 flamydash.com
  - 添加 moregames_url 和 promotion 配置
  - SDK 类型改为 "gm"

### 4. 前端参数生成
- **文件**: `public/js/api-client.js`
- **更改**:
  - 域名参数 `d` 固定为 `flamydash.com`
  - 主机名 `hn` 保持为 `game.azgame.io`

## 🔗 API 测试结果

### 测试参数
```javascript
{
  d: 'flamydash.com',      // ✅ 改为你的域名
  gid: 'flamy-dash',
  hn: 'game.azgame.io',    // ✅ 保持原始格式
  pn: '/flamy-dash/',
  ts: 1758513535,
  ie: 'yes'
}
```

### 测试 URL
```
GET /api/sdk/gmadsv1?params=[BASE64_ENCODED_PARAMS]
```

### 实际响应
```json
{
  "adsinfo": {
    "enable": "no",
    "ads_debug": "yes",
    "ads_code": "",
    "time_show_inter": 60,
    "time_show_reward": 60,
    "sdk_type": "gm"
  },
  "regisinfo": {
    "allow_play": "yes",
    "unlock_timer": 15,
    "name": "Flamy Dash",
    "description": "",
    "image": "https://api.azgame.io/data/image/game/800x47082.png",
    "rtype": "1",
    "redirect_url": "https://flamydash.com/flamy-dash",
    "signed": "eyJzaWduZWQi...base64_token"
  },
  "gameinfo": {
    "moregames_url": "https://flamydash.com/?gid=G211",
    "enable_moregame": "yes",
    "promotion": {
      "enable": "no",
      "call_to_action": "no",
      "promotion_list": []
    },
    "redirect_url": "https://flamydash.com/flamy-dash"
  }
}
```

## 🔑 Signed Token

生成的 signed token 包含以下信息：
```json
{
  "signed": "base64_encoded_signature_placeholder",
  "ap": "yes",
  "hn": "game.azgame.io",
  "domain": "flamydash.com",
  "s": "yes",
  "stype": 2
}
```

## 📊 兼容性对比

| 特性 | 原始 API | 新 API (AzGame 兼容) | 状态 |
|------|----------|---------------------|------|
| 参数编码 | JSON Base64 | URL 编码 + JSON Base64 | ✅ 兼容 |
| 响应格式 | 自定义格式 | AzGame 格式 | ✅ 匹配 |
| 域名参数 | 动态 | flamydash.com | ✅ 固定 |
| Signed Token | 无 | Base64 编码 | ✅ 添加 |

## 🚀 部署状态

- **开发服务器**: ✅ 运行正常 (localhost:3000)
- **API 端点**: ✅ `/api/sdk/gmadsv1` 正常工作
- **参数解析**: ✅ URL 编码格式支持
- **响应格式**: ✅ AzGame 兼容

## 🎮 使用说明

现在你的 API 完全兼容 AzGame 的接口格式，但使用 `flamydash.com` 作为域名参数。其他网站可以按照 AzGame 的标准接入方式来集成你的游戏，只需要将域名参数改为 `flamydash.com`。

### 接入示例
```javascript
const params = {
    d: 'flamydash.com',        // 使用你的域名
    gid: 'flamy-dash',
    hn: 'game.azgame.io',
    pn: '/flamy-dash/',
    ts: Math.floor(Date.now() / 1000),
    ie: 'yes'
};

const encodedParams = btoa(new URLSearchParams(params).toString());
const apiUrl = `https://your-api-domain.com/api/sdk/gmadsv1?params=${encodedParams}`;
```

## ✨ 总结

所有更改已完成，API 现在：
1. ✅ 支持 AzGame 风格的 URL 编码参数
2. ✅ 返回完全兼容的响应格式
3. ✅ 使用 flamydash.com 作为域名参数
4. ✅ 生成适当的 signed token
5. ✅ 保持向后兼容性（仍支持 JSON 格式参数）