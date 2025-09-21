# 🌐 Cloudflare Pages 部署指南

专为Cloudflare Pages优化的静态部署版本，输出到`out/`目录。

## 🚀 快速部署

### 方法1: Git 连接部署 (推荐)

1. **推送代码到Git仓库**
   ```bash
   git add .
   git commit -m "Add Cloudflare Pages static build"
   git push origin main
   ```

2. **在Cloudflare Dashboard中设置**
   - 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
   - 选择 "Pages" → "Create a project"
   - 连接你的Git仓库
   - 配置构建设置：
     - **构建命令**: `npm run build:cloudflare`
     - **输出目录**: `out`
     - **Node.js版本**: `18` (或更高)

3. **设置环境变量** (可选)
   ```
   DOMAIN=你的域名.com
   ```

4. **部署完成**
   - Cloudflare会自动构建和部署
   - 每次推送都会触发重新部署

### 方法2: 手动上传

1. **本地构建**
   ```bash
   # 安装依赖
   npm install

   # 构建静态文件
   npm run build:static
   ```

2. **上传到Cloudflare Pages**
   - 访问 Cloudflare Dashboard
   - 选择 "Pages" → "Upload assets"
   - 上传整个 `out/` 目录

## 📁 静态构建输出结构

```
out/
├── index.html              # 主页面
├── flamy-dash.png          # 游戏封面图
├── css/
│   └── game-integration.css
├── js/
│   ├── api-client.js       # 静态API客户端
│   └── game-loader.js      # 游戏加载器
├── games/
│   └── flamy-dash/
│       └── latest/
│           └── index.html  # 游戏嵌入页面
├── config/
│   ├── games.json          # 游戏配置
│   ├── azgame-response.json # AzGame兼容响应
│   └── health.json         # 健康检查
├── _headers                # Cloudflare头部配置
└── _redirects              # 重定向规则
```

## ⚙️ 构建配置

### 环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `DOMAIN` | `flamydash.com` | 你的域名 |

### 构建命令

```bash
# 使用默认域名构建
npm run build

# 使用指定域名构建
DOMAIN=your-domain.com npm run build:cloudflare

# 或者
npm run build:cloudflare
```

## 🔧 自定义配置

### 修改域名

1. **构建时指定**:
   ```bash
   DOMAIN=your-domain.com npm run build:cloudflare
   ```

2. **修改构建脚本**:
   编辑 `build-static.js` 中的默认域名：
   ```javascript
   this.domain = 'your-domain.com';
   ```

### 修改游戏配置

编辑 `server/config/games.json`：

```json
{
  "games": {
    "flamy-dash": {
      "name": "Your Game Name",
      "description": "Your game description",
      "iframe_url": "https://your-domain.com/games/your-game/latest/",
      "width": 960,
      "height": 600
    }
  }
}
```

### 添加新游戏

1. 在 `games/` 目录下创建游戏文件夹
2. 更新 `server/config/games.json`
3. 重新构建: `npm run build`

## 🌐 域名设置

### 使用自定义域名

1. **在Cloudflare Pages中设置**:
   - 进入你的Pages项目
   - 选择 "Custom domains"
   - 添加你的域名

2. **DNS配置**:
   - 添加CNAME记录指向Cloudflare Pages
   - 或使用Cloudflare作为DNS提供商

3. **SSL设置**:
   - Cloudflare会自动提供SSL证书
   - 确保SSL模式设置为"Full"或"Full (strict)"

## 🔍 静态模式特性

### 与完整版本的区别

| 功能 | 完整版 | 静态版 |
|------|--------|--------|
| 动态API | ✅ | ❌ |
| 静态配置 | ❌ | ✅ |
| 服务器依赖 | ✅ | ❌ |
| 游戏嵌入 | ✅ | ✅ |
| 事件追踪 | 数据库 | localStorage + GA |
| 加载性能 | 中等 | 优秀 |
| 维护成本 | 高 | 低 |

### 静态版本功能

✅ **保留的功能**:
- 完整的游戏iframe集成
- 加载状态管理和进度显示
- 错误处理和重试机制
- 响应式设计和移动端支持
- 全屏功能和游戏控制
- 双向iframe通信
- Google Analytics集成

✅ **静态化改进**:
- 预生成的配置文件
- 本地事件存储
- CDN优化的资源加载
- 更快的页面加载速度
- 零服务器维护成本

## 📊 性能优化

### Cloudflare优化设置

1. **缓存配置** (通过`_headers`文件):
   ```
   /js/* - 1天缓存
   /css/* - 1天缓存
   /images/* - 1周缓存
   /config/* - 5分钟缓存
   ```

2. **压缩设置**:
   - 自动启用Brotli压缩
   - 自动图片优化

3. **CDN设置**:
   - 全球CDN分发
   - 自动HTTP/2推送

### 前端优化

- **懒加载**: 游戏iframe按需加载
- **资源预加载**: 关键CSS和JS优先加载
- **图片优化**: 使用WebP格式 (如果支持)

## 🔒 安全配置

### HTTP头部设置

通过`_headers`文件配置的安全头部:

```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

### iframe安全

- 游戏iframe使用沙箱权限
- 限制iframe只能从相同域名加载

## 🧪 测试和验证

### 构建测试

```bash
# 构建静态文件
npm run build

# 检查输出文件
ls -la out/

# 本地预览 (需要HTTP服务器)
npx serve out
```

### 部署后测试

1. **基础功能测试**:
   - 访问主页面
   - 点击游戏加载按钮
   - 验证iframe正常显示
   - 测试全屏功能

2. **性能测试**:
   ```bash
   # 使用lighthouse
   lighthouse https://your-domain.com --output html

   # 检查页面加载速度
   curl -w "@curl-format.txt" -o /dev/null -s https://your-domain.com
   ```

3. **移动端测试**:
   - 使用浏览器开发者工具
   - 测试不同屏幕尺寸
   - 验证触摸操作

## 🐛 故障排除

### 常见问题

1. **构建失败**:
   ```bash
   # 检查Node.js版本
   node --version

   # 清理并重新安装依赖
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **游戏无法加载**:
   - 检查控制台错误信息
   - 验证iframe URL是否正确
   - 确认域名配置正确

3. **样式显示异常**:
   - 检查CSS文件路径
   - 验证构建输出是否完整
   - 清除浏览器缓存

### 调试技巧

1. **查看构建日志**:
   - Cloudflare Pages控制台中的构建日志
   - 检查构建命令输出

2. **本地调试**:
   ```bash
   # 构建并本地运行
   npm run build
   npx serve out
   ```

3. **远程调试**:
   - 使用浏览器开发者工具
   - 检查网络请求状态
   - 查看控制台错误信息

## 📈 进一步优化

### 高级功能

1. **PWA支持**:
   - 添加Service Worker
   - 配置应用清单
   - 支持离线访问

2. **A/B测试**:
   - 使用Cloudflare Workers
   - 多版本游戏配置

3. **实时分析**:
   - 集成Google Analytics 4
   - 自定义事件追踪
   - 用户行为分析

### 扩展建议

1. **多游戏支持**:
   - 游戏选择界面
   - 动态游戏加载
   - 游戏分类系统

2. **用户功能**:
   - 分数保存
   - 成就系统
   - 社交分享

---

🎮 **享受在Cloudflare Pages上的极速游戏体验！**