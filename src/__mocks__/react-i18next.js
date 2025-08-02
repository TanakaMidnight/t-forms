module.exports = {
  ...jest.requireActual('react-i18next'),
  useTranslation: () => ({ t: (key) => key, i18n: { changeLanguage: () => new Promise(() => {}) } }),
  withTranslation: () => (Component) => Component,
  initReactI18next: { type: '3rdParty', init: () => {} },
};
