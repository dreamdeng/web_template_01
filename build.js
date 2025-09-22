const fs = require('fs-extra');
const path = require('path');

/**
 * 构建脚本 - 将静态文件输出到 out 目录供 Cloudflare 部署
 */

const OUTPUT_DIR = 'out';
const PUBLIC_DIR = 'public';

async function build() {
    console.log('🔨 Building project for Cloudflare deployment...\n');

    try {
        // 1. 清理输出目录
        console.log('🧹 Cleaning output directory...');
        await fs.remove(OUTPUT_DIR);
        await fs.ensureDir(OUTPUT_DIR);

        // 2. 复制 public 目录下的所有文件到 out
        console.log('📁 Copying public files...');
        await fs.copy(PUBLIC_DIR, OUTPUT_DIR);

        // 3. 复制 robots.txt
        console.log('🤖 Copying robots.txt...');
        if (await fs.pathExists('robots.txt')) {
            await fs.copy('robots.txt', path.join(OUTPUT_DIR, 'robots.txt'));
        } else {
            console.log('⚠️  robots.txt not found, creating default...');
            await createDefaultRobots();
        }

        // 4. 复制 sitemap.xml
        console.log('🗺️  Copying sitemap.xml...');
        if (await fs.pathExists('sitemap.xml')) {
            await fs.copy('sitemap.xml', path.join(OUTPUT_DIR, 'sitemap.xml'));
        } else {
            console.log('⚠️  sitemap.xml not found, creating default...');
            await createDefaultSitemap();
        }

        // 5. 创建 _redirects 文件供 Cloudflare Pages 使用
        console.log('🔄 Creating _redirects file...');
        await createRedirectsFile();

        // 6. 创建 _headers 文件
        console.log('📋 Creating _headers file...');
        await createHeadersFile();

        // 7. 复制 Cloudflare Functions
        console.log('⚡ Copying Cloudflare Functions...');
        if (await fs.pathExists('functions')) {
            await fs.copy('functions', path.join(OUTPUT_DIR, 'functions'));
        }

        // 8. 验证构建结果
        console.log('\n✅ Build completed successfully!');
        await listOutputFiles();

    } catch (error) {
        console.error('❌ Build failed:', error);
        process.exit(1);
    }
}

async function createDefaultRobots() {
    const robotsContent = `User-agent: *
Allow: /

# Prevent crawling of admin/private areas if any
Disallow: /admin/
Disallow: /private/
Disallow: /.well-known/

# Allow all crawlers to access game content
Allow: /

# Sitemap location
Sitemap: https://flamydash.com/sitemap.xml

# Crawl delay (optional - adjust based on server capacity)
Crawl-delay: 1

# Host directive (helps with canonical domain)
Host: https://flamydash.com`;

    await fs.writeFile(path.join(OUTPUT_DIR, 'robots.txt'), robotsContent);
}

async function createDefaultSitemap() {
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

    <!-- Homepage -->
    <url>
        <loc>https://flamydash.com/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>

</urlset>`;

    await fs.writeFile(path.join(OUTPUT_DIR, 'sitemap.xml'), sitemapContent);
}

async function createRedirectsFile() {
    const redirectsContent = `# Cloudflare Pages redirects
# API routes should be handled by Functions (if using)
/api/* /api/:splat 200

# Fallback for SPA routing
/* /index.html 200`;

    await fs.writeFile(path.join(OUTPUT_DIR, '_redirects'), redirectsContent);
}

async function createHeadersFile() {
    const headersContent = `# Cloudflare Pages headers configuration

/*
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

# Cache static assets
/css/*
  Cache-Control: public, max-age=31536000, immutable

/js/*
  Cache-Control: public, max-age=31536000, immutable

/assets/*
  Cache-Control: public, max-age=31536000, immutable

# Don't cache HTML files
/index.html
  Cache-Control: public, max-age=0, must-revalidate

# Allow iframe embedding for game content
/games/*
  X-Frame-Options: ALLOWALL

# SEO and crawling
/robots.txt
  Cache-Control: public, max-age=86400

/sitemap.xml
  Cache-Control: public, max-age=86400`;

    await fs.writeFile(path.join(OUTPUT_DIR, '_headers'), headersContent);
}

async function listOutputFiles() {
    const files = await fs.readdir(OUTPUT_DIR);
    console.log('\n📦 Output files in /out directory:');

    for (const file of files) {
        const filePath = path.join(OUTPUT_DIR, file);
        const stats = await fs.stat(filePath);

        if (stats.isDirectory()) {
            console.log(`  📁 ${file}/`);
            // List subdirectory contents
            const subFiles = await fs.readdir(filePath);
            for (const subFile of subFiles) {
                console.log(`    📄 ${subFile}`);
            }
        } else {
            console.log(`  📄 ${file}`);
        }
    }

    console.log('\n🚀 Ready for Cloudflare Pages deployment!');
    console.log('   Deploy the /out directory to Cloudflare Pages');
}

// 运行构建
build();