# Flamy Dash - iframe游戏集成系统

一个完整的iframe游戏集成系统，基于现有的flamydash.com HTML落地页，仿照AzGame的集成方案。

## 🎯 项目特色

- **无缝集成** - 在现有HTML页面中完美嵌入游戏
- **动态加载** - 通过API配置动态创建iframe
- **状态管理** - 完整的加载进度、错误处理、重试机制
- **跨平台** - 响应式设计，支持桌面和移动设备
- **双向通信** - iframe与父页面可以双向通信
- **AzGame兼容** - 仿照AzGame的API格式和参数编码

## 🏗️ 项目结构

```
flamydash-iframe-integration/
├── public/                    # 前端静态文件
│   ├── css/
│   │   └── game-integration.css  # 游戏集成样式
│   ├── js/
│   │   ├── game-loader.js         # 游戏加载器
│   │   └── api-client.js          # API客户端
│   └── assets/
├── server/                        # 后端API服务
│   ├── app.js                     # Express应用
│   ├── routes/
│   │   └── game-api.js            # 游戏API路由
│   ├── controllers/
│   │   └── gameController.js      # 游戏控制器
│   ├── utils/
│   │   └── encoder.js             # Base64编码工具
│   └── config/
│       └── games.json             # 游戏配置
├── games/                         # 游戏资源目录
│   └── flamy-dash/
│       └── latest/
│           └── index.html         # Unity WebGL游戏页面
├── index.html                     # 主页面(已集成)
├── package.json
└── README.md
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

或者启动生产服务器：

```bash
npm start
```

### 3. 访问应用

- 前端页面: http://localhost:3000
- API文档: http://localhost:3000/api/health

## 📝 API接口

### 游戏配置API

**GET** `/api/sdk/gmadsv1?params=[BASE64_ENCODED]`

仿照AzGame的API格式，返回游戏配置信息。

**参数编码示例：**
```javascript
const params = {
    d: 'flamydash.com',      // 域名
    gid: 'flamy-dash',       // 游戏ID
    hn: window.location.hostname,
    pn: window.location.pathname,
    ts: Math.floor(Date.now() / 1000),
    ie: 'yes'
};

const encodedParams = btoa(JSON.stringify(params));
```

**响应格式：**
```json
{
    "adsinfo": {
        "enable": "no",
        "ads_debug": "yes",
        "time_show_inter": 60,
        "time_show_reward": 60,
        "sdk_type": "iframe"
    },
    "regisinfo": {
        "allow_play": "yes",
        "unlock_timer": 15,
        "name": "Flamy Dash",
        "description": "Master the flames of precision",
        "image": "https://flamydash.com/flamy-dash.png",
        "rtype": "1",
        "redirect_url": "https://flamydash.com/"
    },
    "gameinfo": {
        "iframe_url": "https://flamydash.com/games/flamy-dash/latest/",
        "width": 960,
        "height": 600,
        "version": "1.0.0",
        "enable_fullscreen": "yes",
        "enable_sound": "yes"
    }
}
```

### 游戏事件追踪

**POST** `/api/analytics/events`

记录游戏加载和使用数据。

### 其他接口

- `GET /api/games` - 获取游戏列表
- `GET /api/games/:gameId/embed` - 获取游戏嵌入信息
- `GET /api/health` - 健康检查

## 🎮 游戏集成

### 前端集成

```javascript
// 初始化游戏加载器
const gameLoader = new FlamyDashIframeLoader('game-container');

// 加载游戏
gameLoader.loadGameInIframe();
```

### iframe通信

**父页面 → iframe:**
```javascript
iframe.contentWindow.postMessage({
    type: 'GAME_COMMAND',
    action: 'pause'
}, '*');
```

**iframe → 父页面:**
```javascript
window.parent.postMessage({
    type: 'GAME_EVENT',
    event: 'loaded'
}, '*');
```

## 🎨 样式定制

游戏集成系统使用响应式设计，支持以下定制：

- 主题颜色配置
- 加载动画样式
- 错误提示样式
- 移动端适配
- 全屏模式支持

## 🔧 配置选项

### 游戏配置 (server/config/games.json)

```json
{
    "games": {
        "flamy-dash": {
            "id": "flamy-dash",
            "name": "Flamy Dash",
            "description": "Master the flames of precision",
            "iframe_url": "https://flamydash.com/games/flamy-dash/latest/",
            "width": 960,
            "height": 600,
            "enable_fullscreen": "yes",
            "enable_sound": "yes"
        }
    }
}
```

### 安全配置

- CORS配置
- CSP头设置
- iframe沙箱权限
- 速率限制

## 📱 移动端支持

- 响应式iframe容器
- 触摸事件支持
- 移动端优化的UI
- 自适应游戏比例

## 🔍 调试和监控

### 开发调试

```bash
# 启用详细日志
NODE_ENV=development npm run dev
```

### 生产监控

- API调用日志
- 游戏加载分析
- 错误追踪
- 性能监控

## 🚢 部署

### 静态文件部署

前端文件可以部署到任何静态托管服务：

- Cloudflare Pages
- Netlify
- Vercel
- GitHub Pages

### API服务部署

后端API可以部署到：

- Node.js托管服务
- Docker容器
- 云函数服务
- VPS/云服务器

### 环境变量

```bash
PORT=3000
NODE_ENV=production
```

## 🔒 安全考虑

- iframe sandbox权限限制
- CORS原点验证
- CSP内容安全策略
- API速率限制
- 参数验证和过滤

## 🧪 测试

```bash
# 运行测试 (待实现)
npm test

# 代码检查
npm run lint
```

## 📈 性能优化

- 资源压缩和缓存
- CDN加速
- 懒加载
- 代码分割
- 图片优化

## 🤝 贡献指南

1. Fork本项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 📄 许可证

MIT License

## 🆘 支持

如果遇到问题，请：

1. 检查浏览器控制台错误
2. 查看服务器日志
3. 确认API接口状态
4. 提交Issue报告

---

**🎮 享受Flamy Dash带来的精准挑战！**