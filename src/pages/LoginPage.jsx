import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, userInfo } = useContext(AuthContext);
    const { t } = useLanguage();

    const [loginMethod, setLoginMethod] = useState('phone'); // 'email' or 'phone'
    const [formData, setFormData] = useState({ email: '', phone: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const redirect = location.search ? location.search.split('=')[1] : '/';

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [userInfo, navigate, redirect]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { email, phone, password } = formData;
        const identifier = loginMethod === 'email' ? { email } : { phone };

        try {
            await login(identifier, password);
            // If success, useEffect will redirect
        } catch (err) {
            setError(err.message || 'Login failed');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg mt-10">
            <h2 className="text-3xl font-bold text-center mb-6 text-green-900">{t('auth.login_title')}</h2>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Method Selector */}
                <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                    <button
                        type="button"
                        onClick={() => setLoginMethod('phone')}
                        className={`flex-1 py-2 rounded-lg font-bold transition ${loginMethod === 'phone' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        📱 {t('nav.phone') || 'Phone'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setLoginMethod('email')}
                        className={`flex-1 py-2 rounded-lg font-bold transition ${loginMethod === 'email' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        📧 {t('nav.email') || 'Email'}
                    </button>
                </div>

                {loginMethod === 'email' ? (
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">{t('auth.email_label')}</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 rounded-lg border focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                            placeholder={t('auth.email_placeholder')}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                ) : (
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">{t('auth.mobile_label')}</label>
                        <input
                            type="tel"
                            className="w-full px-4 py-3 rounded-lg border focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                            placeholder={t('auth.phone_placeholder')}
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            pattern="[0-9]{10}"
                            required
                        />
                    </div>
                )}
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">{t('auth.password_label')}</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="w-full px-4 py-3 rounded-lg border focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                            placeholder={t('auth.password_placeholder')}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-3 text-gray-500 hover:text-green-600 focus:outline-none"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                        </button>
                    </div>
                </div>
                <div className="text-right mb-4">
                    <Link to="/forgot-password" className="text-sm text-green-600 hover:underline font-semibold">
                        Forgot Password?
                    </Link>
                </div>
                <button
                    disabled={loading}
                    className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                    {loading ? t('auth.logging_in') : t('auth.login_btn')}
                </button>
            </form>
            <p className="text-center mt-6 text-gray-600">
                {t('auth.no_account')} <Link to="/signup" className="text-green-600 font-bold hover:underline">{t('auth.signup_btn')}</Link>
            </p>
            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 font-bold mb-1">{t('auth.demo_title')}</p>
                <p className="text-xs text-green-700">{t('nav.email')}: <span className="font-mono">admin@example.com</span></p>
                <p className="text-xs text-green-700">{t('auth.password_label')}: <span className="font-mono">123456</span></p>
            </div>
        </div>
    );
};

export default LoginPage;

