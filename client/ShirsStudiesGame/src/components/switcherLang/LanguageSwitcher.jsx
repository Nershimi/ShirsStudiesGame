import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaGlobe } from 'react-icons/fa';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    // Toggle language popup visibility
    const togglePopup = () => setIsOpen(!isOpen);

    // Change language and close popup
    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
        setIsOpen(false);
    };

    return (
        <div className="language-switcher">
            <FaGlobe onClick={togglePopup} className="language-icon" />
            {isOpen && (
                <div
                    className="language-popup-overlay"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="language-popup"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button onClick={() => changeLanguage('he')}>עברית</button>
                        <button onClick={() => changeLanguage('en')}>English</button>
                        {/* Add more languages here */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;

{/* Uncomment and add more languages as needed
<button onClick={() => changeLanguage('ar')}>العربية</button>
<button onClick={() => changeLanguage('ru')}>Русский</button>
*/}