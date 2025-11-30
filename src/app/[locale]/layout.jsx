import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import NavbarWrapper from '@/components/lib/NavbarWrapper';
import PageContent from '@/components/lib/PageContent';
import Footer from '@/components/lib/Footer';
import '@/styles/global.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// ==========================
// SEO + PWA metadata
// ==========================
export const metadata = {
  title: {
    default: "AUTOGARANT_NORD",
    template: "%s | AUTOGARANT_NORD"
  },
  description:
    "AUTOGARANT_NORD — аренда, продажа и подбор автомобилей. Лучшие предложения, цены и сервис.",
  keywords: [
    "авто",
    "аренда авто",
    "продажа автомобилей",
    "автомобили",
    "машины",
    "AUTOGARANT_NORD",
    "car rent",
    "auto dealer"
  ],
  icons: {
    icon: "/icons/img.jpg",
    shortcut: "/icons/img.jpg",
    apple: "/icons/img.jpg"
  },
  openGraph: {
    title: "AUTOGARANT_NORD",
    description:
      "Лучшие автомобили, аренда и подбор — AUTOGARANT_NORD.",
    url: "https://your-domain.com",
    siteName: "AUTOGARANT_NORD",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630
      }
    ],
    locale: "ru_RU",
    type: "website"
  },
  manifest: "/manifest.json",
  themeColor: "#000000",
};

export default async function RootLayout({ children, params }) {
  const { locale } = params;
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <head>
        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />

        {/* Улучшение скорости */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* Structured data (Google) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "AUTOGARANT_NORD",
              url: "https://your-domain.com",
              logo: "https://your-domain.com/icons/icon-512.png",
              sameAs: [
                "https://facebook.com/",
                "https://instagram.com/",
                "https://tiktok.com/"
              ]
            })
          }}
        />
      </head>

      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <NavbarWrapper />
          <PageContent>{children}</PageContent>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
