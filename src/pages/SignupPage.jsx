import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const SignupPage = () => {
    const navigate = useNavigate();
    const { register, userInfo } = useContext(AuthContext);
    const { t } = useLanguage();
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userInfo) {
            navigate('/');
        }
    }, [userInfo, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError(t('auth.pass_mismatch'));
            setLoading(false);
            return;
        }

        const { name, email, phone, password } = formData;
        const result = await register(name, email, phone, password);

        if (result.success) {
            alert(t('auth.success_signup'));
            navigate('/');
        } else {
            setError(result.message);
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg mt-10">
            <h2 className="text-3xl font-bold text-center mb-6 text-green-900">{t('auth.signup_title')}</h2>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">{t('auth.full_name')}</label>
                    <input
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                        placeholder={t('auth.name_placeholder')}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>
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
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">{t('auth.confirm_password_label')}</label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            className="w-full px-4 py-3 rounded-lg border focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                            placeholder={t('auth.password_placeholder')}
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-3 text-gray-500 hover:text-green-600 focus:outline-none"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                        </button>
                    </div>
                </div>
                <button
                    disabled={loading}
                    className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition mt-2 disabled:opacity-50"
                >
                    {loading ? t('auth.creating_account') : t('auth.signup_btn')}
                </button>
            </form>
            <p className="text-center mt-6 text-gray-600">
                {t('auth.have_account')} <Link to="/login" className="text-green-600 font-bold hover:underline">{t('auth.login_btn')}</Link>
            </p>
        </div>
    );
};

export default SignupPage;
