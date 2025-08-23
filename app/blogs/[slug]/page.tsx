// Fetch blog post data server-side for SEO
async function getBlogPost(slug: string) {
  try {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://sunbrix.com' 
      : 'http://localhost:3003';
      
    const response = await fetch(`${baseUrl}/api/content/blogs/${slug}`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const blogPost = await getBlogPost(params.slug);

  if (!blogPost) {
    return {
      title: 'Blog Post Not Found | Sunbrix',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: blogPost.metaTitle || `${blogPost.title} | Sunbrix`,
    description: blogPost.metaDescription || blogPost.excerpt,
    keywords: blogPost.tags.join(', '),
    authors: [{ name: blogPost.author }],
    openGraph: {
      title: blogPost.title,
      description: blogPost.excerpt,
      type: 'article',
      publishedTime: blogPost.date,
      authors: [blogPost.author],
      images: [
        {
          url: blogPost.image || '/images/blog-placeholder.jpg',
          width: 1200,
          height: 630,
          alt: blogPost.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: blogPost.title,
      description: blogPost.excerpt,
      images: [blogPost.image || '/images/blog-placeholder.jpg'],
    },
    alternates: {
      canonical: `/blogs/${params.slug}`,
    },
  };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  return <BlogPostClient slug={params.slug} />;