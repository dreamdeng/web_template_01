# 🚀 Cloudflare Pages 一键部署指南

## 📋 部署前检查清单

- ✅ 项目已完成静态构建优化
- ✅ 支持自定义域名配置
- ✅ 生成的静态文件输出到 `out/` 目录
- ✅ 包含完整的iframe游戏集成系统
- ✅ AzGame兼容的API格式（静态版本）
- ✅ 响应式设计和移动端支持

## 🎯 三种部署方式

### 方式1: Git 自动部署 (推荐⭐)

**步骤1: 准备Git仓库**
```bash
# 如果还没有Git仓库
git init
git add .
git commit -m "Initial commit: Flamy Dash iframe integration"

# 推送到GitHub/GitLab
git remote add origin <your-repo-url>
git push -u origin main
```

**步骤2: 连接Cloudflare Pages**
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 导航到 **Pages** > **Create a project**
3. 选择 **Connect to Git**
4. 选择你的Git提供商 (GitHub/GitLab)
5. 选择仓库: `flamydash-iframe-integration`

**步骤3: 配置构建设置**
```
📦 Framework preset: None
🏗️ Build command: npm run build:cloudflare
📁 Build output directory: out
🌐 Root directory: (leave empty)
```

**步骤4: 环境变量 (可选)**
```
DOMAIN = your-domain.com
```

**步骤5: 部署**
- 点击 **Save and Deploy**
- 等待构建完成 (通常2-3分钟)
- 获得临时域名: `<project-name>.pages.dev`

### 方式2: 手动上传部署

**步骤1: 本地构建**
```bash
# 确保依赖已安装
npm install

# 构建静态文件
npm run build

# 检查输出
ls -la out/
```

**步骤2: 上传到Cloudflare**
1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 选择 **Pages** > **Create a project**
3. 选择 **Upload assets**
4. 上传整个 `out/` 目录
5. 等待部署完成

### 方式3: Wrangler CLI 部署

**步骤1: 安装Wrangler**
```bash
npm install -g wrangler
wrangler login
```

**步骤2: 初始化和部署**
```bash
# 构建项目
npm run build

# 部署到Cloudflare Pages
wrangler pages publish out
```

## 🔧 自定义域名设置

### 添加自定义域名

**在Cloudflare Pages中:**
1. 进入你的Pages项目
2. 选择 **Custom domains** 标签
3. 点击 **Set up a custom domain**
4. 输入你的域名: `flamydash.com`
5. 等待DNS验证完成

**DNS配置:**
- 如果域名在Cloudflare: 自动配置
- 如果域名在其他提供商:
  ```
  类型: CNAME
  名称: @
  内容: <your-project>.pages.dev
  ```

### 使用指定域名构建

**方法1: 环境变量**
在Cloudflare Pages设置中添加:
```
DOMAIN = your-domain.com
```

**方法2: 修改构建脚本**
编辑 `build-static.js`:
```javascript
this.domain = 'your-domain.com'; // 修改这里
```

**方法3: 构建时指定**
```bash
DOMAIN=your-domain.com npm run build:cloudflare
```

## 📊 部署后验证

### 自动检查

访问以下URL验证功能:

```
✅ 主页面: https://your-domain.com
✅ 健康检查: https://your-domain.com/config/health.json
✅ 游戏配置: https://your-domain.com/config/azgame-response.json
✅ 游戏页面: https://your-domain.com/games/flamy-dash/latest/
```

### 功能测试

1. **游戏加载测试**:
   - 点击 "Load & Play Game" 按钮
   - 验证loading动画显示
   - 确认游戏iframe正常加载

2. **响应式测试**:
   - 测试桌面端显示
   - 测试移动端适配
   - 验证全屏功能

3. **性能测试**:
   ```bash
   # 使用Lighthouse
   lighthouse https://your-domain.com

   # 检查页面速度
   curl -w "%{time_total}\n" -o /dev/null -s https://your-domain.com
   ```

## 🔍 构建详细说明

### 生成的文件结构

```
out/
├── index.html                 # 主页面(域名已更新)
├── flamy-dash.png            # 游戏封面图
├── _headers                  # Cloudflare HTTP头部配置
├── _redirects               # URL重定向规则
├── css/
│   └── game-integration.css # 游戏集成样式
├── js/
│   ├── api-client.js       # 静态API客户端
│   └── game-loader.js      # 游戏加载器(静态模式)
├── games/
│   └── flamy-dash/
│       └── latest/
│           └── index.html  # Unity WebGL游戏页面
└── config/
    ├── games.json          # 静态游戏配置
    ├── azgame-response.json # AzGame API兼容响应
    └── health.json         # 健康检查配置
```

### 静态优化特性

**✅ 保留的完整功能:**
- iframe游戏动态加载
- 加载进度和状态管理
- 错误处理和重试机制
- 全屏支持和游戏控制
- 双向iframe通信
- 响应式设计
- 移动端支持

**🚀 静态化改进:**
- 预生成配置文件 (无需API服务器)
- CDN优化的资源加载
- 零服务器维护成本
- 极快的加载速度
- 自动SSL证书
- 全球CDN分发

**📊 事件追踪:**
- localStorage本地存储
- Google Analytics集成
- 自定义事件记录

## 🎮 游戏配置说明

### 当前游戏配置

```json
{
  "id": "flamy-dash",
  "name": "Flamy Dash",
  "description": "Master the flames of precision",
  "iframe_url": "https://your-domain.com/games/flamy-dash/latest/",
  "width": 960,
  "height": 600,
  "enable_fullscreen": "yes",
  "enable_sound": "yes"
}
```

### 添加新游戏

1. **更新配置**:
   编辑 `server/config/games.json` 添加新游戏

2. **添加游戏文件**:
   ```
   games/
   └── new-game/
       └── latest/
           └── index.html
   ```

3. **重新构建**:
   ```bash
   npm run build
   ```

## 🔒 安全和性能

### 安全头部 (_headers文件)

```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

### 缓存策略

```
JavaScript/CSS: 1天缓存
图片资源: 1周缓存
配置文件: 5分钟缓存
```

### 性能优化

- **Brotli压缩**: 自动启用
- **HTTP/2**: Cloudflare默认支持
- **CDN**: 全球边缘节点
- **图片优化**: 自动WebP转换

## 📈 监控和分析

### Google Analytics

已集成GA4追踪代码:
```javascript
gtag('config', 'G-SE24TQQ4NY');
```

### 自定义事件

游戏会自动记录以下事件:
- `load_started` - 游戏开始加载
- `load_completed` - 游戏加载完成
- `game_started` - 游戏开始
- `score_achieved` - 分数达成
- `game_ended` - 游戏结束

### Cloudflare Analytics

在Cloudflare Dashboard中查看:
- 页面访问量
- 带宽使用
- 错误率统计
- 地理分布

## 🐛 常见问题解决

### 构建失败

```bash
# 清理并重新构建
rm -rf node_modules out
npm install
npm run build
```

### 游戏无法加载

1. 检查控制台错误信息
2. 验证iframe URL配置
3. 确认域名设置正确

### 样式显示问题

1. 清除浏览器缓存
2. 检查CSS文件路径
3. 验证_headers配置

## 🚀 部署完成清单

部署成功后，确认以下项目都正常工作:

- [ ] 主页面正常显示
- [ ] 游戏加载按钮可点击
- [ ] 游戏iframe正常嵌入
- [ ] 加载动画和进度条显示
- [ ] 错误处理和重试功能
- [ ] 全屏按钮工作正常
- [ ] 移动端适配良好
- [ ] 自定义域名解析正确
- [ ] SSL证书正常工作
- [ ] Google Analytics记录事件

---

🎉 **恭喜！你的Flamy Dash iframe游戏集成系统已成功部署到Cloudflare Pages！**

域名: `https://your-domain.com`
管理: [Cloudflare Dashboard](https://dash.cloudflare.com)
监控: [Analytics](https://analytics.google.com)