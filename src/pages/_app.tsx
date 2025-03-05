import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter, Poppins, Roboto_Mono, Bebas_Neue, Oswald } from "next/font/google";

const bebas = Bebas_Neue({
  weight: ["400"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-bebas",
});

const oswald = Oswald({
  weight: ["400", "600"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-oswald",
});

const roboto = Roboto_Mono({
  weight: ["400", "500"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-roboto",
});
export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${bebas.variable} ${oswald.variable} ${roboto.variable}`}>
      <Component {...pageProps} />
    </div>
  );
}
