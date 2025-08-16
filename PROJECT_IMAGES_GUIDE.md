# Project Images Organization Guide

This guide explains how images are organized in Supabase storage to correspond with your projects.

## 🏗️ Storage Structure

Images are organized by project ID in Supabase storage:

```
project-images/
├── rajendras-residence/
│   ├── HomeHeroWebImage.webp
│   ├── how-it-works.webp
│   └── motions-background.webp
├── shailendras-residence/
│   ├── HomeHeroWebImage.webp
│   ├── how-it-works.webp
│   └── motions-background.webp
├── itishrees-residence/
│   ├── HomeHeroWebImage.webp
│   ├── how-it-works.webp
│   └── motions-background.webp
└── ... (other projects)
```

## 📁 Current Project Structure

Your projects currently have these images:

| Project ID              | Project Title              | Location    | Current Images |
| ----------------------- | -------------------------- | ----------- | -------------- |
| `rajendras-residence`   | Mr. Rajendra's Residence   | Indore      | 3 images       |
| `shailendras-residence` | Mr. Shailendra's Residence | Indore      | 4 images       |
| `itishrees-residence`   | Mrs. Itishree's Residence  | Bhubaneswar | 3 images       |
| `srishtis-residence`    | Mrs. Srishti's Residence   | Bengaluru   | 4 images       |
| `rajbeers-residence`    | Mr. Rajbeer's Residence    | Bhubaneswar | 3 images       |
| `sanjays-residence`     | Mr. Sanjay's Residence     | Indore      | 3 images       |

## 🚀 Upload Process

### 1. Set Up Environment Variables

Create `.env.local` with your Supabase credentials (see `ENV_SETUP.md`):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 2. Upload Project Images

Run the project-specific upload script:

```bash
npm run upload-project-images
```

This will:

- Create a `project-images` bucket in Supabase
- Upload images for each project to their respective folders
- Generate public URLs for each image
- Create updated project data with Supabase URLs

### 3. Update Your Projects Data

After upload, you'll get:

- `uploaded-project-images.json` - Detailed upload results
- `projects-with-supabase-urls.json` - Updated projects data with Supabase URLs

## 🔄 Image Management

### Adding New Projects

1. Add project to `data/projects.json`
2. Place project images in `public/images/projects/[project-id]/`
3. Run `npm run upload-project-images` to upload new images

### Updating Existing Projects

1. Replace images in `public/images/projects/[project-id]/`
2. Run upload script to update Supabase storage
3. Update project data with new image URLs

### Deleting Projects

1. Remove project from `data/projects.json`
2. Manually delete project folder from Supabase storage
3. Update any references in your code

## 📱 Frontend Integration

### Before (Local Images)

```tsx
<Image src="/images/HomeHeroWebImage.webp" alt="Project Image" />
```

### After (Supabase URLs)

```tsx
<Image
  src="https://your-project.supabase.co/storage/v1/object/public/project-images/rajendras-residence/HomeHeroWebImage.webp"
  alt="Project Image"
/>
```

### Dynamic Image Loading

```tsx
// Load images for a specific project
const { images, error } = await getProjectImages(projectId);

if (images) {
  images.forEach((imageUrl) => {
    // Use imageUrl in your component
  });
}
```

## 🎯 Benefits of This Organization

1. **Project-Specific**: Each project has its own image collection
2. **Scalable**: Easy to add new projects and images
3. **Organized**: Clear folder structure in Supabase
4. **CDN Optimized**: Images served from Supabase's global CDN
5. **Version Control**: Track image changes per project
6. **Performance**: Faster image loading and better caching

## 🔧 Storage Functions

The storage utility provides these functions:

```typescript
// Upload image for a specific project
uploadProjectImage(file, projectId);

// Get all images for a project
getProjectImages(projectId);

// Delete project image
deleteProjectImage(imageUrl);

// Validate image files
validateImageFile(file);
```

## 📊 Monitoring and Analytics

- **Storage Usage**: Monitor in Supabase dashboard
- **Image Access**: Track image views and downloads
- **Performance**: Monitor CDN performance metrics
- **Costs**: Track storage and bandwidth usage

## 🚨 Important Notes

- **Image Limits**: Max 5MB per image
- **File Types**: JPEG, PNG, WebP only
- **Naming**: Use descriptive filenames for better organization
- **Backup**: Keep local copies of important images
- **CDN**: Images are cached globally for better performance

## 🔍 Troubleshooting

### Common Issues

1. **Upload Failed**: Check file size and format
2. **Images Not Loading**: Verify Supabase URLs and bucket permissions
3. **Permission Denied**: Check service role key permissions
4. **Bucket Not Found**: Ensure bucket creation was successful

### Debug Commands

```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY

# Test upload script
npm run upload-project-images

# Check generated files
ls -la public/uploaded-project-images.json
ls -la data/projects-with-supabase-urls.json
```

## 📚 Next Steps

1. **Set up Supabase credentials** (see `ENV_SETUP.md`)
2. **Run the upload script** to organize images by project
3. **Update your code** to use Supabase URLs
4. **Test your website** to ensure images load correctly
5. **Monitor performance** and optimize as needed
