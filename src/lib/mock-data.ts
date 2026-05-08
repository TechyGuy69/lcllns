
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
 * Deterministic generation of 250 places.
 * 125 Tourist Favorites (High rating, high reviews, high crowd)
 * 125 Hidden Gems (Low reviews, low crowd, peaceful tags)
 */
const generatePlaces = (): Place[] => {
  const places: Place[] = [];

  // 1-125: Tourist Favorites (including ~25 Cafes and ~25 Restaurants)
  for (let i = 0; i < 125; i++) {
    const id = i + 1;
    const cityName = CITIES[i % CITIES.length];
    const base = CITY_COORDS[cityName as keyof typeof CITY_COORDS];
    const offsetLat = Math.sin(id * 1.5) * 0.035;
    const offsetLng = Math.cos(id * 1.5) * 0.035;

    const categories = ["Historic", "Cafe", "Restaurant", "Park", "Historic"];
    const names = ["Palace", "Bistro", "Kitchen", "Gardens", "Fort"];
    const category = categories[i % 5];
    const namePrefix = names[i % 5];

    places.push({
      id,
      name: `Grand ${namePrefix} ${id}`,
      city: cityName,
      category: category,
      lat: base.lat + offsetLat,
      lng: base.lng + offsetLng,
      rating: Number((4.2 + (id % 8) * 0.1).toFixed(1)),
      reviewCount: 850 + (id * 15) % 5000,
      tags: ["popular", "tourist"],
      crowdLevel: "High",
      description: `A legendary ${category.toLowerCase()} that has become a cornerstone of ${cityName}'s vibrant culture, known for its iconic status and high energy.`,
      image: `https://picsum.photos/seed/${id}/600/400`
    });
  }

  // 126-250: Hidden Gems (including ~25 Cafes and ~25 Restaurants)
  for (let i = 0; i < 125; i++) {
    const id = i + 126;
    const cityName = CITIES[i % CITIES.length];
    const base = CITY_COORDS[cityName as keyof typeof CITY_COORDS];
    const offsetLat = Math.sin(id * 2.1) * 0.05;
    const offsetLng = Math.cos(id * 2.1) * 0.05;

    const categories = ["Nature", "Cafe", "Restaurant", "Historic", "Nature"];
    const names = ["Retreat", "Nook", "Table", "Library", "Trail"];
    const category = categories[i % 5];
    const namePrefix = names[i % 5];

    places.push({
      id,
      name: `Secret ${namePrefix} ${id}`,
      city: cityName,
      category: category,
      lat: base.lat + offsetLat,
      lng: base.lng + offsetLng,
      rating: Number((4.0 + (id % 10) * 0.1).toFixed(1)),
      reviewCount: 15 + (id % 250),
      tags: ["hidden", "local", "peaceful"],
      crowdLevel: "Low",
      description: `Tucked away in the quiet corners of ${cityName}, this ${category.toLowerCase()} is a local secret offering an authentic, peaceful escape from the city rush.`,
      image: `https://picsum.photos/seed/${id}/600/400`
    });
  }

  return places;
};

// Real-world samples to ground the dataset in authenticity
const REAL_SAMPLES: Place[] = [
  // POPULAR CAFES/RESTAURANTS
  {
    id: 1,
    name: "Leopold Cafe & Bar",
    city: "Mumbai",
    category: "Cafe",
    lat: 18.9229,
    lng: 72.8317,
    rating: 4.4,
    reviewCount: 12400,
    tags: ["popular", "tourist"],
    crowdLevel: "High",
    description: "An iconic multi-cuisine restaurant and bar in Colaba, famous for its history and bustling atmosphere.",
    image: "https://picsum.photos/seed/1/600/400"
  },
  {
    id: 2,
    name: "Indian Coffee House",
    city: "Kolkata",
    category: "Cafe",
    lat: 22.5756,
    lng: 88.3630,
    rating: 4.2,
    reviewCount: 9800,
    tags: ["popular", "tourist"],
    crowdLevel: "High",
    description: "A historic intellectual hub on College Street, known for its old-world charm and 'Adda' culture.",
    image: "https://picsum.photos/seed/2/600/400"
  },
  {
    id: 3,
    name: "Karim's Hotel",
    city: "Delhi",
    category: "Restaurant",
    lat: 28.6496,
    lng: 77.2335,
    rating: 4.5,
    reviewCount: 15600,
    tags: ["popular", "tourist"],
    crowdLevel: "High",
    description: "World-famous Mughlai restaurant located near Jama Masjid, serving legendary kebabs since 1913.",
    image: "https://picsum.photos/seed/3/600/400"
  },
  {
    id: 4,
    name: "Koshy's Parade Cafe",
    city: "Bangalore",
    category: "Cafe",
    lat: 12.9750,
    lng: 77.6000,
    rating: 4.3,
    reviewCount: 5400,
    tags: ["popular", "tourist"],
    crowdLevel: "High",
    description: "A beloved Bangalore institution on St. Marks Road, frequented by artists, writers, and journalists.",
    image: "https://picsum.photos/seed/4/600/400"
  },
  {
    id: 5,
    name: "Amethyst Cafe",
    city: "Chennai",
    category: "Cafe",
    lat: 13.0510,
    lng: 80.2540,
    rating: 4.6,
    reviewCount: 3200,
    tags: ["popular", "tourist"],
    crowdLevel: "High",
    description: "A stunning garden cafe set in a restored colonial mansion, offering a sophisticated escape in the city.",
    image: "https://picsum.photos/seed/5/600/400"
  },

  // HIDDEN CAFES/RESTAURANTS
  {
    id: 126,
    name: "The Artisanal Bakehouse",
    city: "Goa",
    category: "Cafe",
    lat: 15.4909,
    lng: 73.8278,
    rating: 4.7,
    reviewCount: 142,
    tags: ["hidden", "local", "peaceful"],
    crowdLevel: "Low",
    description: "A quiet, family-run bakery hidden in a traditional Goan house, serving the freshest sourdough and poi.",
    image: "https://picsum.photos/seed/126/600/400"
  },
  {
    id: 127,
    name: "Zen Garden Cafe",
    city: "Jaipur",
    category: "Cafe",
    lat: 26.8900,
    lng: 75.8100,
    rating: 4.8,
    reviewCount: 88,
    tags: ["hidden", "local", "peaceful"],
    crowdLevel: "Low",
    description: "A peaceful sanctuary tucked behind a textile workshop, offering organic teas and local heritage snacks.",
    image: "https://picsum.photos/seed/127/600/400"
  },
  {
    id: 128,
    name: "The Old Banyan Cafe",
    city: "Mumbai",
    category: "Cafe",
    lat: 19.0500,
    lng: 72.8400,
    rating: 4.6,
    reviewCount: 210,
    tags: ["hidden", "local", "peaceful"],
    crowdLevel: "Low",
    description: "A quiet courtyard cafe in Bandra, shaded by a massive banyan tree, serving artisanal coffee to locals.",
    image: "https://picsum.photos/seed/128/600/400"
  },
  {
    id: 129,
    name: "Saffron Courtyard",
    city: "Hyderabad",
    category: "Restaurant",
    lat: 17.4400,
    lng: 78.4300,
    rating: 4.5,
    reviewCount: 156,
    tags: ["hidden", "local", "peaceful"],
    crowdLevel: "Low",
    description: "A hidden gem serving traditional Deccani cuisine in a quiet residential bungalow courtyard.",
    image: "https://picsum.photos/seed/129/600/400"
  },
  {
    id: 130,
    name: "Mango Tree Riverside",
    city: "Hampi",
    category: "Restaurant",
    lat: 15.3400,
    lng: 76.4550,
    rating: 4.7,
    reviewCount: 280,
    tags: ["hidden", "local", "peaceful"],
    crowdLevel: "Low",
    description: "A serene spot overlooking the Tungabhadra river, offering authentic local meals under a canopy of trees.",
    image: "https://picsum.photos/seed/130/600/400"
  }
];

export const MOCK_PLACES: Place[] = generatePlaces().map(p => {
  const real = REAL_SAMPLES.find(r => r.id === p.id);
  return real ? real : p;
});
