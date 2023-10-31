import "./globals.css";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "RideFixr",
  description: "Fix it fast",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextTopLoader
          color="#26577c"
          initialPosition={0.30}
          crawlSpeed={1000}
          height={5}
          crawl={true}
          easing="ease"
          showSpinner={true}
          speed={1000}
        />
        {children}
      </body>
    </html>
  );
}
