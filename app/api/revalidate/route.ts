import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag, revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { secret, type, path } = body

    // Verify secret to prevent unauthorized revalidation
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
    }

    // Revalidate based on type
    switch (type) {
      case 'projects':
        revalidateTag('projects')
        revalidatePath('/api/projects')
        revalidatePath('/projects')
        revalidatePath('/') // Home page also uses projects
        break
      case 'packages':
        revalidateTag('packages')
        revalidatePath('/api/packages')
        revalidatePath('/') // Home page uses packages
        break
      case 'cities':
        revalidateTag('cities')
        revalidatePath('/api/cities')
        break
      case 'testimonials':
        revalidateTag('testimonials')
        revalidatePath('/api/content/testimonials')
        revalidatePath('/testimonials')
        revalidatePath('/') // Home page uses testimonials
        break
      case 'content':
      case 'main-page':
        revalidateTag('content')
        revalidateTag('main-page')
        revalidatePath('/api/content/main-page')
        revalidatePath('/') // Home page uses main page content
        break
      case 'all':
        // Revalidate everything
        revalidateTag('projects')
        revalidateTag('packages')
        revalidateTag('cities')
        revalidateTag('testimonials')
        revalidateTag('content')
        revalidateTag('main-page')
        revalidatePath('/api/projects')
        revalidatePath('/api/packages')
        revalidatePath('/api/cities')
        revalidatePath('/api/content/testimonials')
        revalidatePath('/api/content/main-page')
        revalidatePath('/projects')
        revalidatePath('/testimonials')
        revalidatePath('/')
        break
      default:
        if (path) {
          revalidatePath(path)
        }
    }

    return NextResponse.json({ 
      revalidated: true, 
      type,
      timestamp: new Date().toISOString() 
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { message: 'Error revalidating' },
      { status: 500 }
    )
  }
}