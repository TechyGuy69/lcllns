
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

/**
 * Static, hardcoded dataset to prevent hydration mismatches.
 * Contains exactly 125 Tourist Favorites and 125 Hidden Gems.
 * Coordinates are distributed across India to avoid collinearity (the 'diagonal line' issue).
 */
export const MOCK_PLACES: Place[] = [
  // 1-125: Tourist Favorites (Popular)
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
    id: 4,
    name: "Hawa Mahal Viewpoint",
    city: "Jaipur",
    category: "Historic",
    lat: 26.9239,
    lng: 75.8267,
    rating: 4.5,
    reviewCount: 4100,
    tags: ["popular", "tourist"],
    crowdLevel: "High",
    description: "The 'Palace of Winds' with its unique five-story exterior, designed to allow royal ladies to observe street life.",
    image: "https://picsum.photos/seed/4/600/400"
  },
  {
    id: 5,
    name: "Cubbon Park Central",
    city: "Bangalore",
    category: "Park",
    lat: 12.9733,
    lng: 77.5921,
    rating: 4.4,
    reviewCount: 2900,
    tags: ["popular", "tourist"],
    crowdLevel: "High",
    description: "The lung of Bangalore, this vast green space is perfect for morning walks and colonial-era architecture.",
    image: "https://picsum.photos/seed/5/600/400"
  },
  {
    id: 6,
    name: "Marina Beach Promenade",
    city: "Chennai",
    category: "Beach",
    lat: 13.0418,
    lng: 80.2824,
    rating: 4.3,
    reviewCount: 6000,
    tags: ["popular", "tourist"],
    crowdLevel: "High",
    description: "The longest natural urban beach in India, bustling with local food stalls and evening crowds.",
    image: "https://picsum.photos/seed/6/600/400"
  },
  {
    id: 7,
    name: "Charminar Heritage Hub",
    city: "Hyderabad",
    category: "Historic",
    lat: 17.3616,
    lng: 78.4747,
    rating: 4.6,
    reviewCount: 4800,
    tags: ["popular", "tourist"],
    crowdLevel: "High",
    description: "A 16th-century mosque and monument located in the heart of Hyderabad's old city.",
    image: "https://picsum.photos/seed/7/600/400"
  },
  {
    id: 8,
    name: "Baga Beach Street",
    city: "Goa",
    category: "Beach",
    lat: 15.5553,
    lng: 73.7517,
    rating: 4.2,
    reviewCount: 5500,
    tags: ["popular", "tourist"],
    crowdLevel: "High",
    description: "Famous for its nightlife, water sports, and beach shacks, Baga is the pulse of North Goa.",
    image: "https://picsum.photos/seed/8/600/400"
  },
  {
    id: 9,
    name: "Dashashwamedh Ghat",
    city: "Varanasi",
    category: "Historic",
    lat: 25.3069,
    lng: 83.0102,
    rating: 4.9,
    reviewCount: 7000,
    tags: ["popular", "tourist"],
    crowdLevel: "High",
    description: "The main ghat in Varanasi, famous for the spectacular Ganga Aarti ceremony held every evening.",
    image: "https://picsum.photos/seed/9/600/400"
  },
  {
    id: 10,
    name: "Virupaksha Temple Plaza",
    city: "Hampi",
    category: "Historic",
    lat: 15.3350,
    lng: 76.4590,
    rating: 4.8,
    reviewCount: 3200,
    tags: ["popular", "tourist"],
    crowdLevel: "High",
    description: "One of the oldest functional temples in India, located amidst the stunning ruins of Hampi.",
    image: "https://picsum.photos/seed/10/600/400"
  },
  // Generated Tourist Places with diverse coordinates
  ...Array.from({ length: 115 }, (_, i) => ({
    id: i + 11,
    name: `Popular ${["Garden", "Museum", "Landmark", "Palace", "Sanctuary"][i % 5]} ${i + 11}`,
    city: ["Mumbai", "Delhi", "Kolkata", "Jaipur", "Bangalore", "Chennai", "Hyderabad", "Goa", "Varanasi", "Hampi"][i % 10],
    category: ["Park", "Historic", "Nature", "Beach", "Historic"][i % 5],
    lat: 12 + ((i * 17) % 15),
    lng: 72 + ((i * 13) % 20),
    rating: 4.4,
    reviewCount: 1200 + i,
    tags: ["popular", "tourist"],
    crowdLevel: "High" as CrowdLevel,
    description: "A bustling destination that captures the vibrant spirit of modern and traditional India.",
    image: `https://picsum.photos/seed/${i + 11}/600/400`
  })),

  // 126-250: Hidden Gems
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
  },
  {
    id: 128,
    name: "Riverside Bamboo Trail",
    city: "Hampi",
    category: "Nature",
    lat: 15.3400,
    lng: 76.4700,
    rating: 4.8,
    reviewCount: 28,
    tags: ["hidden", "local", "peaceful"],
    crowdLevel: "Low",
    description: "A serene path along the Tungabhadra river away from the main temple complexes.",
    image: "https://picsum.photos/seed/128/600/400"
  },
  {
    id: 129,
    name: "Forgotten Spice Lane",
    city: "Kolkata",
    category: "Historic",
    lat: 22.5800,
    lng: 88.3500,
    rating: 4.6,
    reviewCount: 56,
    tags: ["hidden", "local", "peaceful"],
    crowdLevel: "Low",
    description: "An atmospheric alleyway where the smell of cardamom and dry chillies lingers in the air.",
    image: "https://picsum.photos/seed/129/600/400"
  },
  {
    id: 130,
    name: "Blue Lagoon Backwaters",
    city: "Goa",
    category: "Nature",
    lat: 15.3500,
    lng: 74.1500,
    rating: 4.9,
    reviewCount: 15,
    tags: ["hidden", "local", "peaceful"],
    crowdLevel: "Low",
    description: "A crystal clear lagoon surrounded by coconut groves, far from the tourist beaches.",
    image: "https://picsum.photos/seed/130/600/400"
  },
  // Generated Hidden Gems with diverse coordinates
  ...Array.from({ length: 120 }, (_, i) => ({
    id: i + 131,
    name: `Quiet ${["Retreat", "Corner", "Nook", "Trail", "Sanctuary"][i % 5]} ${i + 131}`,
    city: ["Mumbai", "Delhi", "Kolkata", "Jaipur", "Bangalore", "Chennai", "Hyderabad", "Goa", "Varanasi", "Hampi"][i % 10],
    category: ["Nature", "Cafe", "Historic", "Park", "Nature"][i % 5],
    lat: 15 + ((i * 11) % 15),
    lng: 75 + ((i * 7) % 20),
    rating: 4.5,
    reviewCount: 10 + i,
    tags: ["hidden", "local", "peaceful"],
    crowdLevel: "Low" as CrowdLevel,
    description: "A peaceful sanctuary that offers a quiet escape from the city's hustle and bustle.",
    image: `https://picsum.photos/seed/${i + 131}/600/400`
  }))
];
