
import { type AppType } from "next/app";
import { Toaster } from "react-hot-toast";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";

import { api } from "~/utils/api";
import { AppProvider } from "../AppContext";

import "~/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <SessionProvider session={(pageProps as any).session}>
      <Head>
        <title>Playtastic</title>
        <link rel="icon" type="image/svg+xml" href="/playtastic-logo.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <AppProvider>
        <Toaster position="bottom-center" />
        <div className={inter.className}>
          <Component {...pageProps} />
        </div>
      </AppProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
