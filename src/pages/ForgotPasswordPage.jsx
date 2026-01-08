import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import AuthContext from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const { userInfo } = useContext(AuthContext);
    const { t } = useLanguage();

    const [step, setStep] = useState(1); // 1: Email/Mobile, 2: OTP, 3: New Password
    const [resetMethod, setResetMethod] = useState('phone'); // 'email' or 'phone'
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Pre-fill fields if user is already logged in
    useEffect(() => {
        if (userInfo) {
            if (userInfo.email) setEmail(userInfo.email);
            if (userInfo.phone) setPhone(userInfo.phone);
        } else {
            const savedEmail = localStorage.getItem('lastEmail');
            const savedPhone = localStorage.getItem('lastPhone');
            if (savedEmail) setEmail(savedEmail);
            if (savedPhone) setPhone(savedPhone);
        }
    }, [userInfo]);

    // Step 1: Send OTP
    const handleSendOTP = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        const payload = resetMethod === 'email' ? { email } : { phone };
        if (resetMethod === 'email') localStorage.setItem('lastEmail', email);
        else localStorage.setItem('lastPhone', phone);

        try {
            const { data } = await axios.post(`${config.API_URL}/api/password-reset/send-otp`, payload);
            setMessage(data.message);

            // "Smart Flow": If OTP is returned in response, auto-fill and auto-verify
            if (data.otp) {
                setOtp(data.otp);
                setStep(2);
                // Auto-advance to verification
                setTimeout(() => {
                    handleVerifyOTP(null, data.otp);
                }, 1000);
            } else {
                setStep(2);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOTP = async (e, autoOtp) => {
        if (e) e.preventDefault();
        const otpToVerify = autoOtp || otp;

        setLoading(true);
        setError('');
        setMessage('');

        const payload = resetMethod === 'email' ? { email, otp: otpToVerify } : { phone, otp: otpToVerify };

        try {
            const { data } = await axios.post(`${config.API_URL}/api/password-reset/verify-otp`, payload);
            setMessage(data.message);
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        const payload = resetMethod === 'email'
            ? { email, otp, newPassword }
            : { phone, otp, newPassword };

        try {
            const { data } = await axios.post(`${config.API_URL}/api/password-reset/reset-password`, payload);
            setMessage(data.message);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-green-900 mb-2">{t('auth.reset_title')}</h1>
                    <p className="text-gray-600">
                        {step === 1 && (resetMethod === 'email' ? t('auth.reset_step1_email') : t('auth.reset_step1_phone'))}
                        {step === 2 && (resetMethod === 'email' ? t('auth.reset_step2_email') : t('auth.reset_step2_phone'))}
                        {step === 3 && t('auth.reset_step3')}
                    </p>
                </div>

                {/* Progress Indicator */}
                <div className="flex justify-between mb-8">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex-1 flex items-center">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${step >= s ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
                                }`}>
                                {s}
                            </div>
                            {s < 3 && <div className={`flex-1 h-1 mx-2 ${step > s ? 'bg-green-600' : 'bg-gray-200'}`} />}
                        </div>
                    ))}
                </div>

                {/* Messages */}
                {message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                {/* Step 1: Input Selection & Input */}
                {step === 1 && (
                    <form onSubmit={handleSendOTP} className="space-y-6">
                        {/* Method Selector */}
                        <div className="flex bg-gray-100 p-1 rounded-xl">
                            <button
                                type="button"
                                onClick={() => setResetMethod('phone')}
                                className={`flex-1 py-2 rounded-lg font-bold transition ${resetMethod === 'phone' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                📱 {t('nav.phone') || 'Phone'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setResetMethod('email')}
                                className={`flex-1 py-2 rounded-lg font-bold transition ${resetMethod === 'email' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                📧 {t('nav.email') || 'Email'}
                            </button>
                        </div>

                        {resetMethod === 'email' ? (
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">{t('auth.email_label')}</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                                    placeholder={t('auth.email_placeholder')}
                                />
                            </div>
                        ) : (
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">{t('auth.mobile_label')}</label>
                                <input
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                                    placeholder={t('auth.phone_placeholder')}
                                    pattern="[0-9]{10}"
                                />
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-4 rounded-xl font-black text-lg hover:bg-green-700 transition shadow-lg shadow-green-200 disabled:opacity-50"
                        >
                            {loading ? t('auth.verifying') : t('auth.send_otp')}
                        </button>
                    </form>
                )}

                {/* Step 2: OTP Input */}
                {step === 2 && (
                    <form onSubmit={handleVerifyOTP} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">{t('auth.enter_otp')}</label>
                            <input
                                type="text"
                                required
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-center text-2xl tracking-widest"
                                placeholder="000000"
                                maxLength="6"
                            />
                            <p className="text-xs text-gray-500 mt-2">{t('auth.otp_sent_check')}</p>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition disabled:opacity-50"
                        >
                            {loading ? t('auth.verifying') : t('auth.verify_otp')}
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-full text-green-600 py-2 text-sm hover:underline"
                        >
                            {t('auth.back_to_email')}
                        </button>
                    </form>
                )}

                {/* Step 3: New Password Input */}
                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">{t('auth.new_password')}</label>
                            <input
                                type="password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                                placeholder={t('auth.pass_length')}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Confirm Password</label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                                placeholder="Re-enter password"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition disabled:opacity-50"
                        >
                            {loading ? t('auth.resetting') : t('auth.reset_btn')}
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center">
                    <Link to="/login" className="text-green-600 hover:underline font-semibold">
                        {t('auth.back_to_login')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
