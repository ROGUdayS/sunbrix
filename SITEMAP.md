# Sitemap Setup for Sunbrix Homes

This document explains the sitemap setup for the Sunbrix Homes website.

## Domain

The sitemap is configured for: **https://sunbrix.netlify.app**

## Files Created

### 1. Dynamic Sitemap (`app/sitemap.ts`)

- **Purpose**: Generates sitemap dynamically using Next.js 13+ App Router
- **Features**:
  - Automatically includes all projects from `data/projects.json`
  - Updates lastModified dates automatically
  - Proper priority and change frequency settings
- **URL**: `/sitemap.xml` (automatically served by Next.js)

### 2. Static Sitemap (`public/sitemap.xml`)

- **Purpose**: Static XML sitemap as backup
- **Features**:
  - Includes all pages and individual project pages
  - Manually updated dates
  - SEO-friendly XML format
- **URL**: `/sitemap.xml` (served from public directory)

### 3. Robots.txt (`app/robots.ts` & `public/robots.txt`)

- **Purpose**: Tells search engines how to crawl your site
- **Features**:
  - Allows all pages except `/api/` and `/thank-you/`
  - Points to sitemap location
  - Both dynamic and static versions

## Pages Included in Sitemap

### Main Pages

- `/` - Homepage (Priority: 1.0, Weekly updates)
- `/about` - About Us (Priority: 0.8, Monthly updates)
- `/projects` - Projects Gallery (Priority: 0.9, Weekly updates)
- `/testimonials` - Customer Testimonials (Priority: 0.8, Weekly updates)
- `/blogs` - Blog Posts (Priority: 0.7, Weekly updates)
- `/faq` - Frequently Asked Questions (Priority: 0.6, Monthly updates)
- `/contact` - Contact Page (Priority: 0.8, Monthly updates)

### Individual Project Pages

- `/projects/rajendras-residence`
- `/projects/shailendras-residence`
- `/projects/itishrees-residence`
- `/projects/srishtis-residence`
- `/projects/rajbeers-residence`
- `/projects/sanjays-residence`
- `/projects/ranjeeths-residence`
- `/projects/narayans-residence`
- `/projects/ashoks-residence`
- `/projects/nileshs-residence`

All project pages have Priority: 0.7 and Monthly updates.

## Maintenance

### Updating Sitemap Dates

Run the following command to update all lastmod dates to today:

```bash
npm run update-sitemap
```

### Adding New Projects

1. Add the project to `data/projects.json`
2. The dynamic sitemap will automatically include it
3. Update the static sitemap manually or regenerate it

### Changing Domain

If you change the domain, update it in:

1. `app/sitemap.ts` - line 4
2. `app/robots.ts` - line 4
3. `public/sitemap.xml` - all `<loc>` tags
4. `public/robots.txt` - line 6

**Current domain**: https://sunbrix.netlify.app

### Adding New Pages

1. Add the page to `app/sitemap.ts` in the `basePages` array
2. Add the page to `public/sitemap.xml`
3. Update `public/robots.txt` if needed

## SEO Benefits

- **Search Engine Discovery**: Helps search engines find all your pages
- **Crawl Efficiency**: Tells search engines how often to check for updates
- **Priority Guidance**: Indicates which pages are most important
- **Indexing Speed**: Faster indexing of new content

## Testing

To test your sitemap:

1. Run the development server: `npm run dev`
2. Visit: `http://localhost:3000/sitemap.xml`
3. Verify all URLs are correct and accessible

## Search Console Setup

After deployment:

1. Submit your sitemap URL to Google Search Console
2. Monitor indexing status
3. Check for any crawl errors
