import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ locale }) => {
  // Если locale не определен, используем дефолтный
  let currentLocale = await locale || routing.defaultLocale;
  
  let messages;
  try {
    messages = (await import(`../locales/${currentLocale}/global.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale ${currentLocale}:`, error);
    // Fallback к дефолтной локали
    messages = (await import(`../locales/${routing.defaultLocale}/global.json`)).default;
  }

  return {
    locale: currentLocale,
    messages
  };
});