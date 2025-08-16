import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const revalidate = 300; // Revalidate every 5 minutes
export const fetchCache = 'force-cache'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')

    // Build query conditions
    const where: Record<string, unknown> = {}
    
    if (active !== null) {
      where.active = active === 'true'
    }

    // Get all active cities
    const cities = await prisma.city.findMany({
      where,
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(cities, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'Cache-Tag': 'cities'
      }
    })

  } catch (error) {
    console.error('Error fetching cities:', error)
    
    // Fallback to static data if database fails
    try {
      const citiesData = await import('@/data/cities.json')
      return NextResponse.json(citiesData.default, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          'Cache-Tag': 'cities'
        }
      })
    } catch (fallbackError) {
      console.error('Fallback data also failed:', fallbackError)
      return NextResponse.json(
        { error: 'Failed to fetch cities' },
        { status: 500 }
      )
    }
  }
}