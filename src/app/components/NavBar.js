"use client";
import { useRouter } from "next/navigation";
import "../globals.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaUserCircle, FaUserEdit} from "react-icons/fa";
import {FiMenu, FiLogOut} from "react-icons/fi";
import {RxAvatar} from "react-icons/rx";

const NavBar = () => {
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

  const toggleProfile = () => {
    setActiveProfile(!activeProfile);
  };

  const Logoutfun = () => {
    localStorage.setItem("userActivite", "");
    navigate("/login");
    router.refresh();
  };

  return (
    <div className="nav-bar">
      <Image
        src={"/RideFixr.png"}
        alt="Logo"
        width={60}
        height={60}
      />
      <div className="screen-low-menu">
        <FiMenu className="usericon1" onClick={toggleMobileMenu}/>
        <FaUserCircle className="usericon1" onClick={toggleProfile}/>
      </div>
      <ul className={`nav ${mobileMenuVisible ? "mobile-visible" : ""}`}>
        {!userStatus ? (
          <>
            <li>
              <button onClick={() => navigate("/")}>Home</button>
            </li>
            <li>
              <button onClick={() => navigate("/login")}>Log In</button>
            </li>
            <li>
              <button onClick={() => navigate("/register")}>Sign Up</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <button onClick={() => navigate("/home")}>Home</button>
            </li>
            <li>
              <button onClick={() => navigate("/home/mechanicdata/electric")}>Electric</button>
            </li>
            <li>
              <button onClick={() => navigate("/home/mechanicdata/engine")}>Engine</button>
            </li>
            <li>
              <button onClick={() => navigate("/home/mechanicdata/tyre")}>Tyre</button>
            </li>
            <li>
                <FaUserCircle onClick={toggleProfile} className="usericon2"/>
            </li>
          </>
        )}
      </ul>
      {activeProfile &&
        <div className="profile-card">
          <div className="panel-1">
            <RxAvatar className="avatar"/>
            <p>Name</p>
            <button>Edit Profile <FaUserEdit className="icons"/></button>
            <button onClick={Logoutfun} >Log Out <FiLogOut className="icons"/></button>
          </div>
        </div>
      }
    </div>
  );
};

export default NavBar;