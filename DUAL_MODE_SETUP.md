# SUNR Dual-Mode Data System

This document explains the dual-mode data system implemented for the SUNR lander application, allowing it to operate in both developer mode (API-based) and production mode (static data).

## Overview

The SUNR lander application now supports two distinct modes:

1. **Developer Mode (API)**: Uses real-time API calls to fetch data from Supabase database
2. **Production Mode (Static)**: Uses pre-generated JSON files for faster performance

## How It Works

### Data Provider Layer

The system uses a centralized data provider (`lib/data-provider.ts`) that abstracts data fetching logic. Based on the `NEXT_PUBLIC_USE_API_DATA` environment variable, it automatically switches between:

- Making API calls to `/api/*` endpoints (Developer Mode)
- Reading static JSON files from the `data/` directory (Production Mode)

### Environment Variable

```bash
# Developer Mode - Uses API calls
NEXT_PUBLIC_USE_API_DATA=true

# Production Mode - Uses static JSON files
NEXT_PUBLIC_USE_API_DATA=false
```

## Setup Instructions

### 1. Environment Configuration

#### For Development (API Mode)

Create `.env.local` with:

```bash
NEXT_PUBLIC_USE_API_DATA=true
# ... other environment variables
```

#### For Production (Static Mode)

Create `.env.local` with:

```bash
NEXT_PUBLIC_USE_API_DATA=false
# ... other environment variables
```

### 2. Data Synchronization

To generate static JSON files for production mode:

1. **From Dashboard**: Go to Settings → Sync to Lander → Click "Sync Data"
2. **Manually**: Call the sync API endpoint: `POST /api/sync/lander`

This will:

- Export all data from the dashboard's Supabase database
- Generate JSON files in `sunr-next-app/public/data/` directory
- Create a sync metadata file with timestamp and statistics

### 3. Build Commands

```bash
# Build for development (API mode)
npm run build:api

# Build for production (static mode)
npm run build:static

# Default build (uses current environment variable)
npm run build
```

## Data Files Structure

When sync is performed, the following JSON files are generated in `public/data/`:

```
public/data/
├── projects.json          # Project data with count
├── cities.json           # Available cities
├── packages.json         # Service packages by city
├── testimonials.json     # Customer testimonials
├── gallery.json          # Gallery images
├── faqs.json            # FAQ content
├── blogs.json           # Blog posts
├── main-page-content.json # Main page sections
├── company-settings.json  # Company settings
└── sync-meta.json        # Sync metadata
```

## Performance Benefits

### Developer Mode (API)

- ✅ Real-time data updates
- ✅ Easy development and testing
- ❌ Slower page loads due to API calls
- ❌ Database dependency for every request

### Production Mode (Static)

- ✅ **Faster page loads** (no API calls)
- ✅ **Better SEO** (static data available at build time)
- ✅ **CDN optimization** (JSON files can be cached)
- ✅ **Reduced database load**
- ❌ Requires manual sync to update data

## Usage in Components

The data provider automatically handles mode switching:

```typescript
import { getProjects, getCities, getTestimonials } from "@/lib/data-provider";

// This will use API or static data based on environment
const projects = await getProjects(true);
const cities = await getCities(true);
const testimonials = await getTestimonials();
```

## Deployment Strategies

### Netlify Environment Variables

#### Development Site

```
NEXT_PUBLIC_USE_API_DATA=true
```

#### Production Site

```
NEXT_PUBLIC_USE_API_DATA=false
```

### Sync Workflow

1. **Content Updates**: Make changes in the dashboard
2. **Sync Data**: Click "Sync to Lander" in dashboard settings
3. **Deploy**: Netlify will automatically rebuild with new static data

## API Endpoints Affected

The following components now use the data provider:

- **Main Page** (`app/page.tsx`)

  - Projects gallery
  - Packages section
  - Testimonials
  - Main page content

- **Projects Page** (`app/projects/page.tsx`)

  - Project listings

- **City Context** (`app/contexts/CityContext.tsx`)
  - City selection

## Troubleshooting

### Data Not Loading

1. Check environment variable: `NEXT_PUBLIC_USE_API_DATA`
2. In static mode, ensure JSON files exist in `public/data/` directory
3. Check browser console for data provider logs

### Sync Issues

1. Verify dashboard database connection
2. Check file permissions in `sunr-next-app/public/data/` directory
3. Review sync logs in dashboard settings

### Build Issues

1. Ensure `public/data/` directory exists (created automatically)
2. Use correct build command for desired mode
3. Check TypeScript errors in data provider usage

## File Locations

- **Data Provider**: `sunr-next-app/lib/data-provider-client.ts`
- **Static Data**: `sunr-next-app/public/data/*.json`
- **Sync Endpoint**: `sunbrix-dashboard/app/api/sync/lander/route.ts`
- **Environment Template**: `sunr-next-app/env.template`

## Benefits Summary

This dual-mode system provides the best of both worlds:

- **Fast development** with real-time data in developer mode
- **Optimal performance** with static data in production mode
- **Seamless switching** between modes without code changes
- **Easy deployment** with environment-based configuration

The system is particularly beneficial for portfolio websites where performance is critical, but content updates are infrequent and can be managed through a sync process.
