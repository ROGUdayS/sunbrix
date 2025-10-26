# Google Tag Manager Setup

## Overview

Google Tag Manager (GTM) has been set up for the sunr-next-app application with the container ID **GTM-58X396C8**.

## Important: Conditional Loading

GTM is **only loaded when the application is in static mode**, i.e., when:

```
NEXT_PUBLIC_USE_API_DATA=false
```

This ensures that GTM tracking is only active on the production/public-facing version of the site and not during development or when using API data mode.

## Implementation Details

### Files Modified/Created

1. **`app/components/GoogleTagManager.tsx`** - Main GTM component

   - Loads GTM script conditionally based on `NEXT_PUBLIC_USE_API_DATA`
   - Includes both the script and noscript fallback
   - Uses Next.js Script component for optimized loading

2. **`app/layout.tsx`** - Root layout

   - Imports and renders GTM components
   - GTM script in `<head>`
   - GTM noscript in `<body>`

3. **`types/gtm.d.ts`** - TypeScript definitions
   - Type definitions for window.dataLayer

## How It Works

1. When `NEXT_PUBLIC_USE_API_DATA=false` (static mode):

   - GTM script loads automatically
   - dataLayer is initialized
   - All GTM tags and triggers work as configured in GTM dashboard

2. When `NEXT_PUBLIC_USE_API_DATA=true` (API mode):
   - GTM components return `null`
   - No GTM code is loaded
   - No tracking occurs

## Configuration

The GTM container ID is hardcoded in the component:

```typescript
const GTM_ID = "GTM-58X396C8";
```

If you need to change the container ID, update it in:

- `app/components/GoogleTagManager.tsx`

## Usage in GTM Dashboard

With GTM set up, you can now configure:

- **Tags**: Google Analytics, Facebook Pixel, conversion tracking, etc.
- **Triggers**: Page views, clicks, form submissions, etc.
- **Variables**: Custom data layer variables, URL parameters, etc.

## Testing

To test GTM implementation:

1. Ensure your `.env.local` has:

   ```
   NEXT_PUBLIC_USE_API_DATA=false
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open browser DevTools → Network tab
4. Look for requests to `googletagmanager.com`
5. Check browser console for `dataLayer` array:
   ```javascript
   console.log(window.dataLayer);
   ```

## Data Layer Events

You can push custom events to the data layer from anywhere in your app:

```typescript
// Example: Track button click
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: "button_click",
  button_name: "Contact Us",
  page_location: window.location.pathname,
});
```

## Verification

Use these tools to verify GTM is working:

- **Google Tag Assistant**: Chrome extension for debugging GTM
- **GTM Preview Mode**: In GTM dashboard, use Preview to test before publishing
- **Browser DevTools**: Check Network tab for GTM requests

## Notes

- GTM loads with `strategy="afterInteractive"` for optimal performance
- The noscript fallback ensures tracking works even with JavaScript disabled
- All GTM configuration is managed in the GTM dashboard, not in code
