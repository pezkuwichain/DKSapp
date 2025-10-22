import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './translations/en.json';
import ku from './translations/ku.json';
import ckb from './translations/ckb.json';
import tr from './translations/tr.json';
import ar from './translations/ar.json';
import fa from './translations/fa.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ku: { translation: ku },
      ckb: { translation: ckb },
      tr: { translation: tr },
      ar: { translation: ar },
      fa: { translation: fa },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
