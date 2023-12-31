"use client";
import { useEffect, useState } from "react";
import "../home.css";
import { MdOutlineConnectWithoutContact } from "react-icons/md";
import { GrStatusCriticalSmall, GrFormClose } from "react-icons/gr";
import { FaTimes, FaCopy, FaFacebookMessenger } from "react-icons/fa";
import { PiUserCircleFill } from "react-icons/pi";
import { RiMapPinUserFill } from "react-icons/ri";
import cookies from "js-cookie";
import Modal from "react-modal";
import StarRating from "@/app/components/StarRating";
import getDateTime from "@/app/components/getDateTime";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import DirectionsMap from "@/app/components/DirectionsMap";

const MechCard = ({
  id,
  name,
  phoneNo,
  service,
  serviceCharge,
  address,
  nearby,
  userList,
  feedbackList,
  sCoords,
  dCoords,
  onConnectMech,
  onCancelMech,
  onFeedback,
}) => {
  const [userStatus, setUserStatus] = useState();
  const [activeProfile, setActiveProfile] = useState(false);
  const [activeQuery, setActiveQuery] = useState(false);
  const [activeMap, setActiveMap] = useState(false);
  const [feedBack, setFeedBack] = useState("");
  const [Query, setQuery] = useState("");
  const [userID, setUserID] = useState();
  const [userObjectID, setUserObjectID] = useState();
  const [cancelled, setCancelled] = useState();
  const [rating, setRating] = useState(0);
  const [MechanicRating, setMechanicRating] = useState(0);
  const [pdfUrl, setPdfUrl] = useState("");

  const userid = cookies.get("userid");
  useEffect(() => {
    try {
      const currentDate = getDateTime().split(" ");
      const reversedUserList = [...userList].reverse(); // Create a reversed copy of the userList array
      const userEntry = reversedUserList.find(
        (item) =>
          item.Id === userid && item.Time.split(" ")[0] === currentDate[0]
      );
      // console.log(userEntry);
      if (userEntry) {
        setUserStatus(userEntry.Status);
        setUserID(userEntry.Id);
        setUserObjectID(userEntry._id);
      } else {
        setUserStatus(null);
      }
    } catch (error) {
      console.log("An error occurred in the useEffect:");
    }
  }, [userList, userStatus]);

  function calculateAverageRating(mechanicDetails) {
    if (!mechanicDetails || mechanicDetails.length === 0) {
      return 0; // No ratings available
    }

    const totalRating = mechanicDetails.reduce(
      (acc, item) => acc + item.Rating,
      0
    );
    const averageRating = totalRating / mechanicDetails.length;
    return averageRating;
  }

  useEffect(() => {
    // console.log(feedbackList);
    const averageRating = calculateAverageRating(feedbackList);
    setMechanicRating(averageRating);
  }, [feedbackList]);

  const convertToStars = (rating) => {
    const starIcons = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        starIcons.push(
          <span key={i} className="full-star">
            &#9733;
          </span>
        ); // Full star (★)
      } else {
        starIcons.push(
          <span key={i} className="empty-star">
            &#9734;
          </span>
        ); // Empty star (☆)
      }
    }
    return starIcons;
  };

  const handleConnect = () => {
    const user = {
      mechId: id,
      distance: nearby,
    };
    onConnectMech(user);
  };
  const handleCancle = () => {
    const user = {
      userId: userObjectID,
      mechId: id,
    };
    onCancelMech(user);
    setCancelled("cancel");
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
      mechId: id,
      userId: userID,
      feedback: feedBack,
      rating: rating,
    };
    onFeedback(feedback);
    setActiveProfile(!activeProfile);
  };

  const getQuery = (e) => {
    e.preventDefault();
    const req = {
      userId: userid,
      query: Query,
    };
    updateMech(id, req, false);
    setActiveQuery(!activeQuery);
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleRequestClose = () => {
    const req = {
      userId: userid,
      Status: "Request Closed",
    };
    updateMech(id, req, true);
  };

  const updateMech = async (Mid, value, check) => {
    const update = {
      $set: check
        ? {
            "UserArray.$[elem].Status": value.Status,
          }
        : {
            "UserArray.$[elem].Query": value.query,
          },
    };

    const options = {
      arrayFilters: [{ "elem.Id": value.userId }],
    };
    let mechData = await fetch(`/api/mechanicdetails/${Mid}`, {
      method: "PUT",
      body: JSON.stringify({ update, options }),
    });

    mechData = await mechData.json();

    if (mechData.result) {
      toast.success("Request Successfully!!", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  const handleCopyToClipboard = (textToCopy) => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        // console.log('Phone number copied to clipboard');
        toast("Number Copied", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      })
      .catch((error) => {
        console.error("Failed to copy phone number: ", error);
      });
  };

  const FindprofileOfUser = async () => {
    try {
      const response = await fetch(`/api/mechprofiles/${id}`);
      if (response.ok) {
        const profileData = await response.json();
        // setPdfUrl(base64ToImageUrl(userData.result.ProfileUrl));
        if (profileData.result && profileData.result.ProfileUrl) {
          setPdfUrl(base64ToImageUrl(profileData.result.ProfileUrl));
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

  useEffect(() => {
    FindprofileOfUser();
  }, []);

  // console.log(sCoords)
  // console.log(dCoords)
  return (
    <div className="Mech-card-container">
      <div className="Mech-card">
        <div className="profile-panel">
          {/* <PiUserCircleFill className="profile-icon" /> */}
          <Image
            src={pdfUrl || "/draft_user_profile_icon.png"}
            alt="User Profile"
            width={90}
            height={90}
            style={{ borderRadius: "50%", transform: "scale(1.1)" }}
          />
        </div>
        <div className="details-panel">
          <div className="mech_details">
            <h4>Name:</h4>
            <h4>{name}</h4>
          </div>
          <div className="mech_details">
            <h5>Number:</h5>
            <h5>
              {phoneNo}
              <span
                className="copy-icon"
                onClick={() => handleCopyToClipboard(phoneNo)}
              >
                <FaCopy style={{ marginLeft: "4px", color: "black" }} />
              </span>
            </h5>
          </div>
          <div className="mech_details">
            <h6>MechType:</h6>
            <h6>{service}</h6>
          </div>
          <div className="mech_details">
            <h6>Address:</h6>
            <h6>{address}</h6>
          </div>
          <div className="mech_details">
            <h6>Near By:</h6>
            <h6>{nearby} Kms</h6>
          </div>
          <div className="mech_details">
            <h6>Service Charge:</h6>
            <h6 className="h6_Style">{serviceCharge} Rs</h6>
          </div>
          <div className="mech_details">
            <h6>Transport Charge:</h6>
            <h6 className="h6_Style">
              {nearby < 4 ? 0 : (nearby * 6).toFixed(0)} Rs
            </h6>
          </div>
          <div className="mech_details">
            <h6>Rating:</h6>
            <div>{convertToStars(MechanicRating)}</div>
          </div>
        </div>
        <div>
          <MdOutlineConnectWithoutContact
            className="connect-icon"
            onClick={handleConnect}
          />
        </div>
      </div>
      {userStatus != null && (
        <>
          {(userStatus == "Pending" ||
            userStatus == "Getting prepared" ||
            userStatus == "On the Way") && (
            <div className="mech-process">
              <div>
                <GrStatusCriticalSmall />
                <h3>Status: {userStatus}</h3>
              </div>
              {userStatus == "Pending" && (
                <div onClick={handleQuery}>
                  <FaFacebookMessenger className="icon" />
                  Query
                </div>
              )}
              {userStatus == "On the Way" && (
                <div
                  onClick={() => setActiveMap(!activeMap)}
                  className="map-box"
                >
                  <RiMapPinUserFill className="icon" />
                </div>
              )}
              <button className="Cancel" onClick={handleCancle}>
                Cancel
              </button>
            </div>
          )}
          {(userStatus == "Completed" || userStatus == "Cancelled") && (
            <div className="mech-process">
              <div>
                <GrStatusCriticalSmall />
                <h3>Status: {userStatus}</h3>
              </div>
              <button className="feedback" onClick={handleFeedback}>
                Feedback
              </button>
              <GrFormClose className="icon" onClick={handleRequestClose} />
            </div>
          )}
        </>
      )}
      <Modal
        backdrop="transparent"
        isOpen={activeQuery}
        onRequestClose={() => setActiveQuery(!activeQuery)}
        className="feedback-modal"
      >
        <div className="cancel-icon">
          <FaTimes size={24} onClick={() => setActiveQuery(!activeQuery)} />
        </div>
        <div className="feedback-container">
          <h2>Your Query is Valuable to us..</h2>
          <form onSubmit={getQuery}>
            <textarea
              id="Query"
              type="text"
              className="feedback-input"
              placeholder="Valuable Query to identify the problem"
              onChange={(e) => setQuery(e.target.value)}
              required
              autoComplete="off"
            />
            <button type="submit">Submit</button>
          </form>
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
      <Modal
        backdrop="transparent"
        isOpen={activeMap}
        onRequestClose={() => setActiveMap(!activeMap)}
        className="map-modal"
      >
        <div className="cancel-icon">
          <FaTimes size={24} onClick={() => setActiveMap(!activeMap)} />
        </div>
        <div className="map-container">
          <h2>Google Maps Directions</h2>
          <DirectionsMap origin={dCoords} destination={sCoords} />
        </div>
      </Modal>
      <ToastContainer limit={2} />
    </div>
  );
};

export default MechCard;
