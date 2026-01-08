import React from 'react';
import { FaClock, FaUserFriends, FaFireAlt, FaUtensils, FaPlayCircle } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const VideoPlayer = ({ videoUrl, title, className = "" }) => {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const { t } = useLanguage();

    // Extract video ID from embed URL
    const videoId = videoUrl.split('/').pop();
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    if (isPlaying) {
        return (
            <iframe
                className={`w-full h-full ${className}`}
                src={`${videoUrl}?autoplay=1`}
                title={title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        );
    }

    return (
        <div
            className={`w-full h-full relative cursor-pointer group/video overflow-hidden ${className}`}
            onClick={() => setIsPlaying(true)}
        >
            <img
                src={thumbnailUrl}
                alt={title}
                className="w-full h-full object-cover transform group-hover/video:scale-105 transition-transform duration-700"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                }}
            />
            <div className="absolute inset-0 bg-black/20 group-hover/video:bg-black/40 transition-colors flex items-center justify-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/90 rounded-full flex items-center justify-center pl-1 shadow-xl group-hover/video:scale-110 transition-transform duration-300">
                    <FaPlayCircle className="text-4xl md:text-5xl text-green-600 drop-shadow-md" />
                </div>
            </div>
            <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                {t('recipes.play')}
            </div>
        </div>
    );
};

const RecipesPage = () => {
    const { t } = useLanguage();
    const featuredRecipe = {
        id: 'momos-featured',
        title: "Street Style Veg Momos",
        chef: "Ranveer Brar",
        videoUrl: "https://www.youtube.com/embed/5B09gJSIZss",
        description: "Experience the ultimate street-style momos with Chef Ranveer Brar. Learn the secret ice-cube technique for juicy momos.",
        ingredients: ["Refined Flour", "Cabbage", "Carrot", "Soy Sauce", "Ginger-Garlic"],
        cookingTime: "40 mins",
        servings: "20 Pieces",
        difficulty: "Medium",
        calories: "280 kcal"
    };

    const otherRecipes = [
        {
            id: 1,
            title: "Traditional Masala Dosa",
            chef: "The Tiny Foods",
            videoUrl: "https://www.youtube.com/embed/gxsMs_IuFlU",
            description: "Learn the secrets of a perfect, crispy village-style Masala Dosa with the authentic potato filling.",
            ingredients: ["Rice", "Urad Dal", "Potatoes", "Curry Leaves", "Mustard Seeds"],
            cookingTime: "45 mins",
            servings: "4 People",
            difficulty: "Medium",
            calories: "320 kcal"
        },

        {
            id: 4,
            title: "Village Sarson Ka Saag",
            chef: "Village Cooking Channel",
            videoUrl: "https://www.youtube.com/embed/2sybMz2uxgM",
            description: "Experience the authentic way of cooking Sarson Ka Saag in the open fields. Pure, rustic, and full of flavor.",
            ingredients: ["Fresh Mustard Leaves", "Spinach", "Makki Atta", "White Butter"],
            cookingTime: "2 Hours",
            servings: "8 People",
            difficulty: "Medium",
            calories: "380 kcal"
        },



        {
            id: 10,
            title: "Mix Veg Curry Village Style",
            chef: "Village Food Secrets",
            videoUrl: "https://www.youtube.com/embed/xLBdZXCditg",
            description: "A healthy and delicious mix of fresh village vegetables cooked in an earthen pot.",
            ingredients: ["Fresh Vegetables", "Mustard Oil", "Village Spices", "Clay Pot Magic"],
            cookingTime: "45 mins",
            servings: "6 People",
            difficulty: "Medium",
            calories: "280 kcal"
        },

        {
            id: 11,
            title: "Village Style Baingan Bharta",
            chef: "Su's Food Corner",
            videoUrl: "https://www.youtube.com/embed/wSwTsc0eTrM",
            description: "Smoky roasted eggplant mashed with raw spices and mustard oil. A true rustic delight.",
            ingredients: ["Eggplant", "Mustard Oil", "Green Chili", "Garlic", "Raw Spices"],
            cookingTime: "30 mins",
            servings: "4 People",
            difficulty: "Easy",
            calories: "220 kcal"
        },
        {
            id: 12,
            title: "Authentic Chole Bhature",
            chef: "Village Handi Roti",
            videoUrl: "https://www.youtube.com/embed/4QSKllh3tyU",
            description: "Fluffy bhature paired with spicy, tangy chickpeas cooked in traditional village style.",
            ingredients: ["Chickpeas", "Maida", "Yogurt", "Village Masala", "Ghee"],
            cookingTime: "1 Hour",
            servings: "4 People",
            difficulty: "Hard",
            calories: "550 kcal"
        }
    ];

    return (
        <div className="bg-[#fcfaf7] min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <div className="text-center mb-20 space-y-4">
                    <div className="inline-block bg-green-100 text-green-800 text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-sm">
                        {t('recipes.tradition_badge')}
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-green-950 tracking-tighter">
                        {t('recipes.title_main')} <span className="text-green-600 italic">{t('recipes.title_italic')}</span>
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
                        {t('recipes.subtitle')}
                    </p>
                </div>

                {/* Featured Section */}
                <div className="bg-white rounded-[3.5rem] shadow-2xl overflow-hidden mb-24 border border-green-100 group">
                    <div className="flex flex-col lg:flex-row">
                        <div className="lg:w-3/5 aspect-video bg-black relative">
                            <VideoPlayer
                                videoUrl={featuredRecipe.videoUrl}
                                title={featuredRecipe.title}
                            />
                        </div>
                        <div className="lg:w-2/5 p-10 lg:p-14 flex flex-col justify-center space-y-8 bg-gradient-to-br from-white to-green-50/30">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">{t('recipes.featured_tag')}</span>
                                    <span className="text-green-600 flex items-center gap-1.5 font-bold text-sm uppercase tracking-tighter">
                                        <FaUtensils /> {t('recipes.recipe_by')} {featuredRecipe.chef}
                                    </span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black text-green-950 tracking-tighter leading-tight">
                                    {featuredRecipe.title}
                                </h2>
                                <p className="text-gray-600 text-lg leading-relaxed italic">
                                    "{featuredRecipe.description}"
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded-2xl border border-green-50 shadow-sm flex items-center gap-3">
                                    <FaClock className="text-2xl text-green-600" />
                                    <div>
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{t('recipes.time')}</div>
                                        <div className="font-bold text-green-950">{featuredRecipe.cookingTime}</div>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-2xl border border-green-50 shadow-sm flex items-center gap-3">
                                    <FaUserFriends className="text-2xl text-green-600" />
                                    <div>
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{t('recipes.serves')}</div>
                                        <div className="font-bold text-green-950">{featuredRecipe.servings}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Other Recipes Grid */}
                <div className="space-y-12">
                    <div className="flex items-center gap-6">
                        <h2 className="text-3xl font-black text-green-950 tracking-tighter whitespace-nowrap">{t('recipes.explore_more')} <span className="text-green-600 italic">{t('recipes.delicacies')}</span></h2>
                        <div className="h-px bg-green-100 w-full rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {otherRecipes.map((recipe) => (
                            <div key={recipe.id} className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col group/card hover:-translate-y-2">
                                <div className="aspect-video bg-black relative">
                                    <VideoPlayer
                                        videoUrl={recipe.videoUrl}
                                        title={recipe.title}
                                    />
                                </div>
                                <div className="p-8 space-y-6 flex-grow flex flex-col">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-green-600/60">
                                            <span>{recipe.chef}</span>
                                            <span className="text-orange-500">{recipe.difficulty}</span>
                                        </div>
                                        <h3 className="text-2xl font-black text-green-950 tracking-tighter group-hover/card:text-green-600 transition-colors">
                                            {recipe.title}
                                        </h3>
                                    </div>
                                    <p className="text-gray-500 text-sm leading-relaxed overflow-hidden text-ellipsis line-clamp-2">
                                        {recipe.description}
                                    </p>
                                    <div className="mt-auto pt-6 flex items-center justify-between border-t border-gray-50 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                        <span className="flex items-center gap-1.5"><FaClock className="text-green-500" /> {recipe.cookingTime}</span>
                                        <span className="flex items-center gap-1.5"><FaFireAlt className="text-orange-500" /> {t('recipes.calories')}: {recipe.calories}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipesPage;
