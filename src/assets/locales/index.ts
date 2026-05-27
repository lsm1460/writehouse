import i18n from 'i18next'

import koInit from './ko.json'
import enInit from './en.json'

export const initialResources = {
  ko: {
    translation: { ...koInit },
  },
  en: {
    translation: { ...enInit },
  },
}

export const loadExtraLocaleBundle = async (lang: 'ko' | 'en') => {
  const bundle = await import(`./${lang}/index.ts`)
  i18n.addResourceBundle(lang, 'translation', bundle.default, true, true)
}
