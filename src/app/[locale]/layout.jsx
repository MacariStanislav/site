
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import NavbarWrapper from '@/components/lib/NavbarWrapper';
import PageContent from '@/components/lib/PageContent';
import '@/styles/global.css';
import Footer from '@/components/lib/Footer'
export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params }) {
  const { locale } = await params;
  const messages = await getMessages({ locale: locale });


  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <NavbarWrapper />
          <PageContent>{children}</PageContent>
          <Footer/>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
