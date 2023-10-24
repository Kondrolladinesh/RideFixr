"use client";

import { useEffect, useState } from "react";
import "../home.css";
import MechCard from "./MechCard";
import calcDistance from "../LocationFunctions/calcDistance";
// import NavWithAccess from "@/app/components/NavWithAccess";

const MechanicData = () => {
  const [Mechdatalist, setMechdatalist] = useState([]);
  const [filteredMechData, setFilteredMechData] = useState([]);
  const [Coords, setCoords] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const position = await getUserLocation();
        setCoords(position);
      } catch (error) {
        console.error("Error getting location:", error);
      }
    }

    fetchData();
  }, []);

  const sCoords = {
    latitude: Coords[0],
    longitude: Coords[1],
  };

  const Mechdata = async () => {
    let data = await fetch("http://localhost:3000/api/mechanicdetails");
    data = await data.json();
    if (data.success) {
      setMechdatalist(data.result);
    }
  };
  useEffect(() => {
    Mechdata();
  }, [Mechdatalist]);

  useEffect(() => {
    // Filter and map Mechdatalist whenever Mechdatalist changes
    const updatedFilteredMechData = Mechdatalist.filter((item) => {
      return (
        item.Status === "Verified"
      );
    });
  
    // Update the filteredMechData state
    setFilteredMechData(updatedFilteredMechData);
  }, [Mechdatalist]);

  const handleConnectMech = (data) => {
    alert("Please Visit the defined Page")
  };

  const handleCancelMech = (data) => {
    alert("Please Visit the defined Page")
  };

  const handleFeedback = (data) => {
    alert("Please Visit the defined Page")
  };

  return (
    <>
      <div className="adjust-mech">
      {filteredMechData.map((item, index) => (
          <MechCard
            key={index}
            id={item._id}
            name={item.UserName}
            phoneNo={item.PhoneNo}
            service={item.MechType}
            address={item.Address}
            nearby={calcDistance(sCoords, { latitude: item.Latitude, longitude: item.Longitude }).toFixed(2)}
            userList={item.UserArray}
            feedbackList={item.UserFeedback}
            onConnectMech={handleConnectMech}
            onCancelMech={handleCancelMech}
            onFeedback={handleFeedback}
          />
        ))}
      </div>
    </>
  );
};

export default MechanicData;
