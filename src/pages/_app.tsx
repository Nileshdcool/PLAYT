
import { type AppType } from "next/app";
import { Toaster } from "react-hot-toast";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";
import { AppProvider } from "../AppContext";

import "~/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <SessionProvider session={(pageProps as any).session}>
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
