"use client";
import { useRouter } from "next/navigation";
import "../globals.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaUserCircle, FaUserEdit } from "react-icons/fa";
import { FiMenu, FiLogOut } from "react-icons/fi";
import { RxAvatar } from "react-icons/rx";

const NavWithOutAccess = () => {
  const router = useRouter();
  const navigate = (path) => {
    router.push(path);
  };

  const [userStatus, setUserStatus] = useState("");
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [activeProfile, setActiveProfile] = useState(false);

  useEffect(() => {
    const storedUserStatus = localStorage.getItem("userActivite");
    setUserStatus(storedUserStatus);
    router.refresh();
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  return (
    <div className="nav-bar">
      <Image src={"/RideFixr-logo_white.png"} alt="Logo" width={60} height={60} priority />
      <div className="screen-low-menu">
        <FiMenu className="usericon1" onClick={toggleMobileMenu} />
      </div>
      <div className={`nav ${mobileMenuVisible ? "profile-card" : ""}`}>
        <li>
          <a href="/"><button>Home</button></a>
        </li>
        <li>
          <a href="/contact"><button>Contact</button></a>
        </li>
        <li>
          <a href="/login"><button>Log In</button></a>
        </li>
        <li>
          <a href="/register"><button>Sign Up</button></a>
        </li>
      </div>
    </div>
  );
};

export default NavWithOutAccess;
