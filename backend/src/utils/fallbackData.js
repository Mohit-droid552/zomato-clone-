// Fallback Indian Restaurants & Dishes Generator for Graceful Degradation

const restaurantNames = [
  "Biryani By Kilo", "Karim's Mughlai", "Peshawri Grill", "Moti Mahal Deluxe", "Sagar Ratna",
  "Saravana Bhavan", "Punjab Grill", "Chowringhee Kathi Rolls", "Haldiram's", "Bikanervala",
  "Paradise Biryani", "Farzi Cafe", "Social", "Barbeque Nation", "Pind Balluchi",
  "Rajdhani Thali", "Khandani Rajdhani", "Chili's India", "Nathu's Sweets", "Giani's Ice Cream",
  "Ananda Bhavan", "The Dosa Factory", "Kailash Parbat", "Shree Mithai", "Adyar Ananda Bhavan",
  "Sabyasachi Flavors", "Royal Punjab", "Kebab Khan", "Tunday Kababi", "Al Bake",
  "Amritsari Kulcha Land", "Wah Ji Wah", "Chaat Bistro", "Dawat-e-Khas", "Sardarji Bukhara",
  "Delhi Heights", "Connaught Club", "The Yellow Chilli", "Copper Chimney", "Zaffran",
  "Dhaba Estd 1986", "Dum Pukht", "Bukhara", "Spice Route", "Dakshin",
  "Indian Accent", "Gung The Palace", "Oh! Calcutta", "Mainland China", "Sigree Global Grill"
];

const locations = [
  "Connaught Place, New Delhi", "Indiranagar, Bengaluru", "Bandra West, Mumbai", "Gachibowli, Hyderabad", 
  "Salt Lake Sector 5, Kolkata", "Nungambakkam, Chennai", "Koregaon Park, Pune", "Hazratganj, Lucknow", 
  "C-Scheme, Jaipur", "Vastrapur, Ahmedabad"
];

const restaurantImages = [
  "https://images.unsplash.com/photo-1585938338392-50a59970d8ee?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=60"
];

const masterDishes = [
  { _id: "f1", name: "Paneer Butter Masala", description: "Cottage cheese cubes cooked in a sweet, velvety tomato gravy with butter.", price: 260, category: "Veg Main Course", isVeg: true, isBestselling: true, isTopRated: true, isTodaysSpecial: false, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=60" },
  { _id: "f2", name: "Butter Chicken", description: "Tandoori chicken shreds cooked in a classic silky butter and tomato sauce.", price: 340, category: "Non-Veg Main Course", isVeg: false, isBestselling: true, isTopRated: true, isTodaysSpecial: true, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=60" },
  { _id: "f3", name: "Dal Makhani", description: "Black lentils slow-cooked overnight with butter and fresh cream.", price: 240, category: "Veg Main Course", isVeg: true, isBestselling: true, isTopRated: false, isTodaysSpecial: false, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=60" },
  { _id: "f4", name: "Garlic Naan", description: "Leavened clay oven bread topped with minced garlic and butter.", price: 65, category: "Rice & Breads", isVeg: true, isBestselling: true, isTopRated: true, isTodaysSpecial: false, image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=400&q=60" },
  { _id: "f5", name: "Special Chicken Biryani", description: "Fragrant basmati rice cooked with chicken pieces, saffron, and spices.", price: 290, category: "Rice & Breads", isVeg: false, isBestselling: true, isTopRated: true, isTodaysSpecial: true, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=60" },
  { _id: "f6", name: "Paneer Tikka", description: "Soft cottage cheese marinated in yogurt and spices, grilled in a tandoor.", price: 220, category: "Starters", isVeg: true, isBestselling: false, isTopRated: true, isTodaysSpecial: true, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=60" },
  { _id: "f7", name: "Gulab Jamun (2 Pcs)", description: "Classic fried milk solid dumplings soaked in cardamom sugar syrup.", price: 90, category: "Desserts", isVeg: true, isBestselling: true, isTopRated: true, isTodaysSpecial: false, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=60" },
  { _id: "f8", name: "Mango Lassi", description: "Creamy yogurt drink blended with sweet Alphonso mango pulp.", price: 80, category: "Beverages", isVeg: true, isBestselling: true, isTopRated: false, isTodaysSpecial: true, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=60" }
];

const cityCoordinates = {
  "Connaught Place, New Delhi": { lat: 28.6139, lon: 77.2090 },
  "Indiranagar, Bengaluru": { lat: 12.9716, lon: 77.5946 },
  "Bandra West, Mumbai": { lat: 19.0760, lon: 72.8777 },
  "Gachibowli, Hyderabad": { lat: 17.3850, lon: 78.4867 },
  "Salt Lake Sector 5, Kolkata": { lat: 22.5726, lon: 88.3639 },
  "Nungambakkam, Chennai": { lat: 13.0827, lon: 80.2707 },
  "Koregaon Park, Pune": { lat: 18.5204, lon: 73.8567 },
  "Hazratganj, Lucknow": { lat: 26.8467, lon: 80.9462 },
  "C-Scheme, Jaipur": { lat: 26.9124, lon: 75.7873 },
  "Vastrapur, Ahmedabad": { lat: 23.0225, lon: 72.5714 }
};

export const getFallbackRestaurants = () => {
  return restaurantNames.map((name, i) => {
    const city = locations[i % locations.length];
    const image = restaurantImages[i % restaurantImages.length];
    const baseCoords = cityCoordinates[city] || { lat: 20.5937, lon: 78.9629 };
    
    let cuisine = ['North Indian', 'Mughlai'];
    if (name.includes('Dosa') || name.includes('Bhavan') || name.includes('Dakshin')) {
      cuisine = ['South Indian', 'Pure Veg', 'Breakfast'];
    } else if (name.includes('Chaat') || name.includes('Wah') || name.includes('Rolls')) {
      cuisine = ['Street Food', 'Fast Food', 'Snacks'];
    } else if (name.includes('Sweet') || name.includes('Mithai') || name.includes('Ice Cream')) {
      cuisine = ['Desserts', 'Sweets', 'Bakery'];
    } else if (name.includes('China') || name.includes('Heights') || name.includes('Social') || name.includes('Cafe')) {
      cuisine = ['Continental', 'Asian', 'Fast Food'];
    }

    return {
      _id: `rest_${i + 1}`,
      name,
      image,
      cuisine,
      rating: parseFloat((4.0 + (i % 9) * 0.1).toFixed(1)),
      deliveryTime: 20 + (i % 25),
      costForTwo: 300 + (i % 6) * 100,
      address: `${10 + i}, Main Market Road, ${city}`,
      coordinates: {
        lat: baseCoords.lat + (i % 3) * 0.005,
        lon: baseCoords.lon + (i % 3) * 0.005
      },
      isFeatured: i % 4 === 0
    };
  });
};

export const getFallbackFoodItems = (restaurantId) => {
  return masterDishes.map((dish) => ({
    ...dish,
    restaurant: restaurantId || 'rest_1'
  }));
};
