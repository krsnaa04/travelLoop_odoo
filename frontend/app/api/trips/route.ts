import { mockData } from '@/lib/mock-data';
import { NextRequest, NextResponse } from 'next/server';

// Filter trips to upcoming and planning
function getUpcomingTrips() {
  return mockData.plannedTrips
    .filter((trip) => ['planning', 'upcoming'].includes(trip.status))
    .map((trip) => ({
      id: trip.id,
      title: trip.title,
      description: trip.shortDescription,
      destination: trip.destination,
      country: trip.country,
      startDate: trip.startDate,
      endDate: trip.endDate,
      budget: trip.budget,
      coverImageUrl: trip.coverImage,
      currencyCode: trip.currency,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const trips = getUpcomingTrips();

    return NextResponse.json(
      {
        data: trips,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch trips', details: (error as Error).message },
      { status: 500 },
    );
  }
}
