import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '../../i18n/routing';
import Navbar from '../../components/lib/Navbar';

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params }) {
  const { locale } = await params;



  const messages = await getMessages({ locale: locale });

  return (
    
        <NextIntlClientProvider messages={messages} locale={locale}>
            <Navbar/>
          {children}
        </NextIntlClientProvider>
     
  );
}