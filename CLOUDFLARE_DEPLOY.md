# Cloudflare Pages 部署指南

## 🚀 快速部署

### 方法一：通过 Cloudflare Dashboard

1. **登录 Cloudflare Dashboard**
   - 访问 [dash.cloudflare.com](https://dash.cloudflare.com)
   - 选择你的账户

2. **创建 Pages 项目**
   - 进入 "Pages" 部分
   - 点击 "创建项目"
   - 选择 "连接到 Git"

3. **构建设置**
   ```
   构建命令: npm run build
   构建输出目录: out
   根目录: /
   环境变量: 无需设置
   ```

4. **部署完成**
   - Cloudflare 将自动构建和部署
   - 你的网站将在 `https://your-project.pages.dev` 可用

### 方法二：本地构建后上传

1. **本地构建**
   ```bash
   npm install
   npm run build
   ```

2. **手动上传 /out 目录**
   - 在 Cloudflare Pages 中选择"直接上传"
   - 上传整个 `/out` 目录

## 📁 构建输出 (/out 目录)

构建后的 `/out` 目录包含：

```
out/
├── index.html          # 主页面
├── robots.txt          # SEO robots 文件
├── sitemap.xml         # 网站地图
├── _headers            # Cloudflare Headers 配置
├── _redirects          # Cloudflare 重定向配置
├── css/
│   └── game-integration.css
├── js/
│   ├── api-client.js
│   └── game-loader.js
├── flamy-dash.png      # 游戏图标
└── ...其他静态资源
```

## ⚙️ Cloudflare 特殊文件

### _headers
配置 HTTP 头部，包括：
- 安全头部 (CSP, X-Frame-Options 等)
- 缓存策略
- iframe 嵌入权限

### _redirects
配置 URL 重定向和路由：
- API 路由处理
- SPA 回退路由

## 🔧 自定义域名

1. **添加自定义域名**
   - 在 Pages 项目设置中点击 "自定义域名"
   - 添加 `flamydash.com`
   - 按照提示配置 DNS

2. **DNS 设置**
   ```
   类型: CNAME
   名称: @ (或 www)
   目标: your-project.pages.dev
   ```

## 🌍 环境配置

### 生产环境
- 域名: `https://flamydash.com`
- 构建命令: `npm run build`
- 输出目录: `out`

### 预览环境
- 每个 Pull Request 自动创建预览
- 域名: `https://[hash].flamydash-iframe-integration.pages.dev`

## 📊 监控和分析

Cloudflare Pages 提供：
- 构建日志
- 部署历史
- 流量分析
- 性能指标

## 🔍 SEO 配置

已包含的 SEO 文件：

### robots.txt
```
User-agent: *
Allow: /
Sitemap: https://flamydash.com/sitemap.xml
```

### sitemap.xml
包含网站主要页面的 XML 网站地图

## 🚨 故障排除

### 常见问题

1. **构建失败**
   - 检查 Node.js 版本 (需要 >= 14)
   - 确认所有依赖已安装

2. **资源加载失败**
   - 检查 `_headers` 文件配置
   - 确认所有文件路径正确

3. **iframe 不工作**
   - 验证 `X-Frame-Options` 设置
   - 检查 CSP 配置

### 调试命令

```bash
# 本地测试构建
npm run build
cd out && python -m http.server 8000

# 检查输出文件
ls -la out/
cat out/_headers
cat out/_redirects
```

## 📋 部署检查清单

- [ ] 运行 `npm run build` 成功
- [ ] `/out` 目录包含所有必需文件
- [ ] `robots.txt` 和 `sitemap.xml` 存在
- [ ] 自定义域名已配置
- [ ] DNS 记录已更新
- [ ] HTTPS 证书已激活

## 🎯 性能优化

Cloudflare Pages 自动提供：
- 全球 CDN 分发
- 自动 HTTPS
- 资源压缩
- 图片优化
- 缓存优化

构建完成后，你的 Flamy Dash iframe 游戏集成系统就可以在 Cloudflare Pages 上运行了！