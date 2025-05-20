import React from 'react';
import { useTranslation } from 'react-i18next';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#1a2238] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="font-bold text-2xl">DSN</span>
              <span className="block text-xs text-gray-400">DIGITAL NOVA CO., LTD.</span>
            </Link>
            <p className="text-sm mb-4 text-gray-300">
              {t('hero.description')}
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Links - Column 1 */}
          <div className="md:col-span-1">
            <h3 className="font-semibold text-lg mb-4">{t('nav.home')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white text-sm transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white text-sm transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-white text-sm transition-colors">
                  {t('nav.services')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white text-sm transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Links - Column 2 */}
          <div className="md:col-span-1">
            <h3 className="font-semibold text-lg mb-4">{t('services.title')}</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  SCORM Packages
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Tin Can API
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  xAPI Solutions
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Rise 360
                </a>
              </li>
            </ul>
          </div>

          {/* Links - Column 3 */}
          <div className="md:col-span-1">
            <h3 className="font-semibold text-lg mb-4">{t('nav.contact')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white text-sm transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  {t('footer.links.privacyPolicy')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  {t('footer.links.termsOfService')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  {t('footer.links.siteMap')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>{t('footer.copyright')}</p>
          <div className="flex justify-center space-x-4 mt-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              {t('footer.links.privacyPolicy')}
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              {t('footer.links.termsOfService')}
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              {t('footer.links.siteMap')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;