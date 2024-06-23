import { useState, useEffect } from 'react';
import { I18n } from 'i18n-js';
import en from '../i18n/en.json';
import fr from '../i18n/fr.json';

const i18n = new I18n({
    en, fr,
});

i18n.defaultLocale = 'en';
export const useTranslate = () => {
    const [locale, setLocale] = useState(i18n.locale);

    useEffect(() => {
        i18n.locale = locale;
    }, [locale]);

    const t = (key: string, options?: Record<string, any>) => {
        return i18n.t(key, options);
    };

    return {
        t,
        locale,
        setLocale
    };
};
