export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pickupLng = searchParams.get('pickupLng');
  const pickupLat = searchParams.get('pickupLat');
  const deliveryLng = searchParams.get('deliveryLng');
  const deliveryLat = searchParams.get('deliveryLat');

  if (!pickupLng || !pickupLat || !deliveryLng || !deliveryLat) {
    return Response.json({ error: 'Missing coordinates' }, { status: 400 });
  }

  try {
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${pickupLng},${pickupLat};${deliveryLng},${deliveryLat}?overview=full&geometries=geojson`;

    const response = await fetch(osrmUrl);

    if (!response.ok) {
      throw new Error(`OSRM error: ${response.status}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Route calculation error:', error);
    return Response.json({ error: 'Route calculation failed' }, { status: 500 });
  }
}
