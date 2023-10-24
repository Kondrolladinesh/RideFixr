"use client";
import { useRouter } from "next/navigation";
import "../globals.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaUserCircle, FaUserEdit, FaTimesCircle } from "react-icons/fa";
import { FiMenu, FiLogOut } from "react-icons/fi";
import { RxAvatar } from "react-icons/rx";
import Modal from "react-modal";
import { getUserDetails } from "../home/userProfile/getUserData";
import Cookies from "js-cookie";
import { getMechanicDetails } from "../mechDashBoard/profilePage/getMechanicDetails";

const MechNavBar = () => {
  const router = useRouter();
  const navigate = (path) => {
    router.push(path);
  };
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [activeProfile, setActiveProfile] = useState(false);
  const [UserName, setUserName] = useState("");
  const [Email, setEmail] = useState("");

  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  const toggleProfile = () => {
    setActiveProfile(!activeProfile);
  };

  const Logoutfun = () => {
    navigate("/login");
    Cookies.remove("mechActivite");
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userData = await getMechanicDetails();
      setUserName(userData.UserName);
      setEmail(userData.Email);
    };
    fetchUserDetails();
  }, []);

  return (
    <div className="nav-bar">
      <Image
        src={"/RideFixr-logo_white.png"}
        alt="Logo"
        width={60}
        height={60}
      />
      <div className="screen-low-menu">
        <FiMenu className="usericon1" onClick={toggleMobileMenu} />
        <FaUserCircle className="usericon1" onClick={toggleProfile} />
      </div>
      <div className={`nav ${mobileMenuVisible ? "profile-card" : ""}`}>
        <li>
          <a href="/mechDashBoard">
            <button>Home</button>
          </a>
        </li>
        <li>
          <FaUserCircle onClick={toggleProfile} className="usericon2" />
        </li>
      </div>
      <Modal
        backdrop="transparent"
        isOpen={activeProfile}
        onRequestClose={() => setActiveProfile(!activeProfile)}
        className="profile-card"
      >
        <div className="cancle">
          <FaTimesCircle
            onClick={() => setActiveProfile(!activeProfile)}
            className="Cross_Icon"
          />
        </div>
        <div className="details">
          <RxAvatar className="avatar" />
          <p>{UserName}</p>
          <p>{Email}</p>
          <button
            onClick={() => {
              navigate("/mechDashBoard/profilePage");
              setActiveProfile(false);
            }}
          >
            Edit Profile <FaUserEdit className="icons" />
          </button>
          <button
            onClick={Logoutfun}
            style={{ backgroundColor: "red", color: "#fff", border: "none" }}
          >
            Log Out <FiLogOut className="icons" />
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default MechNavBar;
