
//тут хуйнёшь глобальные стили которые будут на всех страницах  тип такое import '../styles/globals.css
//ещё тут добавляешь общие компоненты которые есть везде типа навбара и фоотера 

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
       <Head>
        <title>CarAuto</title>
        <meta name="description" content="Топ тачки" />
        <link rel="icon" href=" " />
      </Head>
      <body>
        {/* вот тут типа <Header/> */}
       {children}
        {/* вот тут типа <фоотер/> и они будут везде рендерица на каждой странице  */}

      </body>
    </html>
  );
}
