import { useState, useEffect } from 'react';
import config from '../config';
import { useLanguage } from '../context/LanguageContext';

const FarmersPage = () => {
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();

    useEffect(() => {
        const fetchFarmers = async () => {
            try {
                const res = await fetch(`${config.API_URL}/api/farmers`);
                const data = await res.json();
                setFarmers(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFarmers();
    }, []);

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold text-center mb-8">{t('farmers.title')}</h1>
            <p className="text-center text-gray-600 max-w-2xl mx-auto">
                {t('farmers.subtitle')}
            </p>

            {loading ? (
                <div className="text-center py-20 text-gray-500 animate-pulse">{t('farmers.loading')}</div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                    {farmers.map((farmer) => (
                        <div key={farmer._id} className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition">
                            <div className="h-96 overflow-hidden">
                                <img
                                    src={farmer.image || '/images/default_farmer.jpg'}
                                    alt={farmer.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                />
                            </div>
                            <div className="p-6">
                                <h2 className="text-2xl font-bold mb-1">{farmer.name}</h2>
                                <p className="text-green-600 font-medium mb-3">📍 {farmer.village || 'Indian Village'}</p>
                                <p className="text-gray-600 mb-4">{farmer.bio}</p>
                                <div className="border-t pt-4">
                                    <span className="text-sm text-gray-500 block mb-1">{t('farmers.expert_in')}</span>
                                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
                                        {farmer.farmingMethod || 'Organic'} {farmer.specialty}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FarmersPage;
