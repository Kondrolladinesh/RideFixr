"use client";
import { useEffect, useState } from "react";
import "./mechDashBoard.css";
import {
  FaUserCircle,
  FaUser,
  FaPhoneAlt,
  FaRegClock,
  FaTimes,
} from "react-icons/fa";
import { GrStatusCriticalSmall } from "react-icons/gr";
import { GiPathDistance } from "react-icons/gi";
import Modal from "react-modal";
import StarRating from "../components/StarRating";
import Image from "next/image";

const UserCard = ({
  id,
  keyId,
  name,
  phoneNo,
  status,
  query,
  distance,
  time,
  userLat,
  userLng,
  onAccept,
  onStart,
  onComplete,
  onFeedback,
  onTheWay,
  getUserCoords,
}) => {
  const [activeProfile, setActiveProfile] = useState(false);
  const [feedBack, setFeedBack] = useState("");
  const [rating, setRating] = useState(0);
  const [pdfUrl, setPdfUrl] = useState("");
  const [activeQuery, setActiveQuery] = useState(false);

  useEffect(() => {
    onTheWay(status);
    const Coords = {
      lat: userLat,
      lng: userLng,
    };
    getUserCoords(Coords);
  }, [status]);

  const handleAccept = () => {
    const user = {
      userId: id,
      Status: "Getting prepared",
    };
    onAccept(user);
  };
  const handleStart = () => {
    const user = {
      userId: id,
      Status: "On the Way",
    };
    onStart(user);
  };

  const handleDeclined = () => {
    const user = {
      userId: id,
      Status: "Cancelled",
    };
    onComplete(user);
  };

  const handleClose = () => {
    const user = {
      userId: id,
      Status: "Completed",
    };
    onComplete(user);
  };

  const handleFeedback = () => {
    setActiveProfile(!activeProfile);
  };

  const handleQuery = () => {
    setActiveQuery(!activeQuery);
  };

  const getFeedback = (e) => {
    e.preventDefault();
    const feedback = {
      userId: keyId,
      feedback: feedBack,
      rating: rating,
    };
    onFeedback(feedback);
    setActiveProfile(!activeProfile);
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  useEffect(() => {
    FindprofileOfUser();
  }, []);

  const FindprofileOfUser = async () => {
    try {
      const response = await fetch(
        `/api/userprofiles/${keyId}`
      );
      if (response.ok) {
        const userData = await response.json();
        // setPdfUrl(base64ToImageUrl(userData.result.ProfileUrl));
        if (userData.result && userData.result.ProfileUrl) {
          setPdfUrl(base64ToImageUrl(userData.result.ProfileUrl));
        }
      } else {
        console.error("Data retrieval was not successful");
      }
    } catch (error) {
      console.error("Error in getUserDetails:", error);
      throw error;
    }
  };

  function base64ToImageUrl(base64Data) {
    const parts = base64Data.split(","); // Split the data URL by ","

    if (parts.length === 2) {
      const mimeType = parts[0].match(/:(.*?);/)[1]; // Extract the MIME type
      const base64 = parts[1]; // Extract the base64 data
      const uint8Array = new Uint8Array( // Convert base64 to Uint8Array
        atob(base64)
          .split("")
          .map((char) => char.charCodeAt(0))
      );

      const blob = new Blob([uint8Array], { type: mimeType }); // Create a Blob with the Uint8Array data
      return URL.createObjectURL(blob); // Create a URL for the Blob
    } else {
      console.error("Invalid base64 data URL format");
      return null;
    }
  }

  return (
    <div className="userCard">
      <div className="user-profile">
        {/* <FaUserCircle className="user-icon" /> */}
        <Image
          src={pdfUrl || "/draft_user_profile_icon.png"}
          alt="User Profile"
          width={60}
          height={60}
          style={{ borderRadius: "50%", transform: "scale(1.1)" }}
        />
      </div>
      <div className="user-details">
        <div>
          <FaUser />
          <h2>{name}</h2>
        </div>
        <div>
          <FaPhoneAlt />
          <h3>{phoneNo}</h3>
        </div>
        <div>
          <GiPathDistance />
          <h4>{distance} Km</h4>
        </div>
        <div>
          <FaRegClock />
          <h4>{time}</h4>
        </div>
      </div>
      <div className="user-Status">
        <GrStatusCriticalSmall />
        <h3>{status}</h3>
      </div>
      <div className="user-buttons">
        {status == "Pending" && (
          <div className="pending">
            <button className="MASJ" onClick={handleQuery}>
              View Query
            </button>
            <button className="Accept" onClick={handleAccept}>
              Accept
            </button>
            <button className="Decline" onClick={handleDeclined}>
              Decline
            </button>
          </div>
        )}
        {status == "Getting prepared" && (
          <button className="MASJ" onClick={handleStart}>
            Mark As Started Journey
          </button>
        )}
        {status == "On the Way" && (
          <div className="complete">
            <button className="feedback" onClick={handleFeedback}>
              Feedback
            </button>
            <button className="MASJ" onClick={handleClose}>
              Mark As Completed
            </button>
          </div>
        )}
      </div>
      <Modal
        backdrop="transparent"
        isOpen={activeQuery}
        onRequestClose={() => setActiveQuery(!activeQuery)}
        className="query-modal"
      >
        <div className="cancel-icon">
          <FaTimes size={24} onClick={() => setActiveQuery(!activeQuery)} />
        </div>
        <div className="feedback-container">
          <h2>User facing these Problem</h2>
          <div className="query-box">
            <p>{query}</p>
          </div>
        </div>
      </Modal>
      <Modal
        backdrop="transparent"
        isOpen={activeProfile}
        onRequestClose={() => setActiveProfile(!activeProfile)}
        className="feedback-modal"
      >
        <div className="cancel-icon">
          <FaTimes size={24} onClick={() => setActiveProfile(!activeProfile)} />
        </div>
        <div className="feedback-container">
          <h2>Your input is Valuable to us..</h2>
          <form onSubmit={getFeedback}>
            <div className="Rating-div">
              <p>How would you rate your experience?</p>
              <StarRating rating={rating} onRatingChange={handleRatingChange} />
            </div>
            <label for="feedback">Tell us what you think:</label>
            <textarea
              id="feedback"
              type="text"
              className="feedback-input"
              placeholder="Valuable Feedback"
              onChange={(e) => setFeedBack(e.target.value)}
              required
              autoComplete="off"
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default UserCard;
