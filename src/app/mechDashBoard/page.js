"use client";
import { useState, useEffect } from "react";
import "./mechDashBoard.css";
import UserCard from "./usercard";
import cookies from "js-cookie";
import getDateTime from "../components/getDateTime";
import DirectionsMap from "../components/DirectionsMap";
import getUserLocation from "../home/LocationFunctions/userLocation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MechDashBoard = () => {
  const [MechDetails, setMechDetails] = useState([]);
  const [DateTime, setDateTime] = useState();
  const [mapStatus, setMapStatus] = useState(null);
  const [sCoords, setCoords] = useState({});
  const [desCoords, setDesCoords] = useState({});
  const [pendingCount, setPendingCount] = useState(0);
  const [declinedCount, setDeclinedCount] = useState(0);
  const [acceptedCount, setAcceptedCount] = useState(0);

  const mechid = cookies.get("mechid");

  useEffect(() => {
    getUserLocation()
      .then((position) => {
        setCoords({
          lat: position[0],
          lng: position[1],
        });
        // console.log(position);
      })
      .catch((error) => {
        // console.error("Error getting location:", error);
        toast.warning("Error in getting location:", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/mechanicdetails/${mechid}`
        );
        const data = await response.json();

        if (data.success) {
          setMechDetails(data.result.UserArray);
        } else {
          // console.error("Data retrieval was not successful");
          toast.error("Data retrieval was unsuccessful", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      } catch (error) {
        // console.error("Error fetching data:", error);
        toast.error("Request Failed", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    };
    fetchData();

    const Date = getDateTime().split(" ")[0];
    setDateTime(Date);
    filterAndCountStatus();
  }, [MechDetails]);


  const filterAndCountStatus = () => {
    const filteredData = MechDetails.filter((item) => {
      return String(item.Time).split(" ")[0] === DateTime.split(" ")[0];
    });

    let pending = 0;
    let declined = 0;

    if (filteredData.length > 0) {
      filteredData.forEach((item) => {
        if (item.Status === "Pending") {
          pending++;
        } else if (item.Status === "Cancelled") {
          declined++;
        }
      });
    }

    setPendingCount(pending);
    setDeclinedCount(declined);
    setAcceptedCount(filteredData.length - (pending + declined))
  };

  const updateMech = async (Mid, value) => {
    const update = {
      $set: {
        "UserArray.$[elem].Status": value.Status,
      },
    };

    const options = {
      arrayFilters: [{ "elem._id": value.userId }],
    };
    let mechData = await fetch(
      `/api/mechanicdetails/${Mid}`,
      {
        method: "PUT",
        body: JSON.stringify({ update, options }),
      }
    );

    mechData = await mechData.json();

    if (mechData.result) {
      // alert("User Status has been Updated");
      toast.success("Request Successfully!!", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  const handleAccept = (data) => {
    updateMech(mechid, data);
  };

  const handleStart = (data) => {
    updateMech(mechid, data);
  };

  const handleComplete = (data) => {
    updateMech(mechid, data);
  };

  const getmapstatus = (data) => {
    setMapStatus(data);
  };

  const getuserCoords = (data) => {
    setDesCoords({
      lat: parseFloat(data.lat),
      lng: parseFloat(data.lng),
    });
    // console.log(data)
  };

  const updateUser = async (userid, value) => {
    let update = { $push: { MechFeedback: value } };

    let userData = await fetch(
      `/api/userdetails/${userid}`,
      {
        method: "PUT",
        body: JSON.stringify(update),
      }
    );
    userData = await userData.json();
    if (userData.result) {
      // alert("User feedback As been Updated");
      toast.success("Request Successfully!!", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };
  const handleFeedback = (data) => {
    const feedbackArray = {
      MechId: mechid,
      Feedback: data.feedback,
      Rating: data.rating,
      DateTime: getDateTime(),
    };
    updateUser(data.userId, feedbackArray);
  };

  // Filter the data
  const filteredMechDetails = MechDetails.filter(
    (item) =>
      item.Status !== "Completed" && item.Status !== "Cancelled" &&
      item.Status !== "Request Closed" &&
      String(item.Time).split(" ")[0] === DateTime.split(" ")[0]
  ).reverse();
  return (
    <div className="mech-dashboard">
      <div className="mech-details">
        <div className="request-details">
          <div className="details">
            <h3>Pending</h3>
            <h2>{pendingCount}</h2>
          </div>
          <div className="details">
            <h3>Accepted</h3>
            <h2>{acceptedCount}</h2>
          </div>
        </div>
        <div className="request-details">
          <div className="details">
            <h3>Declined</h3>
            <h2>{declinedCount}</h2>
          </div>
          <div className="details">
            <h3>Date</h3>
            <h2>{DateTime}</h2>
          </div>
        </div>
      </div>
      <div className="users-list">
        {filteredMechDetails.length === 0 ? (
          <h1>No data Found</h1>
        ) : (
          filteredMechDetails.map((item, index) => (
            <UserCard
              key={index}
              id={item._id}
              keyId={item.Id}
              name={item.Name}
              phoneNo={item.PhoneNo}
              status={item.Status}
              query={item.Query}
              distance={item.Distance}
              time={item.Time}
              userLat={item.Latitude}
              userLng={item.Longitude}
              onAccept={handleAccept}
              onStart={handleStart}
              onComplete={handleComplete}
              onFeedback={handleFeedback}
              onTheWay={getmapstatus}
              getUserCoords={getuserCoords}
            />
          ))
        )}
      </div>
      {mapStatus == "On the Way" && (
        <div className="map-container">
          <h1>Google Maps Directions</h1>
          <DirectionsMap origin={sCoords} destination={desCoords} />
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default MechDashBoard;
