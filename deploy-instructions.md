# Game Website Template - Deployment Instructions

This guide will help you deploy your game promotion website using the extracted template system.

## Prerequisites

- A GitHub account
- A Cloudflare account (free tier available)
- A domain name (optional, Cloudflare provides free subdomain)
- Your game content and assets ready

## Quick Start (5-Minute Setup)

### Step 1: Prepare Your Content

1. **Gather Required Assets:**
   - Game embed URL (from itch.io, etc.)
   - Game preview image (1200x630px recommended)
   - Official game links
   - Game description and screenshots

2. **Fill Out Variables:**
   - Open `template-variables.md` for reference
   - Replace all `{{VARIABLE}}` placeholders in `index.html`
   - Update `robots.txt` and `sitemap.xml` with your domain

### Step 2: Create GitHub Repository

1. **Create New Repository:**
   ```bash
   # In your project folder
   git init
   git add .
   git commit -m "Initial game website setup"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-game-website.git
   git push -u origin main
   ```

2. **Repository Structure:**
   ```
   your-game-website/
   ├── index.html (customized)
   ├── robots.txt (customized)
   ├── sitemap.xml (customized)
   ├── favicon.ico
   ├── apple-touch-icon.png
   └── game-preview.jpg
   ```

### Step 3: Deploy on Cloudflare Pages

1. **Connect to Cloudflare:**
   - Go to [Cloudflare Pages](https://pages.cloudflare.com/)
   - Click "Create a project"
   - Connect your GitHub account
   - Select your repository

2. **Build Settings:**
   - Framework preset: **None (Static HTML)**
   - Build command: *Leave empty*
   - Build output directory: `/`
   - Root directory: `/`

3. **Deploy:**
   - Click "Save and Deploy"
   - Wait 1-2 minutes for deployment
   - Your site will be live at `your-project.pages.dev`

### Step 4: Custom Domain Setup (Optional)

1. **Add Custom Domain:**
   - In Cloudflare Pages dashboard, go to "Custom domains"
   - Click "Set up a custom domain"
   - Enter your domain name

2. **DNS Configuration:**
   - Add CNAME record: `www` → `your-project.pages.dev`
   - Add CNAME record: `@` → `your-project.pages.dev`
   - SSL/TLS will be configured automatically

## Detailed Customization Guide

### Variable Replacement Process

1. **Open index.html in text editor**
2. **Search and replace each variable:**

```bash
# Example replacements
{{GAME_NAME}} → "Your Amazing Game"
{{DOMAIN_NAME}} → "yourgame.com"
{{GAME_EMBED_URL}} → "https://html-classic.itch.zone/html/12345/index.html"
```

3. **Use consistent naming throughout**
4. **Test locally by opening index.html in browser**

### SEO Optimization Checklist

#### Meta Tags & Content
- [ ] Game name appears 15-20 times naturally
- [ ] Meta description under 160 characters
- [ ] All images have alt text
- [ ] Title tag follows format: "Game Name: Tagline"

#### Technical SEO
- [ ] robots.txt uploaded and accessible
- [ ] sitemap.xml uploaded and accessible
- [ ] Favicon added (16x16, 32x32, 180x180)
- [ ] Page loads under 3 seconds
- [ ] Mobile-responsive design tested

#### Content SEO
- [ ] FAQ section addresses common questions
- [ ] Game description includes target keywords
- [ ] Clear call-to-action buttons
- [ ] External links to official game pages

### Performance Optimization

#### Image Optimization
```bash
# Recommended image sizes
Favicon: 32x32px, 16x16px
Apple Touch Icon: 180x180px
Social Media Preview: 1200x630px
Game Screenshots: 800x600px (or game aspect ratio)
```

#### Content Delivery
- Cloudflare automatically provides:
  - Global CDN
  - Image optimization
  - Automatic compression
  - SSL certificates

### Advanced Configuration

#### Custom Headers (Optional)
Add to `_headers` file in root:
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
```

#### Redirects (Optional)
Add to `_redirects` file in root:
```
/play /
/download {{OFFICIAL_GAME_URL}}
```

## Domain and SEO Setup

### Domain Selection Best Practices

1. **Domain Name Ideas:**
   - Include game name: `yourgamename.com`
   - Add descriptive words: `playyourgame.com`
   - Use brandable domains: `yourgamestudio.com`

2. **Domain Registration:**
   - Use Cloudflare Registrar for best integration
   - Enable WHOIS privacy protection
   - Set up automatic renewal

### Google Search Console Setup

1. **Add Property:**
   - Go to [Google Search Console](https://search.google.com/search-console/)
   - Add property with your domain
   - Verify ownership via DNS

2. **Submit Sitemap:**
   - In Search Console, go to "Sitemaps"
   - Submit: `https://yourdomain.com/sitemap.xml`

3. **Monitor Performance:**
   - Check indexing status weekly
   - Monitor search keywords
   - Review mobile usability

### Analytics Setup (Optional)

#### Google Analytics 4
Add before closing `</head>` tag:
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## Content Strategy

### Writing Effective Game Descriptions

1. **Hook (First 2 sentences):**
   - What makes your game unique?
   - Emotional appeal to target audience

2. **Features (Middle section):**
   - Core gameplay mechanics
   - Key features and benefits
   - Target audience appeal

3. **Call-to-Action (Final section):**
   - Clear next steps
   - Multiple engagement options
   - Social proof if available

### FAQ Content Ideas

**Essential Questions:**
- "How do I play [Game Name]?"
- "Is [Game Name] free to play?"
- "What are the system requirements?"
- "How long does it take to complete?"
- "Can I play on mobile devices?"

### Social Media Integration

#### Open Graph Optimization
Ensure these variables are set correctly:
- `{{GAME_IMAGE}}` - High-quality preview image
- `{{GAME_DESCRIPTION_SHORT}}` - Compelling one-liner
- `{{DOMAIN_NAME}}` - Your custom domain

#### Twitter Cards
The template automatically generates Twitter card meta tags for better social sharing.

## Maintenance and Updates

### Regular Tasks

#### Weekly:
- [ ] Check website uptime
- [ ] Review analytics for new keywords
- [ ] Monitor search console for errors

#### Monthly:
- [ ] Update last modified dates in sitemap
- [ ] Check for broken links
- [ ] Review and update FAQ if needed

#### As Needed:
- [ ] Add new game content or updates
- [ ] Update social media previews
- [ ] Respond to user feedback

### Content Updates

When updating game content:
1. Edit the HTML file variables
2. Update sitemap.xml with new date
3. Commit changes to GitHub
4. Cloudflare Pages will auto-deploy

### Backup Strategy

- GitHub automatically backs up your code
- Cloudflare maintains deployment history
- Export analytics data monthly for records

## Troubleshooting

### Common Issues

#### Site Not Loading:
- Check Cloudflare Pages deployment status
- Verify GitHub repository connection
- Confirm build completed successfully

#### Game Embed Not Working:
- Verify iframe URL is embeddable
- Check for HTTPS requirement
- Test embed URL in separate browser tab

#### SEO Issues:
- Use Google Search Console for specific errors
- Validate HTML using W3C validator
- Test mobile-friendliness with Google's tool

### Support Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Google Search Console Help](https://support.google.com/webmasters/)
- [HTML Validation Tool](https://validator.w3.org/)

### Contact and Community

For template-specific issues:
- Review `template-variables.md` for variable descriptions
- Check GitHub repository for updates
- Consider hiring a web developer for custom modifications

## Success Metrics

### Track These KPIs:

1. **Traffic Metrics:**
   - Unique visitors per month
   - Page views and session duration
   - Mobile vs desktop usage

2. **Engagement Metrics:**
   - Game embed click-through rate
   - Time spent on page
   - External link clicks to official game

3. **SEO Metrics:**
   - Search ranking for game name
   - Organic search traffic growth
   - Featured snippet appearances

4. **Conversion Metrics:**
   - Clicks to official game page
   - Download/play button engagement
   - Social media shares

### Optimization Tips:

- A/B test different game descriptions
- Monitor which keywords drive traffic
- Update content based on user feedback
- Keep game information current and accurate

---

## Quick Reference Commands

```bash
# Deploy updates
git add .
git commit -m "Update game content"
git push origin main

# Check site status
curl -I https://yourdomain.com

# Test mobile responsiveness
# Use Chrome DevTools device simulator
```

**Estimated Setup Time:** 30 minutes to 2 hours (depending on customization level)
**Ongoing Maintenance:** 1-2 hours per month

Good luck with your game website launch! 🎮