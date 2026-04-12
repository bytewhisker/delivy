export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 1) {
    return Response.json([]);
  }

  try {
    const searchQuery = query.includes('Dhaka') ? query : `${query}, Dhaka, Bangladesh`;
    const response = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery)}&limit=8&lang=en`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const results = data.features?.map((f: any) => ({
      name: f.properties.name || '',
      display_name: f.properties.name + (f.properties.city ? ', ' + f.properties.city : '') + (f.properties.country ? ', ' + f.properties.country : ''),
      lat: f.geometry.coordinates[1],
      lon: f.geometry.coordinates[0]
    })) || [];
    
    return Response.json(results);
  } catch (error) {
    console.error('Search error:', error);
    return Response.json({ error: 'Search failed' }, { status: 500 });
  }
}