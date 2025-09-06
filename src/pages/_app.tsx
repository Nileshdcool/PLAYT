import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Toaster } from "react-hot-toast";
import { Geist } from "next/font/google";

import { api } from "~/utils/api";
import { AppProvider } from "../AppContext";

import "~/styles/globals.css";

const geist = Geist({
  subsets: ["latin"],
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <AppProvider>
        <Toaster position="bottom-center" />
        <div className={geist.className}>
          <Component {...pageProps} />
        </div>
      </AppProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
