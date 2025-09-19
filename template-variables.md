# Template Variables Guide

This document explains all variables used in the gaming website template system. Replace each `{{VARIABLE}}` with appropriate content for your specific game.

## Core Game Information

### `{{GAME_NAME}}`
- **Purpose**: Primary game title (appears 15-20 times throughout the page for SEO)
- **Example**: "Human Expenditure Program", "Digital Odyssey", "Quantum Puzzle"
- **Length**: 1-4 words
- **SEO Note**: Keep consistent throughout. This is your main keyword.

### `{{GAME_TAGLINE}}`
- **Purpose**: Compelling subtitle that appears in title and hero section
- **Example**: "Play Online, Face the Choice, Own the Ending"
- **Length**: 5-10 words
- **SEO Note**: Should include action words and emotional hooks

### `{{GAME_DESCRIPTION_SHORT}}`
- **Purpose**: Brief description for meta tags and social media
- **Example**: "A psychological simulation about money, time, and integrity"
- **Length**: 10-20 words
- **SEO Note**: Include main keywords and genre

### `{{GAME_DESCRIPTION_LONG}}`
- **Purpose**: Detailed hero section description
- **Example**: "Experience a psychological simulation where every choice matters. Navigate complex ethical decisions about money, time, and integrity in this thought-provoking interactive experience."
- **Length**: 2-3 sentences
- **SEO Note**: Natural keyword integration, emotional appeal

### `{{GAME_CALL_TO_ACTION}}`
- **Purpose**: Action-oriented text for meta description
- **Example**: "Play now and discover multiple endings based on your choices"
- **Length**: 8-15 words

## Technical & Design Variables

### `{{DOMAIN_NAME}}`
- **Purpose**: Your website domain (without https://)
- **Example**: "humanexpenditureprogram.org"
- **Format**: domain.com or subdomain.domain.com

### `{{THEME_COLOR}}`
- **Purpose**: Primary brand color for browser theme
- **Example**: "#661AE6" (purple)
- **Format**: Hex color code

### `{{PRIMARY_COLOR}}`
- **Purpose**: Main gradient color
- **Example**: "#1a0b2e" (dark purple)
- **Format**: Hex color code

### `{{SECONDARY_COLOR}}`
- **Purpose**: Secondary gradient color
- **Example**: "#2d1b69" (lighter purple)
- **Format**: Hex color code

### `{{ACCENT_COLOR}}`
- **Purpose**: Highlight color for buttons and text
- **Example**: "#8b5cf6" (violet)
- **Format**: Hex color code

### `{{ACCENT_COLOR_LIGHT}}`
- **Purpose**: Lighter accent for hover effects
- **Example**: "#a78bfa" (light violet)
- **Format**: Hex color code

## SEO & Content Variables

### `{{GAME_GENRE}}`
- **Purpose**: Game category for SEO
- **Example**: "psychological simulation", "puzzle game", "adventure"
- **Length**: 1-3 words

### `{{GAME_KEYWORDS}}`
- **Purpose**: Additional keywords for meta tags
- **Example**: "interactive fiction, choices matter, multiple endings"
- **Length**: 3-8 comma-separated keywords

### `{{GAME_THEME_KEYWORDS}}`
- **Purpose**: Theme-specific keywords
- **Example**: "ethics, moral choices, decision making"
- **Length**: 3-6 comma-separated keywords

### `{{GAME_IMAGE}}`
- **Purpose**: Social media preview image filename
- **Example**: "game-preview.jpg"
- **Format**: image filename with extension

## Developer Information

### `{{DEVELOPER_NAME}}`
- **Purpose**: Game developer/creator name
- **Example**: "IndieGameStudio", "John Smith Games"

### `{{DEVELOPER_URL}}`
- **Purpose**: Developer's website or portfolio URL
- **Example**: "https://developer-website.com"

## Game Integration

### `{{GAME_EMBED_URL}}`
- **Purpose**: URL for embedded game iframe
- **Example**: "https://html-classic.itch.zone/html/12345/index.html"
- **Note**: Must be embeddable iframe source

### `{{OFFICIAL_GAME_URL}}`
- **Purpose**: Link to official game page (itch.io, Steam, etc.)
- **Example**: "https://developer.itch.io/game-name"

### `{{OFFICIAL_LINK_TEXT}}`
- **Purpose**: Text for official link button
- **Example**: "Play on itch.io", "Download on Steam"

### `{{GAME_DISCLAIMER_TEXT}}`
- **Purpose**: Legal disclaimer for embedded game
- **Example**: "This is an unofficial web embed. For the full experience, visit the official page."

## Content Sections

### `{{GAME_ABOUT_PARAGRAPH_1}}`
- **Purpose**: First descriptive paragraph about the game
- **Length**: 2-3 sentences
- **Content**: Core concept, what makes it unique

### `{{GAME_ABOUT_PARAGRAPH_2}}`
- **Purpose**: Second descriptive paragraph
- **Length**: 2-3 sentences
- **Content**: Emotional impact, target audience appeal

### `{{GAME_MECHANICS_TITLE}}`
- **Purpose**: Title for gameplay mechanics section
- **Example**: "How It Works", "Core Mechanics", "Gameplay Features"

### `{{GAME_MECHANICS_DESCRIPTION}}`
- **Purpose**: Explanation of how the game works
- **Length**: 2-4 sentences
- **Content**: Basic mechanics, user interaction

## Feature Cards (3 main features)

### `{{FEATURE_1_TITLE}}` / `{{FEATURE_1_DESCRIPTION}}`
### `{{FEATURE_2_TITLE}}` / `{{FEATURE_2_DESCRIPTION}}`
### `{{FEATURE_3_TITLE}}` / `{{FEATURE_3_DESCRIPTION}}`
- **Purpose**: Highlight key game features
- **Title Length**: 2-4 words
- **Description Length**: 1-2 sentences
- **Examples**:
  - "Multiple Endings" / "Your choices determine the outcome..."
  - "Psychological Depth" / "Explore complex moral decisions..."
  - "Replay Value" / "Discover new paths each playthrough..."

## Gameplay Details

### `{{GAMEPLAY_SECTION_TITLE}}`
- **Purpose**: Title for detailed gameplay section
- **Example**: "Experience the Challenge", "Master the Mechanics"

### `{{GAMEPLAY_DESCRIPTION_1}}` / `{{GAMEPLAY_DESCRIPTION_2}}`
- **Purpose**: Detailed gameplay explanation
- **Length**: 2-3 sentences each
- **Content**: Strategy tips, what to expect

### `{{ENDINGS_TITLE}}`
- **Purpose**: Section title about game endings
- **Example**: "Multiple Paths to Victory", "Choose Your Destiny"

### `{{ENDINGS_DESCRIPTION}}`
- **Purpose**: Description of ending system
- **Length**: 2-3 sentences
- **Content**: How endings work, replay value

### `{{STRATEGY_TITLE}}`
- **Purpose**: Strategy section title
- **Example**: "Winning Strategies", "Tips for Success"

### `{{STRATEGY_DESCRIPTION}}`
- **Purpose**: Gameplay tips and strategies
- **Length**: 2-4 sentences
- **Content**: Helpful hints without spoilers

## Video Content

### `{{VIDEO_SECTION_TITLE}}`
- **Purpose**: Video section heading
- **Example**: "Watch Gameplay", "See It In Action"

### `{{YOUTUBE_EMBED_URL}}`
- **Purpose**: YouTube embed URL
- **Example**: "https://www.youtube.com/embed/VIDEO_ID"
- **Format**: YouTube embed format only

## FAQ Section (5 questions)

### `{{FAQ_1_QUESTION}}` / `{{FAQ_1_ANSWER}}`
### `{{FAQ_2_QUESTION}}` / `{{FAQ_2_ANSWER}}`
### `{{FAQ_3_QUESTION}}` / `{{FAQ_3_ANSWER}}`
### `{{FAQ_4_QUESTION}}` / `{{FAQ_4_ANSWER}}`
### `{{FAQ_5_QUESTION}}` / `{{FAQ_5_ANSWER}}`

**Common FAQ Topics:**
- How to play
- System requirements
- Is it free?
- Mobile compatibility
- How long to complete

**Answer Length**: 1-3 sentences each

## Footer & Legal

### `{{CURRENT_YEAR}}`
- **Purpose**: Copyright year
- **Example**: "2024"
- **Update**: Change annually

### `{{FOOTER_COPYRIGHT_TEXT}}`
- **Purpose**: Copyright statement
- **Example**: "All rights reserved", "Game content by [Developer]"

### `{{FOOTER_DISCLAIMER}}`
- **Purpose**: Legal disclaimer
- **Example**: "This unofficial website is created for promotional purposes only."

## Dates & Technical

### `{{LAST_MOD_DATE}}`
- **Purpose**: Last modification date for sitemap
- **Format**: YYYY-MM-DD
- **Example**: "2024-01-15"

## SEO Best Practices

1. **Keyword Density**: Ensure {{GAME_NAME}} appears 15-20 times naturally
2. **Content Length**: Aim for 1500+ words total
3. **Readability**: Keep sentences clear and engaging
4. **Call-to-Actions**: Include action words in descriptions
5. **Emotional Appeal**: Connect with player motivations
6. **Unique Content**: Avoid generic descriptions

## Content Writing Tips

### For Game Descriptions:
- Focus on emotional impact
- Highlight unique features
- Use active voice
- Include sensory language
- Mention target audience benefits

### For SEO Content:
- Natural keyword integration
- Answer user questions
- Include related terms
- Maintain reader engagement
- Provide clear value proposition

### For FAQ Content:
- Address common concerns
- Be helpful and informative
- Keep answers concise
- Use friendly tone
- Include technical details when needed

## Template Customization Notes

- All colors should maintain good contrast for accessibility
- Ensure responsive design works with your content length
- Test iframe embedding with your specific game URL
- Verify all links work before deployment
- Check mobile experience with your content
- Validate HTML and CSS after variable replacement

Remember: This template is optimized for single-page game promotion sites. Adjust content strategy based on your specific game genre and target audience.