import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">

      <Head >
      <meta name="viewport" content="initial-scale = 1.0,maximum-scale = 1.0" />

        </Head>
      <body>
        <div className=" h-full">
        <Main />
        <NextScript />
        </div>
      </body>
    </Html>
  )
}
