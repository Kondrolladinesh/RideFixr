"use client";
import Image from "next/image";
import "./Admin.css";
import {
  FaHouseChimneyUser,
  FaCircleUser,
  FaUserClock,
  FaUserCheck,
  FaUserXmark,
  FaRegCircleXmark
} from "react-icons/fa6";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { FiLogOut } from "react-icons/fi";
import Navbar from "./navbar";
import { useState, useEffect } from "react";
import DashHome from "./pages/DashHome";
import DashUsers from "./pages/DashUsers";
import DashMechPending from "./pages/DashMechPending";
import DashMechVerified from "./pages/DashMechVerified";
import DashMechBlocked from "./pages/DashMechBlocked";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Admin = () => {
  const [MechDetails, setMechDetails] = useState([]);
  const [UserDetails, setUserDetails] = useState([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [selectedContainer, setSelectedContainer] = useState("DashBoard");
  const router = useRouter();
  const navigate = (path) => {
    router.push(path);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "/api/mechanicdetails"
        );
        const data = await response.json();

        if (data.success) {
          setMechDetails(data.result);
        } else {
          toast.warning('Error in Mechanic details!', {
            position: toast.POSITION.BOTTOM_CENTER
        });
        }
      } catch (error) {
        toast.error("Network Error", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    };
    fetchData();
  }, [MechDetails]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/userdetails");
        const data = await response.json();

        if (data.success) {
          setUserDetails(data.result);
        } else {
          toast.warning('Error in User details!', {
            position: toast.POSITION.BOTTOM_CENTER
        });
        }
      } catch (error) {
        toast.error("Network Error", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    };
    fetchData();
  }, [UserDetails]);

  const handleContainerChange = (containerName) => {
    setSelectedContainer(containerName);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const Logoutfun = () => {
    Cookies.remove("adminActivite");
    navigate("/login");
  };

  return (
    <div className={`admin-section`}>
      <div className={`${isSidebarVisible ? "side-bar" : "sidebar-hidden"}`}>
      {!isSidebarVisible && <FaRegCircleXmark className="close-icon" onClick={toggleSidebar}/>}
        <div className="company-details">
          <Image src={"/RideFixr.png"} alt="Logo" width={120} height={120} priority/>
          <h1>RideFixr</h1>
          <h3>Admin Dashboard</h3>
        </div>
        <div className="dashboard-options">
          <button
            className="button-class"
            onClick={() => handleContainerChange("DashBoard")}
          >
            <FaHouseChimneyUser className="icons" />
            Home
          </button>
          <button
            className="button-class"
            onClick={() => handleContainerChange("User Details")}
          >
            <FaCircleUser className="icons" />
            User Details
          </button>
          <button
            className="button-class"
            onClick={() => handleContainerChange("Pending Mechanic")}
          >
            <FaUserClock className="icons" />
            UnVerified Mechanics
          </button>
          <button
            className="button-class"
            onClick={() => handleContainerChange("Verified Mechanic")}
          >
            <FaUserCheck className="icons" />
            Verified Mechanics
          </button>
          <button
            className="button-class"
            onClick={() => handleContainerChange("Blocked Mechanic")}
          >
            <FaUserXmark className="icons" />
            Blocked Mechanics
          </button>
        </div>
        <button className="Logout-button" onClick={Logoutfun}>
          Log Out <FiLogOut className="logout-icon" />{" "}
        </button>
      </div>
      <div className="main-content">
      <Navbar
          CName={selectedContainer}
          isSidebarVisible={isSidebarVisible}
          toggleSidebar={toggleSidebar}
        />
        <div className="Container">
          <div
            className={`${
              selectedContainer === "DashBoard" ? "BoxContainer" : "show"
            }`}
          >
            <DashHome UserDetails={UserDetails} MechDetails={MechDetails} />
          </div>
          <div
            className={`${
              selectedContainer === "User Details" ? "BoxContainer" : "show"
            }`}
          >
            <DashUsers UserDetails={UserDetails}/>
          </div>
          <div
            className={`${
              selectedContainer === "Pending Mechanic" ? "BoxContainer" : "show"
            }`}
          >
            <DashMechPending MechDetails={MechDetails} />
          </div>
          <div
            className={`${
              selectedContainer === "Verified Mechanic"
                ? "BoxContainer"
                : "show"
            }`}
          >
            <DashMechVerified MechDetails={MechDetails} />
          </div>
          <div
            className={`${
              selectedContainer === "Blocked Mechanic" ? "BoxContainer" : "show"
            }`}
          >
            <DashMechBlocked MechDetails={MechDetails} />
          </div>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default Admin;
