"use client";
import React, { useEffect, useState } from "react";
import MechCard from "../MechCard";
import { useRouter } from "next/navigation";
import calcDistance from "../../LocationFunctions/calcDistance";
import getUserLocation from "../../LocationFunctions/userLocation";
import getDateTime from "@/app/components/getDateTime";
import cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MechanicDataType(props) {
  const [Mechdatalist, setMechdatalist] = useState([]);
  const [filteredMechData, setFilteredMechData] = useState([]);
  const [Coords, setCoords] = useState([]);

  const DistanceRange = 25;
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const position = await getUserLocation();
        setCoords(position);
      } catch (error) {
        toast.warning("Error in getting location:", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    }
    fetchData();
  }, []);

  const desiredType = props.params.type[0];
  const VehicleType = props.params.type[1];
  const sCoords = {
    latitude: Coords[0],
    longitude: Coords[1],
  };

  const fetchMechData = async () => {
    try {
      const response = await fetch("/api/mechanicdetails");
      const data = await response.json();

      if (data.success) {
        setMechdatalist(data.result);
      }
    } catch (error) {
      console.log("Error fetching mechanic data:");
      // toast.error("Network Error", {
      //   position: toast.POSITION.BOTTOM_CENTER,
      // });
    }
  };

  useEffect(() => {
    fetchMechData();
  }, [Mechdatalist]);

  const updateMech = async (mechid, value, action) => {
    try {
      let update;
      if (action === "userDetails") {
        update = { $push: { UserArray: value } };
      } else if (action === "feedbackArray") {
        update = { $push: { UserFeedback: value } };
      } else {
        update = {
          $pull: {
            UserArray: { _id: value },
          },
        };
      }

      const response = await fetch(
        `/api/mechanicdetails/${mechid}`,
        {
          method: "PUT",
          body: JSON.stringify(update),
        }
      );

      const mechData = await response.json();
      if (mechData.result) {
        toast.success("Request Successfully!!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      } else {
        toast.error("Request Failed", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    } catch (error) {
      console.log("Error updating mechanic data:");
      // toast.error("Network Error", {
      //   position: toast.POSITION.BOTTOM_CENTER,
      // });
    }
  };

  const handleConnectMech = (data) => {
    const userid = cookies.get("userid");
    const userName = cookies.get("userName");
    const userPhone = cookies.get("userPhone");
    const userDetails = {
      Id: userid,
      Name: userName,
      PhoneNo: userPhone,
      Latitude: Coords[0],
      Longitude: Coords[1],
      Distance: data.distance,
      Status: "Pending",
      Query:"",
      Time: getDateTime(),
    };
    updateMech(data.mechId, userDetails, "userDetails");
  };

  function delay(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  const handleCancelMech = (data) => {
    updateMech(data.mechId, data.userId, "pull");
    delay(2000) // Delay for 2 seconds (2000 milliseconds)
      .then(() => {
        router.refresh();
      });
  };

  const handleFeedback = (data) => {
    const feedbackArray = {
      UserId: data.userId,
      Feedback: data.feedback,
      Rating: data.rating,
      DateTime: getDateTime(),
    };

    updateMech(data.mechId, feedbackArray, "feedbackArray");
  };

  useEffect(() => {
    // Filter and map Mechdatalist whenever Mechdatalist changes
    const updatedFilteredMechData = Mechdatalist.filter((item) => {
      const dCoords = {
        latitude: item.Latitude,
        longitude: item.Longitude,
      };
      const dist = calcDistance(sCoords, dCoords).toFixed(2);

      return (
        item.MechType == desiredType &&
        dist < DistanceRange &&
        item.Status === "Verified" &&
        (VehicleType === undefined ||
          (desiredType === "Engine" && VehicleType === item.VehicleType))
      );
    });

    // Update the filteredMechData state
    setFilteredMechData(updatedFilteredMechData);
  }, [Mechdatalist]);

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
            serviceCharge={item.MinimumCharge}
            address={item.Address}
            nearby={calcDistance(sCoords, {
              latitude: item.Latitude,
              longitude: item.Longitude,
            }).toFixed(2)}
            userList={item.UserArray}
            feedbackList={item.UserFeedback}
            onConnectMech={handleConnectMech}
            onCancelMech={handleCancelMech}
            onFeedback={handleFeedback}
          />
        ))}
      </div>
      <ToastContainer />
    </>
  );
}
