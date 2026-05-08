
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

const CITIES = ["Mumbai", "Delhi", "Kolkata", "Jaipur", "Bangalore", "Chennai", "Hyderabad", "Goa", "Varanasi", "Hampi"];
const CATEGORIES = ["Cafe", "Park", "Historic", "Beach", "Nature"];

const CITY_COORDS: Record<string, { lat: number, lng: number }> = {
  "Mumbai": { lat: 19.0760, lng: 72.8777 },
  "Delhi": { lat: 28.6139, lng: 77.2090 },
  "Kolkata": { lat: 22.5726, lng: 88.3639 },
  "Jaipur": { lat: 26.9124, lng: 75.7873 },
  "Bangalore": { lat: 12.9716, lng: 77.5946 },
  "Chennai": { lat: 13.0827, lng: 80.2707 },
  "Hyderabad": { lat: 17.3850, lng: 78.4867 },
  "Goa": { lat: 15.2993, lng: 74.1240 },
  "Varanasi": { lat: 25.3176, lng: 82.9739 },
  "Hampi": { lat: 15.3350, lng: 76.4600 }
};

const generatePlaces = (): Place[] => {
  const places: Place[] = [];
  
  // Generate 125 Tourist Places
  for (let i = 1; i <= 125; i++) {
    const city = CITIES[i % CITIES.length];
    const category = CATEGORIES[i % CATEGORIES.length];
    const coords = CITY_COORDS[city];
    
    places.push({
      id: i,
      name: `${city} ${category} Hub`,
      city: city,
      category: category,
      lat: coords.lat + (Math.random() - 0.5) * 0.1,
      lng: coords.lng + (Math.random() - 0.5) * 0.1,
      rating: parseFloat((4.2 + Math.random() * 0.8).toFixed(1)),
      reviewCount: 800 + Math.floor(Math.random() * 5000),
      tags: ["popular", "tourist"],
      crowdLevel: "High",
      description: `A highly-rated ${category.toLowerCase()} in the heart of ${city}, famous among tourists for its vibrant energy and world-class heritage.`,
      image: `https://picsum.photos/seed/${i}/600/400`
    });
  }
  
  // Generate 125 Hidden Gems
  for (let i = 126; i <= 250; i++) {
    const city = CITIES[i % CITIES.length];
    const category = CATEGORIES[i % CATEGORIES.length];
    const coords = CITY_COORDS[city];
    
    places.push({
      id: i,
      name: `Quiet ${city} ${category} Corner`,
      city: city,
      category: category,
      lat: coords.lat + (Math.random() - 0.5) * 0.1,
      lng: coords.lng + (Math.random() - 0.5) * 0.1,
      rating: parseFloat((4.0 + Math.random() * 1.0).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 299),
      tags: ["hidden", "local", "peaceful"],
      crowdLevel: "Low",
      description: `A peaceful and quiet ${category.toLowerCase()} tucked away in ${city}. This local gem offers a serene escape from the crowds.`,
      image: `https://picsum.photos/seed/${i}/600/400`
    });
  }
  
  return places;
};

export const MOCK_PLACES: Place[] = generatePlaces();
