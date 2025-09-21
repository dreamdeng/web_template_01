# 🚀 Flamy Dash iframe集成系统部署指南

## 🎯 部署选项

### 选项1: 完整部署 (推荐)

适用于需要完整API功能的生产环境。

#### 前提条件
- Node.js 14+
- npm 或 yarn
- 支持Node.js的托管服务

#### 步骤1: 准备代码
```bash
# 克隆或下载项目
git clone <repository-url>
cd flamydash-iframe-integration

# 安装依赖
npm install

# 创建环境配置
cp .env.example .env
# 编辑 .env 文件设置生产环境变量
```

#### 步骤2: 配置环境变量
```bash
# .env 文件示例
NODE_ENV=production
PORT=3000
PRIMARY_DOMAIN=your-domain.com
ALLOWED_ORIGINS=https://your-domain.com
```

#### 步骤3: 部署到云平台

**Heroku:**
```bash
# 创建Heroku应用
heroku create your-app-name

# 设置环境变量
heroku config:set NODE_ENV=production
heroku config:set PRIMARY_DOMAIN=your-app-name.herokuapp.com

# 部署
git push heroku main
```

**Railway:**
```bash
# 连接到Railway
railway login
railway init
railway add

# 部署
railway up
```

**Digital Ocean App Platform:**
1. 连接GitHub仓库
2. 选择Node.js环境
3. 设置启动命令: `npm start`
4. 配置环境变量

#### 步骤4: 验证部署
```bash
# 检查健康状态
curl https://your-domain.com/api/health

# 运行集成测试
npm test
```

### 选项2: 静态部署 + 外部API

适用于只需要前端功能，使用外部游戏API的场景。

#### 前提条件
- 静态网站托管服务 (Cloudflare Pages, Netlify, Vercel等)
- 外部游戏API服务

#### 步骤1: 准备静态文件
```bash
# 复制必要的前端文件
mkdir dist
cp -r public/* dist/
cp games dist/games -r
```

#### 步骤2: 修改API配置
编辑 `dist/js/api-client.js`，将API基础URL指向外部服务：

```javascript
// 修改这一行
constructor(baseUrl = 'https://your-api-service.com/api') {
```

#### 步骤3: 部署到静态托管

**Cloudflare Pages:**
1. 连接Git仓库
2. 构建命令: `echo "Static deployment"`
3. 输出目录: `dist`

**Netlify:**
```bash
# 使用Netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Vercel:**
```bash
# 使用Vercel CLI
npm install -g vercel
cd dist
vercel --prod
```

### 选项3: Docker部署

适用于容器化环境。

#### Dockerfile
```dockerfile
FROM node:16-alpine

WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制应用代码
COPY . .

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "http.get('http://localhost:3000/api/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

# 启动应用
CMD ["npm", "start"]
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  flamydash:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - PRIMARY_DOMAIN=localhost
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

#### 部署命令
```bash
# 构建和启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 🔧 配置优化

### 性能优化

1. **启用压缩**
```javascript
// 已在server/app.js中配置
app.use(compression());
```

2. **配置缓存头**
```javascript
// 静态资源缓存
app.use(express.static('public', {
  maxAge: '1d'
}));
```

3. **CDN配置**
```javascript
// 在games.json中配置CDN URL
"iframe_url": "https://cdn.your-domain.com/games/flamy-dash/latest/"
```

### 安全加固

1. **更新安全头**
```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      frameSrc: ["'self'", "https://your-trusted-domain.com"]
    }
  }
}));
```

2. **配置CORS**
```javascript
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
}));
```

3. **API速率限制**
```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100 // 限制每个IP 100次请求
});
```

### 监控和日志

1. **添加监控**
```bash
# 安装PM2进行进程管理
npm install -g pm2

# 启动应用
pm2 start server/app.js --name flamydash

# 监控面板
pm2 monit
```

2. **日志配置**
```javascript
// 使用winston进行日志管理
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## 🔍 部署后验证

### 自动化测试
```bash
# 运行完整的集成测试
npm test

# 检查API健康状态
curl -f https://your-domain.com/api/health

# 验证游戏配置API
curl "https://your-domain.com/api/sdk/gmadsv1?params=eyJkIjoiZmxhbXlkYXNoLmNvbSIsImdpZCI6ImZsYW15LWRhc2giLCJobiI6ImxvY2FsaG9zdCIsInBuIjoiLyIsInRzIjoxNjk5NzQ1NDAwLCJpZSI6InllcyIsInYiOiIxLjAifQ=="
```

### 手动测试
1. 访问主页面检查加载
2. 点击游戏区域验证iframe加载
3. 测试全屏功能
4. 检查移动端适配
5. 验证游戏控制按钮
6. 测试错误处理和重试功能

### 性能测试
```bash
# 使用ab进行压力测试
ab -n 1000 -c 10 https://your-domain.com/api/health

# 使用lighthouse进行前端性能测试
lighthouse https://your-domain.com --output html --output-path ./lighthouse-report.html
```

## 🚨 故障排除

### 常见问题

1. **游戏iframe无法加载**
   - 检查CSP配置
   - 验证iframe URL
   - 查看浏览器控制台错误

2. **API请求失败**
   - 检查CORS配置
   - 验证环境变量
   - 查看服务器日志

3. **静态资源404**
   - 确认文件路径
   - 检查服务器配置
   - 验证构建过程

### 调试工具

1. **服务器日志**
```bash
# 使用PM2查看日志
pm2 logs flamydash

# 或直接运行查看控制台输出
NODE_ENV=development npm start
```

2. **API调试**
```bash
# 使用curl测试API
curl -v https://your-domain.com/api/health

# 使用httpie (更友好的HTTP客户端)
http GET https://your-domain.com/api/games
```

3. **前端调试**
- 打开浏览器开发者工具
- 查看Console标签页的错误信息
- 检查Network标签页的请求状态
- 使用Application标签页检查localStorage

## 📈 扩展和维护

### 添加新游戏
1. 在`server/config/games.json`中添加游戏配置
2. 创建游戏目录`games/new-game/latest/`
3. 实现游戏嵌入页面
4. 更新前端游戏选择器 (如需要)

### 数据库集成
```javascript
// 示例: 使用MongoDB存储游戏配置
const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  iframe_url: String,
  // ... 其他字段
});

const Game = mongoose.model('Game', gameSchema);
```

### API版本管理
```javascript
// 添加API版本支持
app.use('/api/v1', gameApiRoutes);
app.use('/api/v2', gameApiRoutesV2);
```

---

🎮 **部署完成后，享受你的iframe游戏集成系统吧！**