
// Demo Data (Fallback when Database is not connected)

export const mockFarmers = [
    {
        _id: '1',
        name: 'Ram Singh',
        village: 'Rampur',
        farmingMethod: 'Organic Farming',
        experience: '15 Years',
        bio: 'Expert in organic wheat farming.',
        image: '/images/ram_singh.jpg'
    },
    {
        _id: '2',
        name: 'Sita Devi',
        village: 'Manali',
        farmingMethod: 'Natural Farming',
        experience: '8 Years',
        bio: 'Specializes in fresh hill vegetables.',
        image: '/images/sita_devi.jpg'
    },
    {
        _id: '3',
        name: 'Gopal Krishna Dairy',
        village: 'Karnal',
        farmingMethod: 'Traditional Bilona',
        experience: '30 Years',
        bio: 'Pure A2 Cow Ghee producer.',
        image: '/images/gopal_dairy.png'
    }
];

export const mockProducts = [
    {
        _id: '101',
        name: 'Veg Thali',
        price: 150,
        image: '/images/veg_thali.jpg',
        description: 'Complete meal with Roti, Seasonal Sabzi, Dal, and Rice.',
        category: 'Food Items',
        stock: 100,
        source: 'Cloud Kitchen',
        rating: 4.8,
        farmer: '1',
        reviews: []
    },
    {
        _id: '102',
        name: 'Dal - Chawal / Roti',
        price: 80,
        image: '/images/dal_chawal.jpg',
        description: 'Simple and comforting home-style Dal with Rice or Roti.',
        category: 'Food Items',
        stock: 100,
        rating: 4.5,
        farmer: '1',
        reviews: []
    },
    {
        _id: '103',
        name: 'Seasonal Sabzi',
        price: 60,
        image: '/images/seasonal_sabzi.jpg',
        description: 'Fresh seasonal vegetable preparation.',
        category: 'Food Items',
        stock: 50,
        source: 'Farm Fresh',
        isSeasonal: true,
        rating: 4.7,
        farmer: '2',
        reviews: []
    },
    {
        _id: '104',
        name: 'Paneer Butter Masala',
        price: 220,
        image: '/images/pbm_special.jpg',
        description: 'Rich and creamy paneer curry.',
        category: 'Food Items',
        stock: 40,
        source: 'Cloud Kitchen',
        rating: 4.9,
        farmer: '3',
        reviews: []
    },
    {
        _id: '105',
        name: 'Masala Dosa',
        price: 120,
        image: '/images/masala_dosa_final.jpg',
        description: 'Crispy South Indian crepe served with chutneys and sambar.',
        category: 'Food Items',
        stock: 60,
        rating: 4.8,
        farmer: '1',
        reviews: []
    },
    {
        _id: '106',
        name: 'Veg Burger',
        price: 90,
        image: '/images/veg_burger.jpg',
        description: 'Classic vegetable burger with fries.',
        category: 'Food Items',
        stock: 80,
        source: 'Cloud Kitchen',
        rating: 4.3,
        farmer: '2',
        reviews: []
    },
    {
        _id: '107',
        name: 'Veg Pizza',
        price: 250,
        image: '/images/veg_pizza.jpg',
        description: 'Fresh dough pizza with seasonal toppings.',
        category: 'Food Items',
        stock: 50,
        source: 'Cloud Kitchen',
        rating: 4.6,
        farmer: '2',
        reviews: []
    },
    {
        _id: '108',
        name: 'Steamed Momos (8pcs)',
        price: 80,
        image: '/images/steamed_momos.jpg',
        description: 'Hot steamed vegetable dumplings served with spicy chutney.',
        category: 'Food Items',
        stock: 60,
        source: 'Cloud Kitchen',
        rating: 4.5,
        farmer: '2',
        reviews: []
    },
    {
        _id: '109',
        name: 'Village Style Veg Momos',
        price: 150,
        image: '/images/village_veg_momos.png',
        description: 'Authentic village-style momos prepared with hand-chopped farm-fresh vegetables.',
        category: 'Healthy & Special Food',
        stock: 40,
        source: 'Home Made',
        isSeasonal: false,
        rating: 4.9,
        farmer: '2',
        reviews: []
    },
    {
        _id: '110',
        name: 'Dal Makhani (Village Style)',
        price: 180,
        image: '/images/dal_makhani_village.jpg',
        description: 'Creamy slow-cooked black lentils prepared in traditional clay pots.',
        category: 'Food Items',
        stock: 45,
        source: 'Home Made',
        rating: 5.0,
        farmer: '1',
        reviews: []
    }
];
