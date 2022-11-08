import { I18n } from '@grammyjs/i18n';

const i18n = new I18n({
  directory: 'locales',
  useSession: true,
  defaultLanguageOnMissing: true,
  defaultLanguage: 'en',
});

export default i18n;
