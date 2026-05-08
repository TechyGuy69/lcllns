
export type CrowdLevel = 'Low' | 'Medium' | 'High';

export interface Place {
  id: number;
  name: string;
  city: string;
  category: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  crowdLevel: CrowdLevel;
  description: string;
  image: string;
}

const CITY_COORDS = {
  "Mumbai": { lat: 19.0760, lng: 72.8777 },
  "Delhi": { lat: 28.6139, lng: 77.2090 },
  "Kolkata": { lat: 22.5726, lng: 88.3639 },
  "Jaipur": { lat: 26.9124, lng: 75.7873 },
  "Bangalore": { lat: 12.9716, lng: 77.5946 },
  "Chennai": { lat: 13.0827, lng: 80.2707 },
  "Hyderabad": { lat: 17.3850, lng: 78.4867 },
  "Goa": { lat: 15.2993, lng: 74.1240 },
  "Varanasi": { lat: 25.3176, lng: 83.0062 },
  "Hampi": { lat: 15.3350, lng: 76.4600 }
};

const CITIES = Object.keys(CITY_COORDS);

/**
 * Deterministic generation of 250 places (125 Tourist, 125 Hidden Gems).
 * No Math.random() to ensure zero hydration mismatches.
 * Coordinates are precisely offset around real Indian city centers.
 */
const generatePlaces = (): Place[] => {
  const places: Place[] = [];

  // 1-125: Tourist Favorites
  for (let i = 0; i < 125; i++) {
    const id = i + 1;
    const cityName = CITIES[i % CITIES.length];
    const base = CITY_COORDS[cityName as keyof typeof CITY_COORDS];
    // Deterministic spread using trig functions
    const offsetLat = Math.sin(id * 1.5) * 0.035;
    const offsetLng = Math.cos(id * 1.5) * 0.035;

    places.push({
      id,
      name: `Popular ${["Palace", "Museum", "Temple", "Gardens", "Fort"][i % 5]} ${id}`,
      city: cityName,
      category: ["Historic", "Historic", "Historic", "Park", "Historic"][i % 5],
      lat: base.lat + offsetLat,
      lng: base.lng + offsetLng,
      rating: 4.2 + (id % 8) * 0.1,
      reviewCount: 850 + (id * 15) % 5000,
      tags: ["popular", "tourist"],
      crowdLevel: "High",
      description: "A world-renowned landmark attracting visitors with its grand architecture and rich historical significance.",
      image: `https://picsum.photos/seed/${id}/600/400`
    });
  }

  // 126-250: Hidden Gems
  for (let i = 0; i < 125; i++) {
    const id = i + 126;
    const cityName = CITIES[i % CITIES.length];
    const base = CITY_COORDS[cityName as keyof typeof CITY_COORDS];
    // Different deterministic spread for hidden gems
    const offsetLat = Math.sin(id * 2.1) * 0.05;
    const offsetLng = Math.cos(id * 2.1) * 0.05;

    places.push({
      id,
      name: `Quiet ${["Retreat", "Library", "Backwater", "Trail", "Courtyard"][i % 5]} ${id}`,
      city: cityName,
      category: ["Nature", "Historic", "Nature", "Nature", "Cafe"][i % 5],
      lat: base.lat + offsetLat,
      lng: base.lng + offsetLng,
      rating: 4.0 + (id % 10) * 0.1,
      reviewCount: 15 + (id % 250),
      tags: ["hidden", "local", "peaceful"],
      crowdLevel: "Low",
      description: "A serene hidden gem cherished by locals for its peaceful atmosphere and authentic charm, far from the tourist rush.",
      image: `https://picsum.photos/seed/${id}/600/400`
    });
  }

  return places;
};

// Hardcoded real examples for the first few slots to ensure quality
const REAL_SAMPLES: Place[] = [
  {
    id: 1,
    name: "Gateway of India Plaza",
    city: "Mumbai",
    category: "Historic",
    lat: 18.9220,
    lng: 72.8347,
    rating: 4.8,
    reviewCount: 4500,
    tags: ["popular", "tourist"],
    crowdLevel: "High",
    description: "The iconic arch monument overlooking the Arabian Sea, a must-visit for every traveler to Mumbai.",
    image: "https://picsum.photos/seed/1/600/400"
  },
  {
    id: 2,
    name: "Red Fort Heritage Park",
    city: "Delhi",
    category: "Historic",
    lat: 28.6562,
    lng: 77.2410,
    rating: 4.6,
    reviewCount: 5200,
    tags: ["popular", "tourist"],
    crowdLevel: "High",
    description: "A massive sandstone fort and a UNESCO World Heritage site representing the peak of Mughal architecture.",
    image: "https://picsum.photos/seed/2/600/400"
  },
  {
    id: 3,
    name: "Victoria Memorial Grounds",
    city: "Kolkata",
    category: "Historic",
    lat: 22.5448,
    lng: 88.3426,
    rating: 4.7,
    reviewCount: 3800,
    tags: ["popular", "tourist"],
    crowdLevel: "High",
    description: "A large marble building and museum, dedicated to the memory of Queen Victoria.",
    image: "https://picsum.photos/seed/3/600/400"
  },
  {
    id: 126,
    name: "The Old City Library",
    city: "Delhi",
    category: "Historic",
    lat: 28.6500,
    lng: 77.2300,
    rating: 4.7,
    reviewCount: 45,
    tags: ["hidden", "local", "peaceful"],
    crowdLevel: "Low",
    description: "A quiet, dusty sanctuary filled with rare colonial-era manuscripts and comfortable armchairs.",
    image: "https://picsum.photos/seed/126/600/400"
  },
  {
    id: 127,
    name: "Secret Garden Cafe",
    city: "Mumbai",
    category: "Cafe",
    lat: 19.0600,
    lng: 72.8500,
    rating: 4.5,
    reviewCount: 82,
    tags: ["hidden", "local", "peaceful"],
    crowdLevel: "Low",
    description: "Tucked away in a narrow lane, this cafe offers artisan coffee and a peaceful green courtyard.",
    image: "https://picsum.photos/seed/127/600/400"
  }
];

export const MOCK_PLACES: Place[] = generatePlaces().map(p => {
  const real = REAL_SAMPLES.find(r => r.id === p.id);
  return real ? real : p;
});
