import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
    const { t } = useLanguage();
    return (
        <footer className="bg-green-950 text-white py-12 md:py-16">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="space-y-4">
                    <h3 className="text-2xl font-black tracking-tighter">🌿 DHARTI KA SWAD</h3>
                    <p className="text-green-100/60 leading-relaxed">
                        {t('footer.about_text') || 'Pure Taste From Soil. We bridge the gap between hard-working farmers and conscious consumers for a healthier tomorrow.'}
                    </p>
                </div>
                <div>
                    <h4 className="text-lg font-bold mb-6 text-green-400">{t('footer.quick_links')}</h4>
                    <ul className="space-y-3">
                        <li><a href="/" className="text-green-100/80 hover:text-white transition-colors">{t('nav.home')}</a></li>
                        <li><a href="/products" className="text-green-100/80 hover:text-white transition-colors">{t('nav.products')}</a></li>
                        <li><a href="/recipes" className="text-green-100/80 hover:text-white transition-colors">{t('nav.recipes')}</a></li>
                        <li><a href="/farmers" className="text-green-100/80 hover:text-white transition-colors">{t('nav.farmers')}</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-lg font-bold mb-6 text-green-400">{t('footer.categories')}</h4>
                    <ul className="space-y-3">
                        <li><a href="/products?category=Vegetables" className="text-green-100/80 hover:text-white transition-colors">{t('footer.cat_veg') || 'Fresh Vegetables'}</a></li>
                        <li><a href="/products?category=Spices" className="text-green-100/80 hover:text-white transition-colors">{t('footer.cat_spices') || 'Organic Spices'}</a></li>
                        <li><a href="/products?category=Snacks" className="text-green-100/80 hover:text-white transition-colors">{t('footer.cat_snacks') || 'Village Snacks'}</a></li>
                        <li><a href="/products?category=Dairy" className="text-green-100/80 hover:text-white transition-colors">{t('footer.cat_dairy') || 'Pure Dairy'}</a></li>
                    </ul>
                </div>
                <div className="space-y-6">
                    <h4 className="text-lg font-bold text-green-400">{t('footer.contact_us')}</h4>
                    <div className="flex space-x-4">
                        <a href="https://www.facebook.com/share/16viNYGNz2/" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all"><FaFacebook className="text-xl" /></a>
                        <a href="https://www.instagram.com/shiwamdwivedi96?igsh=aG1qajcwbTYzam9k" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all"><FaInstagram className="text-xl" /></a>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all"><FaTwitter className="text-xl" /></a>
                    </div>
                    <div>
                        <p className="text-xs text-green-100/40 uppercase tracking-widest font-bold">{t('footer.inquiries') || 'Inquiries'}</p>
                        <p className="text-green-100/80">shiwamdwivedi@gmail.com</p>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 mt-16 pt-8 border-t border-white/10 text-center text-green-100/40 text-sm">
                &copy; {new Date().getFullYear()} Dharti Ka Swad. {t('footer.rights')}
            </div>
        </footer>
    );
};

export default Footer;
