"use client";
import { useRouter } from "next/navigation";
import "./globals.css";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import NavWithOutAccess from "./components/NavWithOutAccess";
import NavWithAcess from "./components/NavWithAccess";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "RideFixr",
  description: "Fix it fast",
};

export default function RootLayout({ children }) {
  const [userStatus, setUserStatus] = useState("");

  const router = useRouter();
  const navigate = (path) => {
    router.push(path);
  };

  useEffect(() => {
    const storedUserStatus = localStorage.getItem("userActivite");
    setUserStatus(storedUserStatus);
    router.refresh();
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* {!userStatus?<NavWithOutAccess/>:<NavWithAcess/>} */}
        {children}
      </body>
    </html>
  );
}

