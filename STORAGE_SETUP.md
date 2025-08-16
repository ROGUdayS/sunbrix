# Supabase Storage Setup for Images

This guide explains how to set up Supabase storage for managing project images in your Sunbrix lander application.

## Prerequisites

1. **Supabase Project**: You need an active Supabase project
2. **Environment Variables**: Configure your Supabase credentials

## Environment Variables

Create or update your `.env.local` file with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Installation

Install the required dependencies:

```bash
npm install
```

## Setting Up Storage

### 1. Create Storage Bucket

The script will automatically create a `project-images` bucket if it doesn't exist. This bucket will be:
- Public (accessible without authentication)
- Configured for image files (JPEG, PNG, WebP)
- Limited to 5MB file size

### 2. Upload Current Images

Run the upload script to move your current images to Supabase storage:

```bash
npm run upload-images
```

This will:
- Upload all images from `public/images/` to Supabase
- Create a `general/` folder for main website images
- Generate public URLs for each image
- Save the URLs to `public/uploaded-images.json`

### 3. Update Image References

After uploading, update your code to use the Supabase URLs instead of local paths:

```tsx
// Before (local images)
<Image src="/images/HomeHeroWebImage.webp" alt="Hero" />

// After (Supabase URLs)
<Image src="https://your-project.supabase.co/storage/v1/object/public/project-images/general/HomeHeroWebImage.webp" alt="Hero" />
```

## Storage Structure

```
project-images/
├── general/           # Main website images
│   ├── HomeHeroWebImage.webp
│   ├── how-it-works.webp
│   └── motions-background.webp
└── projects/          # Project-specific images (created dynamically)
    ├── project-id-1/
    │   ├── image1.jpg
    │   └── image2.jpg
    └── project-id-2/
        └── image1.jpg
```

## API Functions

The storage utility provides several functions:

### Upload Images
```typescript
import { uploadProjectImage } from '@/lib/storage'

const result = await uploadProjectImage(file, projectId)
if (result.url) {
  // Image uploaded successfully
  console.log('Image URL:', result.url)
}
```

### Delete Images
```typescript
import { deleteProjectImage } from '@/lib/storage'

const result = await deleteProjectImage(imageUrl)
if (result.success) {
  // Image deleted successfully
}
```

### Get Project Images
```typescript
import { getProjectImages } from '@/lib/storage'

const result = await getProjectImages(projectId)
if (result.images) {
  // Use result.images array
}
```

### Validate Files
```typescript
import { validateImageFile } from '@/lib/storage'

const validation = validateImageFile(file)
if (validation.valid) {
  // File is valid for upload
} else {
  console.error(validation.error)
}
```

## Security Considerations

1. **Public Access**: The bucket is public for read access
2. **File Validation**: Only image files are allowed
3. **Size Limits**: Files are limited to 5MB
4. **Authentication**: Upload/delete operations require proper authentication

## Troubleshooting

### Common Issues

1. **Bucket Creation Failed**
   - Check your Supabase service role key
   - Ensure you have storage permissions

2. **Upload Failed**
   - Verify file size is under 5MB
   - Check file format (JPEG, PNG, WebP only)
   - Ensure environment variables are correct

3. **Images Not Loading**
   - Check if the bucket is public
   - Verify the image URLs are correct
   - Check browser console for CORS errors

### Debug Commands

```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY

# Test Supabase connection
npm run upload-images
```

## Next Steps

1. **Dashboard Integration**: Connect the dashboard to use Supabase storage
2. **Image Optimization**: Implement image transformations and caching
3. **CDN Setup**: Configure a CDN for better performance
4. **Backup Strategy**: Implement regular backups of your image assets

## Support

For issues related to:
- **Supabase**: Check the [Supabase documentation](https://supabase.com/docs)
- **Storage**: Review the [Storage API docs](https://supabase.com/docs/reference/javascript/storage-createbucket)
- **Authentication**: See [Auth documentation](https://supabase.com/docs/guides/auth)
