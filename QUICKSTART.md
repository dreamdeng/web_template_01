# Flamy Dash iframe 游戏集成 - 快速启动

## 🚀 快速启动

### 1. 安装依赖
```bash
npm install
```

### 2. 启动服务器
```bash
npm start
```

### 3. 访问应用
- 前端页面: http://localhost:3000
- API健康检查: http://localhost:3000/api/health

## 🎮 功能特性

✅ **已完成的功能**
- 固定使用 flamydash.com 域名，无需环境变量配置
- 完整的 iframe 游戏嵌入系统
- AzGame 兼容的 API 格式
- 游戏加载状态管理
- 错误处理和重试机制
- 响应式设计支持

## 📁 项目结构
```
├── public/
│   ├── index.html          # 主页面
│   ├── css/
│   │   └── game-integration.css
│   └── js/
│       ├── api-client.js   # API客户端
│       └── game-loader.js  # 游戏加载器
├── server/
│   ├── app.js             # Express应用
│   ├── config/games.json  # 游戏配置
│   ├── controllers/       # 控制器
│   ├── routes/           # 路由
│   └── utils/            # 工具类
├── test-api.js           # API测试脚本
└── package.json
```

## 🔧 API 接口

### 游戏配置 API
- **URL**: `/api/sdk/gmadsv1?params=[BASE64_ENCODED]`
- **方法**: GET
- **说明**: 返回游戏配置信息，兼容 AzGame 格式

### 其他接口
- `/api/health` - 健康检查
- `/api/games` - 游戏列表
- `/api/analytics/events` - 事件记录

## 🧪 测试

运行 API 测试：
```bash
node test-api.js
```

## 🎯 使用说明

1. 启动服务器后访问 http://localhost:3000
2. 点击 "Load & Play Game" 按钮加载游戏
3. 游戏将在 iframe 中加载并显示

所有配置已固定为 flamydash.com 域名，无需额外配置。

## 🌐 Cloudflare Pages 部署

### 构建静态文件
```bash
npm run build
```

这将创建 `/out` 目录，包含：
- ✅ 所有静态文件 (HTML, CSS, JS)
- ✅ robots.txt
- ✅ sitemap.xml
- ✅ _headers (Cloudflare 配置)
- ✅ _redirects (路由配置)

### 部署到 Cloudflare Pages
1. 在 Cloudflare Dashboard 创建 Pages 项目
2. 构建命令: `npm run build`
3. 输出目录: `out`
4. 完成！

详细部署说明请查看 [CLOUDFLARE_DEPLOY.md](./CLOUDFLARE_DEPLOY.md)