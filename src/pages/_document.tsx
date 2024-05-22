import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <title>Drone Spotter</title>
      <link
        rel="apple-touch-icon"
        sizes="128x128"
        href="/icons/appIcons/128.png"
      ></link>
      <link
        rel="apple-touch-icon"
        sizes="256x256"
        href="/icons/appIcons/256.png"
      ></link>
      <link
        rel="apple-touch-icon"
        sizes="512x512"
        href="/icons/appIcons/512.png"
      ></link>
      <Head>
        <meta
          name="viewport"
          content="initial-scale = 1.0,maximum-scale = 1.0"
        />
      </Head>
      <body>
        <div className=" h-full">
          <Main />
          <NextScript />
        </div>
      </body>
    </Html>
  );
}
