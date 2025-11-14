export const metadata = {
  title: 'My App',
  description: 'Example App',
  lang: 'ru',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        {children}
      </body>
    </html>
  );
}
