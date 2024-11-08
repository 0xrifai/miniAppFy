import type { AppProps } from "next/app";

import "../assets/globals.css";

function MyApp({ Component, pageProps: { ...pageProps } }: AppProps) {
  return (
    <Component {...pageProps} />
  );
}

export default MyApp;