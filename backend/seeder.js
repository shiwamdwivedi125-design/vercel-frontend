const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Farmer = require('./models/Farmer');
const User = require('./models/User');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    try {
        // Clear existing data (optional, but good for clean start)
        await Product.deleteMany({});
        await Farmer.deleteMany({});
        await User.deleteMany({}); // Clear users to ensure clean slate

        const createdUsers = await User.insertMany([
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: '123456', // User model will hash this in pre('save')
                role: 'admin',
            },
            {
                name: 'Test User',
                email: 'user@example.com',
                password: '123456', // User model will hash this in pre('save')
            }
        ]);

        console.log('Users Seeded');

        const adminUser = createdUsers[0]._id;

        // Create Farmers
        const farmers = await Farmer.insertMany([
            {
                name: 'Ram Singh',
                village: 'Rampur',
                farmingMethod: 'Organic Farming',
                experience: '15 Years',
                bio: 'Expert in organic wheat farming.',
                image: '/images/ram_singh.jpg'
            },
            {
                name: 'Sita Devi',
                village: 'Manali',
                farmingMethod: 'Natural Farming',
                experience: '8 Years',
                bio: 'Specializes in fresh hill vegetables.',
                image: '/images/sita_devi.jpg'
            },
            {
                name: 'Gopal Krishna Dairy',
                village: 'Karnal',
                farmingMethod: 'Traditional Bilona',
                experience: '30 Years',
                bio: 'Pure A2 Cow Ghee producer.',
                image: '/images/gopal_dairy.jpg'
            }
        ]);

        console.log('Farmers Seeded');

        // Create Products
        const products = [
            // Food Items
            {
                name: 'Veg Thali',
                price: 150,
                image: '/images/veg_thali.jpg',
                farmer: farmers[0]._id,
                description: 'Complete meal with Roti, Seasonal Sabzi, Dal, and Rice.',
                category: 'Food Items',
                stock: 100,
                source: 'Cloud Kitchen',
                ingredients: ['Rice', 'Dal', 'Wheat Flour', 'Seasonal Vegetables', 'Spices'],
                nutrition: { calories: 650, protein: 18, fats: 12, carbs: 85 },
                availabilityTime: 'Lunch',
                isCombo: true
            },
            {
                name: 'Dal - Chawal / Roti',
                price: 80,
                image: '/images/dal_chawal.jpg',
                farmer: farmers[0]._id,
                description: 'Simple and comforting home-style Dal with Rice or Roti.',
                category: 'Food Items',
                stock: 100
            },
            {
                name: 'Seasonal Sabzi',
                price: 60,
                image: '/images/seasonal_sabzi.jpg',
                farmer: farmers[1]._id,
                description: 'Fresh seasonal vegetable preparation.',
                category: 'Food Items',
                stock: 50,
                source: 'Farm Fresh',
                isSeasonal: true,
                ingredients: ['Fresh Mixed Vegetables', 'Mustard Oil', 'Spices'],
                nutrition: { calories: 150, protein: 4, fats: 8, carbs: 12 }
            },
            {
                name: 'Paneer Butter Masala',
                price: 220,
                image: '/images/pbm_special.jpg',
                farmer: farmers[2]._id,
                description: 'Rich and creamy paneer curry.',
                category: 'Food Items',
                stock: 40,
                source: 'Cloud Kitchen',
                ingredients: ['Paneer', 'Butter', 'Cream', 'Tomatoes', 'Cashews'],
                nutrition: { calories: 450, protein: 14, fats: 35, carbs: 15 },
                customization: {
                    spiceLevel: true,
                    jainOption: true,
                    addOns: [
                        { name: 'Extra Butter', price: 20 },
                        { name: 'Extra Paneer', price: 50 }
                    ]
                },
                recipeUrl: 'https://www.youtube.com/embed/S_vLshN7vG4'
            },
            {
                name: 'Masala Dosa',
                price: 120,
                image: '/images/masala_dosa_final.jpg',
                farmer: farmers[0]._id,
                description: 'Crispy South Indian crepe served with chutneys and sambar.',
                category: 'Food Items',
                stock: 60,
                recipeUrl: 'https://www.youtube.com/embed/gxsMs_IuFlU'
            },
            {
                name: 'Veg Burger',
                price: 90,
                image: '/images/veg_burger.jpg',
                farmer: farmers[1]._id,
                description: 'Classic vegetable burger with fries.',
                category: 'Food Items',
                stock: 80,
                source: 'Cloud Kitchen',
                ingredients: ['Bun', 'Veg Patty', 'Lettuce', 'Tomato', 'Sauce'],
                nutrition: { calories: 400, protein: 10, fats: 15, carbs: 50 },
                customization: {
                    addOns: [
                        { name: 'Extra Cheese', price: 30 },
                        { name: 'Double Patty', price: 60 }
                    ]
                }
            },
            {
                name: 'Veg Pizza',
                price: 250,
                image: '/images/veg_pizza.jpg',
                farmer: farmers[1]._id,
                description: 'Fresh dough pizza with seasonal toppings.',
                category: 'Food Items',
                stock: 50,
                source: 'Cloud Kitchen',
                ingredients: ['Flour', 'Cheese', 'Tomato Sauce', 'Capsicum', 'Corn'],
                nutrition: { calories: 600, protein: 18, fats: 22, carbs: 70 },
                customization: {
                    addOns: [
                        { name: 'Extra Cheese', price: 40 },
                        { name: 'Mushroom Topping', price: 30 }
                    ]
                }
            },
            {
                name: 'Steamed Momos (8pcs)',
                price: 80,
                image: '/images/steamed_momos.jpg',
                farmer: farmers[1]._id,
                description: 'Hot steamed vegetable dumplings served with spicy chutney.',
                category: 'Food Items',
                stock: 60,
                source: 'Cloud Kitchen',
                ingredients: ['Flour', 'Cabbage', 'Carrot', 'Onion', 'Ginger'],
                nutrition: { calories: 300, protein: 8, fats: 5, carbs: 45 },
                customization: {
                    addOns: [
                        { name: 'Fried Option', price: 20 },
                        { name: 'Cheese Dip', price: 15 }
                    ]
                },
                recipeUrl: 'https://www.youtube.com/embed/kR2vK_p-40Y'
            },
            {
                name: 'Village Style Veg Momos',
                price: 150,
                image: '/images/village_veg_momos.png',
                farmer: farmers[1]._id,
                description: 'Authentic village-style momos prepared with hand-chopped farm-fresh vegetables and steamed to perfection in bamboo baskets.',
                category: 'Healthy & Special Food',
                stock: 40,
                source: 'Home Made',
                ingredients: ['Organic Wheat Flour', 'Farm Cabbage', 'Carrots', 'Garlic', 'Green Chilies'],
                nutrition: { calories: 250, protein: 7, fats: 3, carbs: 40 },
                recipeUrl: 'https://www.youtube.com/embed/kR2vK_p-40Y',
                isSeasonal: false,
                rewardPoints: 15
            },
            {
                name: 'Idli Sambar',
                price: 70,
                image: '/images/idli_sambar.jpg',
                farmer: farmers[0]._id,
                description: 'Soft fluffy steamed rice cakes with lentil soup.',
                category: 'Food Items',
                stock: 100,
                source: 'Cloud Kitchen',
                ingredients: ['Rice batter', 'Urad Dal', 'Drumstick', 'Spices'],
                nutrition: { calories: 200, protein: 8, fats: 2, carbs: 40 },
                recipeUrl: 'https://www.youtube.com/embed/qS54_j0Y69M'
            },
            {
                name: 'Dal Makhani (Village Style)',
                price: 180,
                image: '/images/dal_makhani_village.jpg',
                farmer: farmers[0]._id,
                description: 'Creamy slow-cooked black lentils prepared in traditional clay pots.',
                category: 'Food Items',
                stock: 45,
                source: 'Home Made',
                ingredients: ['Black Lentils', 'Butter', 'Cream', 'Whole Spices'],
                nutrition: { calories: 350, protein: 12, fats: 22, carbs: 28 },
                recipeUrl: 'https://www.youtube.com/embed/m7N8lJzFvR0',
                rewardPoints: 10
            },

            // Healthy & Special Food
            {
                name: 'Green Salad',
                price: 80,
                image: '/images/green_salad.jpg',
                farmer: farmers[1]._id,
                description: 'Fresh mix of lettuce, cucumber, and tomatoes.',
                category: 'Healthy & Special Food',
                stock: 30
            },
            {
                name: 'Diet Meal Box',
                price: 200,
                image: '/images/diet_meal_box.jpg',
                farmer: farmers[1]._id,
                description: 'Low-calorie nutritious meal for fitness enthusiasts.',
                category: 'Healthy & Special Food',
                stock: 20
            },

            // Sweets & Bakery
            {
                name: 'Gulab Jamun (2 pcs)',
                price: 50,
                image: '/images/gulab_jamun_final.png',
                farmer: farmers[2]._id,
                description: 'Soft and sweet traditional Indian dessert.',
                category: 'Sweets & Bakery',
                stock: 100,
                source: 'Home Made',
                ingredients: ['Khoa', 'Sugar', 'Ghee', 'Cardamom', 'Flour'],
                nutrition: { calories: 350, protein: 6, fats: 14, carbs: 55 },
                recipeUrl: 'https://www.youtube.com/embed/8kbeTzG8eY0'
            },
            {
                name: 'Authentic Spring Rolls',
                price: 120,
                image: '/images/spring_rolls_village.jpg',
                farmer: farmers[1]._id,
                description: 'Crispy rolls filled with hand-picked farm-fresh vegetables.',
                category: 'Healthy & Special Food',
                stock: 50,
                source: 'Home Made',
                ingredients: ['Spring Roll Sheets', 'Cabbage', 'Carrot', 'Spring Onion'],
                nutrition: { calories: 180, protein: 5, fats: 8, carbs: 22 },
                recipeUrl: 'https://www.youtube.com/embed/U90wX3m_H6Q',
                rewardPoints: 8
            },
            {
                name: 'Chocolate Cake',
                price: 450,
                image: '/images/chocolate_cake.jpg',
                farmer: farmers[2]._id,
                description: 'Rich chocolate sponge cake.',
                category: 'Sweets & Bakery',
                stock: 10
            },

            // Beverages
            {
                name: 'Masala Chai',
                price: 20,
                image: '/images/masala_chai.jpg',
                farmer: farmers[0]._id,
                description: 'Authentic Indian spiced tea.',
                category: 'Beverages',
                stock: 200
            },
            {
                name: 'Mango Lassi',
                price: 60,
                image: '/images/mango_lassi.jpg',
                farmer: farmers[2]._id,
                description: 'Sweet and refreshing yogurt drink with mango pulp.',
                category: 'Beverages',
                stock: 50,
                source: 'Cloud Kitchen',
                ingredients: ['Yogurt', 'Mango Pulp', 'Sugar', 'Dry Fruits'],
                nutrition: { calories: 250, protein: 6, fats: 8, carbs: 35 }
            },
            {
                name: 'Chocolate Milkshake',
                price: 90,
                image: '/images/chocolate_milkshake.jpg',
                farmer: farmers[2]._id,
                description: 'Rich and creamy chocolate shake.',
                category: 'Beverages',
                stock: 40,
                source: 'Cloud Kitchen',
                ingredients: ['Milk', 'Cocoa Powder', 'Sugar', 'Ice Cream'],
                nutrition: { calories: 350, protein: 9, fats: 12, carbs: 45 }
            },

            // Tiffin & Meal Services
            {
                name: 'Daily Tiffin Service',
                price: 3000,
                image: '/images/tiffin_service.jpg',
                farmer: farmers[0]._id,
                description: 'Monthly subscription for daily lunch tiffin.',
                category: 'Tiffin & Meal Services',
                stock: 50
            },

            // Other Services
            {
                name: 'Party Order (Min 20 plates)',
                price: 5000,
                image: '/images/party_order.jpg',
                farmer: farmers[0]._id,
                description: 'Bulk food order for parties and events.',
                category: 'Other Services',
                stock: 5
            }
        ];

        await Product.insertMany(products);
        console.log('Products Seeded');

        process.exit();
    } catch (error) {
        console.error('Error with data import', error);
        process.exit(1);
    }
};

seedData();
