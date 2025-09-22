# 🚀 部署说明 - API 更新生效

## ❌ **当前问题**

你在测试 `https://flamydash.com/api/sdk/gmadsv1` 时发现 API 没有生效，这是因为：

1. **线上代码未更新** - 我们的修改只在本地开发环境
2. **后端 API 需要部署** - Cloudflare Pages 需要 Functions 来运行后端逻辑

## ✅ **解决方案**

我已经为你创建了 **Cloudflare Pages Functions** 版本的 API。

### 📁 **构建结果**

运行 `npm run build` 后，`/out` 目录包含：

```
out/
├── functions/
│   └── api/
│       └── sdk/
│           └── gmadsv1.js          # ✅ Cloudflare Function API
├── index.html                      # ✅ 前端页面
├── js/                            # ✅ JavaScript 文件
├── css/                           # ✅ 样式文件
├── robots.txt                     # ✅ SEO 文件
├── sitemap.xml                    # ✅ 网站地图
├── _headers                       # ✅ HTTP 头配置
└── _redirects                     # ✅ 路由配置
```

## 🔧 **部署步骤**

### 方法 1: Cloudflare Dashboard 部署

1. **访问 Cloudflare Pages Dashboard**
   - 登录 [dash.cloudflare.com](https://dash.cloudflare.com)
   - 进入你的 Pages 项目

2. **上传新版本**
   - 选择 "直接上传" 或 "从 Git 部署"
   - 上传整个 `/out` 目录

3. **等待部署完成**
   - Cloudflare 会自动识别 `functions/` 目录
   - API 端点将自动可用

### 方法 2: Git 自动部署 (推荐)

如果你的项目连接了 Git：

```bash
# 1. 提交更改
git add .
git commit -m "Add AzGame compatible API with Cloudflare Functions"

# 2. 推送到仓库
git push origin main

# 3. Cloudflare 将自动构建和部署
```

## 🧪 **部署后测试**

部署完成后，你的 API 将支持以下格式：

### JSON 格式参数 (当前)
```javascript
const params = {
  "d": "flamydash.com",
  "gid": "flamy-dash",
  "hn": "flamydash.com",  // 可以是任意值
  "pn": "/",
  "ts": 1758519520,
  "ie": "yes"
};
```

### URL 编码格式参数 (AzGame 兼容)
```javascript
const params = "d=flamydash.com&gid=flamy-dash&hn=game.azgame.io&pn=/flamy-dash/&ts=1758519520&ie=yes";
```

### 测试命令
```bash
# 测试当前 JSON 格式
curl "https://flamydash.com/api/sdk/gmadsv1?params=eyJkIjoiZmxhbXlkYXNoLmNvbSIsImdpZCI6ImZsYW15LWRhc2giLCJobiI6ImZsYW15ZGFzaC5jb20iLCJwbiI6Ii8iLCJ0cyI6MTc1ODUxOTUyMCwiaWUiOiJ5ZXMifQ=="

# 测试 AzGame URL 格式
curl "https://flamydash.com/api/sdk/gmadsv1?params=ZD1mbGFteWRhc2guY29tJmdpZD1mbGFteS1kYXNoJmhuPWdhbWUuYXpnYW1lLmlvJnBuPSUyRmZsYW15LWRhc2glMkYmdHM9MTc1ODUxOTUyMCZpZT15ZXM="
```

## 🎯 **预期响应**

部署成功后，API 将返回：

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
    "signed": "eyJ0b2tlbl9kYXRhfQ=="
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

## ⚡ **Cloudflare Functions 特点**

- ✅ **自动扩展** - 无需管理服务器
- ✅ **全球 CDN** - 低延迟响应
- ✅ **CORS 支持** - 跨域请求正常工作
- ✅ **兼容性** - 支持 JSON 和 URL 编码参数

## 🔍 **故障排除**

### 如果部署后还是不工作：

1. **检查部署状态**
   - 在 Cloudflare Dashboard 查看部署日志
   - 确认 Functions 已启用

2. **清除缓存**
   ```bash
   # 清除 Cloudflare 缓存
   curl -X POST "https://api.cloudflare.com/client/v4/zones/YOUR_ZONE_ID/purge_cache" \
     -H "Authorization: Bearer YOUR_API_TOKEN" \
     -H "Content-Type: application/json" \
     --data '{"purge_everything":true}'
   ```

3. **检查函数日志**
   - 在 Cloudflare Dashboard 的 Functions 部分查看实时日志

## 📞 **联系支持**

如果遇到问题：
1. 检查 Cloudflare Pages 的部署日志
2. 验证 `functions/` 目录结构正确
3. 确认域名和 DNS 设置正确

---

**🎮 部署完成后，你的 API 将完全兼容 AzGame 格式，同时支持 flamydash.com 域名！**