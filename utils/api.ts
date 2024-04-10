interface LocationResponse {
  city: {
    name: string;
    names: Record<string, string>;
  };
  continent: {
    code: string;
    geoname_id: number;
    name: string;
    names: Record<string, string>;
  };
  state: {
    name: string;
  };
  country: {
    name: string;
  };
}

export async function fetchGeolocation(
  apiKey: string
): Promise<LocationResponse> {
  const res = await fetch(
    `https://api.geoapify.com/v1/ipinfo?&apiKey=${apiKey}`,
    { method: "GET" }
  );

  if (!res.ok) throw new Error("Failed to fetch geolocation");
  return (await res.json()) as LocationResponse;
}
