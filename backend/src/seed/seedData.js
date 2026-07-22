import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User, Restaurant, FoodItem, Order } from '../models/index.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zomato_clone';

// Authentic Indian Restaurants Names
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

// Indian Cities & Suburbs
const locations = [
  "Connaught Place, New Delhi", "Indiranagar, Bengaluru", "Bandra West, Mumbai", "Gachibowli, Hyderabad", 
  "Salt Lake Sector 5, Kolkata", "Nungambakkam, Chennai", "Koregaon Park, Pune", "Hazratganj, Lucknow", 
  "C-Scheme, Jaipur", "Vastrapur, Ahmedabad"
];

// Unsplash Images for Indian Restaurants
const restaurantImages = [
  "https://images.unsplash.com/photo-1585938338392-50a59970d8ee?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=800&auto=format&fit=crop&q=60"
];

// Master list of 58 Indian dishes
const masterDishes = [
  // 1. Starters (Veg)
  { name: "Paneer Tikka", description: "Soft cottage cheese chunks marinated in yogurt and spices, grilled in a tandoor.", category: "Starters", isVeg: true, basePrice: 220, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=60" },
  { name: "Veg Seekh Kebab", description: "Minced mixed vegetables mixed with aromatic spices, skewered and cooked over coal.", category: "Starters", isVeg: true, basePrice: 190, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=60" },
  { name: "Samosa (2 Pcs)", description: "Crispy fried pastry filled with savory spiced potato and peas mixture.", category: "Starters", isVeg: true, basePrice: 40, image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=400&q=60" },
  { name: "Spring Roll", description: "Thin wrappers stuffed with seasoned crunchy vegetables, fried until golden.", category: "Starters", isVeg: true, basePrice: 120, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=60" },
  { name: "Gobi Manchurian", description: "Crispy cauliflower florets tossed in a sweet, sour, and hot Manchurian sauce.", category: "Starters", isVeg: true, basePrice: 160, image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400&q=60" },
  { name: "Chilli Paneer", description: "Paneer cubes tossed with bell peppers, onions, and hot green chillies in soy sauce.", category: "Starters", isVeg: true, basePrice: 200, image: "https://images.unsplash.com/photo-1603073163308-9654c3fb70b5?w=400&q=60" },
  { name: "Hara Bhara Kebab", description: "Patties made of spinach, green peas, and potatoes seasoned with spices.", category: "Starters", isVeg: true, basePrice: 170, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=60" },
  { name: "Onion Bhaji", description: "Crispy onion fritters prepared with gram flour and simple spices.", category: "Starters", isVeg: true, basePrice: 90, image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=400&q=60" },
  { name: "Aloo Tikki Chaat", description: "Crispy potato patties topped with sweet yogurt, tamarind chutney, and green chutney.", category: "Starters", isVeg: true, basePrice: 80, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=60" },

  // 2. Starters (Non-Veg)
  { name: "Chicken Tikka", description: "Tender chicken pieces marinated in hot spices and yogurt, grilled to perfection.", category: "Starters", isVeg: false, basePrice: 280, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=60" },
  { name: "Malai Chicken Tikka", description: "Mouth-melting chicken tikka marinated with cream, cheese, cardamom, and white pepper.", category: "Starters", isVeg: false, basePrice: 295, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=60" },
  { name: "Chicken Seekh Kebab", description: "Skewered minced spiced chicken grilled over tandoor charcoal.", category: "Starters", isVeg: false, basePrice: 270, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=60" },
  { name: "Tandoori Chicken (Half)", description: "Classic tandoor bone-in chicken marinated in house special red spices and yogurt.", category: "Starters", isVeg: false, basePrice: 320, image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=400&q=60" },
  { name: "Chilli Chicken Dry", description: "Stir fried batter-coated chicken pieces tossed with green chillies and bell peppers.", category: "Starters", isVeg: false, basePrice: 260, image: "https://images.unsplash.com/photo-1626200419199-391ae4cd7a40?w=400&q=60" },
  { name: "Fish Tikka", description: "Succulent fish cubes marinated in mustard and carom seeds, skewered and baked.", category: "Starters", isVeg: false, basePrice: 350, image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=60" },

  // 3. Main Course (Veg)
  { name: "Dal Makhani", description: "Black lentils slow-cooked overnight with tomatoes, butter, and rich cream.", category: "Veg Main Course", isVeg: true, basePrice: 240, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=60" },
  { name: "Dal Tadka", description: "Yellow lentils tempered with cumin seeds, garlic, onions, tomatoes, and red chillies.", category: "Veg Main Course", isVeg: true, basePrice: 180, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=60" },
  { name: "Paneer Butter Masala", description: "Cottage cheese cubes cooked in a sweet, velvety tomato gravy with loads of butter.", category: "Veg Main Course", isVeg: true, basePrice: 260, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=60" },
  { name: "Kadhai Paneer", description: "Cottage cheese stir-fried with onions, bell peppers, and fresh ground kadhai spices.", category: "Veg Main Course", isVeg: true, basePrice: 270, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=60" },
  { name: "Shahi Paneer", description: "Rich royal paneer dish prepared in a creamy onion-cashew paste gravy.", category: "Veg Main Course", isVeg: true, basePrice: 280, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=60" },
  { name: "Mix Vegetables", description: "A combination of seasonal fresh vegetables tossed in a spicy onion tomato masala.", category: "Veg Main Course", isVeg: true, basePrice: 190, image: "https://images.unsplash.com/photo-1585938338392-50a59970d8ee?w=400&q=60" },
  { name: "Chana Masala", description: "Kabuli chickpeas simmered in a tangy and highly spiced ginger-garlic gravy.", category: "Veg Main Course", isVeg: true, basePrice: 170, image: "https://images.unsplash.com/photo-1585938338392-50a59970d8ee?w=400&q=60" },
  { name: "Malai Kofta", description: "Paneer potato dumplings stuffed with dry fruits, served in a rich cashew gravy.", category: "Veg Main Course", isVeg: true, basePrice: 290, image: "https://images.unsplash.com/photo-1585938338392-50a59970d8ee?w=400&q=60" },
  { name: "Aloo Gobi Adraki", description: "Potatoes and cauliflower florets sautéed with shredded ginger and mild spices.", category: "Veg Main Course", isVeg: true, basePrice: 160, image: "https://images.unsplash.com/photo-1585938338392-50a59970d8ee?w=400&q=60" },
  { name: "Bhindi Masala", description: "Ladyfinger (okra) pieces stir-fried with onions, tomatoes, and spices.", category: "Veg Main Course", isVeg: true, basePrice: 150, image: "https://images.unsplash.com/photo-1585938338392-50a59970d8ee?w=400&q=60" },
  { name: "Baingan Bharta", description: "Tandoor roasted eggplants mashed and cooked with garlic, peas, tomatoes, and onions.", category: "Veg Main Course", isVeg: true, basePrice: 170, image: "https://images.unsplash.com/photo-1585938338392-50a59970d8ee?w=400&q=60" },

  // 4. Main Course (Non-Veg)
  { name: "Butter Chicken", description: "Tandoori chicken shreds cooked in a classic silky butter, tomato, and cream sauce.", category: "Non-Veg Main Course", isVeg: false, basePrice: 340, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=60" },
  { name: "Kadhai Chicken", description: "Chicken cooked in a spicy red gravy with bell peppers and freshly ground spices.", category: "Non-Veg Main Course", isVeg: false, basePrice: 320, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=60" },
  { name: "Home Style Chicken Curry", description: "Simple chicken pieces simmered in onion-tomato broth flavored with cardamoms.", category: "Non-Veg Main Course", isVeg: false, basePrice: 290, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=60" },
  { name: "Mutton Rogan Josh", description: "Kashmiri style mutton curry cooked with ginger, garlic, and special red spices.", category: "Non-Veg Main Course", isVeg: false, basePrice: 420, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=60" },
  { name: "Chicken Korma", description: "A rich and fragrant chicken dish cooked in yogurt, nut paste, and saffron.", category: "Non-Veg Main Course", isVeg: false, basePrice: 310, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=60" },
  { name: "Fish Curry", description: "Fish fillets cooked in a coastal coconut gravy with tamarind sour notes.", category: "Non-Veg Main Course", isVeg: false, basePrice: 360, image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=60" },
  { name: "Dhaba Egg Curry", description: "Boiled fried eggs simmered in a highly spiced dhaba style onion gravy.", category: "Non-Veg Main Course", isVeg: false, basePrice: 190, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=60" },

  // 5. Rice & Breads
  { name: "Plain Naan", description: "Leavened refined flour flatbread baked inside hot clay oven.", category: "Rice & Breads", isVeg: true, basePrice: 40, image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=400&q=60" },
  { name: "Butter Naan", description: "Clay oven flatbread brushed liberally with fresh butter.", category: "Rice & Breads", isVeg: true, basePrice: 50, image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=400&q=60" },
  { name: "Garlic Naan", description: "Leavened clay oven bread topped with minced garlic and butter.", category: "Rice & Breads", isVeg: true, basePrice: 65, image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=400&q=60" },
  { name: "Tandoori Roti", description: "Whole wheat rustic flatbread baked inside tandoor oven.", category: "Rice & Breads", isVeg: true, basePrice: 20, image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=400&q=60" },
  { name: "Butter Roti", description: "Whole wheat clay oven bread topped with butter.", category: "Rice & Breads", isVeg: true, basePrice: 25, image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=400&q=60" },
  { name: "Lachha Paratha", description: "Multi-layered flaky tandoor paratha baked with wheat flour.", category: "Rice & Breads", isVeg: true, basePrice: 45, image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=400&q=60" },
  { name: "Steamed Rice", description: "Premium long grain steamed Basmati rice.", category: "Rice & Breads", isVeg: true, basePrice: 90, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=60" },
  { name: "Jeera Rice", description: "Basmati rice tempered with ghee, cumin seeds, and green coriander.", category: "Rice & Breads", isVeg: true, basePrice: 110, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=60" },
  { name: "Hyderabadi Veg Biryani", description: "Layered basmati rice and vegetables cooked under 'Dum' steam with saffron.", category: "Rice & Breads", isVeg: true, basePrice: 220, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=60" },
  { name: "Special Chicken Biryani", description: "Fragrant rice cooked with chicken pieces, saffron, and special spices.", category: "Rice & Breads", isVeg: false, basePrice: 290, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=60" },
  { name: "Egg Biryani", description: "Spiced basmati rice layered with masala boiled eggs.", category: "Rice & Breads", isVeg: false, basePrice: 240, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=60" },
  { name: "Royal Mutton Biryani", description: "Tender goat mutton pieces slow cooked with basmati rice and spices.", category: "Rice & Breads", isVeg: false, basePrice: 390, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=60" },

  // 6. Desserts
  { name: "Gulab Jamun (2 Pcs)", description: "Deep-fried milk dumplings soaked in sticky rose-flavored cardamom syrup.", category: "Desserts", isVeg: true, basePrice: 60, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=60" },
  { name: "Rasgulla (2 Pcs)", description: "Soft spongy cottage cheese balls cooked in light sugar syrup.", category: "Desserts", isVeg: true, basePrice: 50, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=60" },
  { name: "Kesar Rasmalai (2 Pcs)", description: "Cottage cheese discs soaked in saffron milk flavored with pistachios.", category: "Desserts", isVeg: true, basePrice: 80, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=60" },
  { name: "Special Gajar Halwa", description: "Slow-cooked grated carrots cooked with ghee, milk, sugar, and dried khoya.", category: "Desserts", isVeg: true, basePrice: 90, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=60" },
  { name: "Rabdi Kheer", description: "Thickened milk rice pudding topped with almonds and cashews.", category: "Desserts", isVeg: true, basePrice: 70, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=60" },
  { name: "Badam Pista Kulfi", description: "Traditional Indian dense ice cream made with condensed milk and saffron.", category: "Desserts", isVeg: true, basePrice: 60, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=60" },
  { name: "Hot Jalebi (100g)", description: "Crispy fried fermented batter spirals dipped in sugar syrup.", category: "Desserts", isVeg: true, basePrice: 60, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=60" },
  { name: "Shahi Tukda", description: "Golden fried bread slices soaked in saffron rabdi cream sauce.", category: "Desserts", isVeg: true, basePrice: 90, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=60" },

  // 7. Beverages
  { name: "Masala Chai", description: "Brewed milk tea infused with cardamom, ginger, cloves, and black pepper.", category: "Beverages", isVeg: true, basePrice: 30, image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&q=60" },
  { name: "Mango Lassi", description: "Creamy yogurt drink blended with sweet Alphonso mango pulp.", category: "Beverages", isVeg: true, basePrice: 80, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=60" },
  { name: "Sweet Lassi", description: "Chilled thick yogurt drink whisked with sugar and rose water syrup.", category: "Beverages", isVeg: true, basePrice: 70, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=60" },
  { name: "Salted Lassi", description: "Savory chilled yogurt drink flavored with black salt and cumin powder.", category: "Beverages", isVeg: true, basePrice: 65, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=60" },
  { name: "Chilled Jaljeera", description: "Spicy and tangy lemonade flavored with fresh mint, cumin, and rock salt.", category: "Beverages", isVeg: true, basePrice: 40, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=60" },
  { name: "Spiced Chaas", description: "Thin salted buttermilk flavored with coriander, ginger, and curry leaves.", category: "Beverages", isVeg: true, basePrice: 40, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=60" },
  { name: "Cold Coffee", description: "Thick chilled coffee blended with milk, ice cream, and chocolate syrup.", category: "Beverages", isVeg: true, basePrice: 90, image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&q=60" },
  { name: "Soft Drink", description: "Chilled carbonated beverage (330ml can).", category: "Beverages", isVeg: true, basePrice: 40, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=60" }
];

// Helper to shuffle array elements
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const seedData = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await mongoose.connect(MONGODB_URI);
    console.log('Database connected.');

    // Clear collections
    console.log('Clearing existing collections...');
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await FoodItem.deleteMany({});
    await Order.deleteMany({});
    console.log('Collections cleared.');

    // Create users
    console.log('Creating demo users...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const users = await User.insertMany([
      {
        name: 'Demo Customer',
        email: 'demo@example.com',
        password: hashedPassword,
        role: 'customer',
        addresses: ['12 Ring Road, Lajpat Nagar, New Delhi, DL 110024', 'Sector 15, Indiranagar, Bengaluru, KA 560038'],
      },
      {
        name: 'Demo Partner',
        email: 'partner@example.com',
        password: hashedPassword,
        role: 'partner',
        addresses: ['B-40, DLF Phase 3, Gurugram, HR 122002'],
      },
      {
        name: 'Demo Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        addresses: ['Shastri Bhawan, Rajpath, New Delhi, DL 110001'],
      },
    ]);

    const partner = users[1];
    console.log('Users created successfully.');

    // Generate 50 Restaurants
    console.log('Generating 50 Indian restaurants...');
    const restaurantDocs = [];

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
    
    for (let i = 0; i < 50; i++) {
      const name = restaurantNames[i];
      const city = locations[i % locations.length];
      const image = restaurantImages[i % restaurantImages.length];
      
      // Determine cuisines based on name indicators
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

      // Proximity Jitter (around city centers)
      const baseCoords = cityCoordinates[city] || { lat: 20.5937, lon: 78.9629 };
      const lat = baseCoords.lat + (Math.random() - 0.5) * 0.03;
      const lon = baseCoords.lon + (Math.random() - 0.5) * 0.03;

      restaurantDocs.push({
        name,
        image,
        cuisine,
        rating: parseFloat((4.0 + Math.random() * 0.9).toFixed(1)), // Rating between 4.0 and 4.9
        deliveryTime: Math.round(15 + Math.random() * 30), // Time between 15 and 45 mins
        costForTwo: Math.round(200 + Math.random() * 800), // Cost between ₹200 and ₹1000
        address: `${10 + i}, Main Market Road, ${city}`,
        coordinates: { lat, lon },
        isFeatured: Math.random() < 0.2, // 20% featured
        partner: partner._id,
      });
    }

    const seededRestaurants = await Restaurant.insertMany(restaurantDocs);
    console.log(`${seededRestaurants.length} Restaurants seeded successfully.`);

    // Generate 50 Dishes per Restaurant from master list of 58 items
    console.log('Generating ~50 dishes per restaurant...');
    const foodItemDocs = [];

    for (const rest of seededRestaurants) {
      // Shuffle the master list of 58 dishes and take exactly 50
      const shuffledDishes = shuffleArray(masterDishes).slice(0, 50);

      for (const dish of shuffledDishes) {
        // Add random price variation (+/- ₹10 to ₹50)
        const priceOffset = Math.round((Math.random() - 0.5) * 60);
        const finalPrice = Math.max(20, Math.round((dish.basePrice + priceOffset) / 10) * 10); // round to nearest 10, min ₹20

        // Determine special flags programmatically
        const isBestselling = Math.random() < 0.15; // 15% bestselling
        const isTopRated = Math.random() < 0.15; // 15% top-rated
        const isTodaysSpecial = Math.random() < 0.1; // 10% today's special

        foodItemDocs.push({
          name: dish.name,
          description: dish.description,
          price: finalPrice,
          image: dish.image,
          category: dish.category,
          isVeg: dish.isVeg,
          restaurant: rest._id,
          isBestselling,
          isTopRated,
          isTodaysSpecial,
        });
      }
    }

    console.log(`Writing ${foodItemDocs.length} food items to database...`);
    // Insert in batches of 500 to keep it efficient
    const batchSize = 500;
    for (let i = 0; i < foodItemDocs.length; i += batchSize) {
      const batch = foodItemDocs.slice(i, i + batchSize);
      await FoodItem.insertMany(batch);
    }
    
    console.log(`${foodItemDocs.length} Food items seeded successfully.`);
    console.log('Database seeding completely successful!');

    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed with error: ', error);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

seedData();
