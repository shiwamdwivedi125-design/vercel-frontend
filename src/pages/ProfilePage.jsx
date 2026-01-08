import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const ProfilePage = () => {
    const { userInfo, updateProfile } = useContext(AuthContext);
    const { t } = useLanguage();

    React.useEffect(() => {
        updateProfile();
    }, []);

    if (!userInfo) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="bg-white p-8 rounded-xl shadow-2xl text-center">
                    <p className="text-xl mb-4 text-gray-700">{t('profile.login_msg')}</p>
                    <Link to="/login" className="inline-block bg-green-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-700 transition duration-300">
                        {t('profile.login_btn')}
                    </Link>
                </div>
            </div>
        );
    }

    const { name, email } = userInfo;
    const initials = name ? name.split(' ').map((n) => n[0]).join('').toUpperCase() : 'U';

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/50">
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 h-32 sm:h-48 relative">
                        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                            <div className="h-32 w-32 rounded-full border-4 border-white bg-white shadow-lg flex items-center justify-center text-4xl font-bold text-green-700">
                                {initials}
                            </div>
                        </div>
                    </div>

                    <div className="pt-20 pb-8 px-8 text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">{name}</h1>
                        <p className="text-gray-500 font-medium">{email}</p>
                        {userInfo.phone && <p className="text-green-600 font-bold mt-1">📱 {userInfo.phone}</p>}

                        <div className="flex justify-center gap-4 mb-10 mt-6">
                            <span className="px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                                {t('profile.member')}
                            </span>
                            <span className="px-4 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold border border-yellow-300 flex items-center gap-1">
                                🪙 {t('product_detail.desi_coins').replace('{count}', userInfo.rewardPoints || 0)}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                            <Link to="/myorders" className="group bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-transparent hover:border-green-200 text-left">
                                <div className="h-10 w-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{t('profile.orders')}</h3>
                                <p className="text-gray-500 text-sm">{t('profile.orders_desc')}</p>
                            </Link>

                            <Link to="/settings" className="group bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-transparent hover:border-green-200 text-left cursor-pointer opacity-70 hover:opacity-100">
                                <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{t('profile.settings')}</h3>
                                <p className="text-gray-500 text-sm">{t('profile.settings_desc')}</p>
                            </Link>

                            <Link to="/help" className="group bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-transparent hover:border-green-200 text-left">
                                <div className="h-10 w-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{t('profile.help')}</h3>
                                <p className="text-gray-500 text-sm">{t('profile.help_desc')}</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
