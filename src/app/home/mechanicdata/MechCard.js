"use client";
import { useEffect, useState } from "react";
import "../home.css";
import { MdOutlineConnectWithoutContact } from "react-icons/md";
import { GrStatusCriticalSmall, GrFormClose } from "react-icons/gr";
import { FaTimes, FaCopy } from "react-icons/fa";
import { PiUserCircleFill } from "react-icons/pi";
import cookies from "js-cookie";
import Modal from "react-modal";
import StarRating from "@/app/components/StarRating";
import getDateTime from "@/app/components/getDateTime";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MechCard = ({
  id,
  name,
  phoneNo,
  service,
  address,
  nearby,
  userList,
  feedbackList,
  onConnectMech,
  onCancelMech,
  onFeedback,
}) => {
  const [userStatus, setUserStatus] = useState();
  const [activeProfile, setActiveProfile] = useState(false);
  const [feedBack, setFeedBack] = useState("");
  const [userID, setUserID] = useState();
  const [userObjectID, setUserObjectID] = useState();
  const [cancelled, setCancelled] = useState();
  const [rating, setRating] = useState(0);
  const [MechanicRating, setMechanicRating] = useState(0);

  const userid = cookies.get("userid");
  useEffect(() => {
    try {
        const currentDate = getDateTime().split(" ");
        const reversedUserList = [...userList].reverse(); // Create a reversed copy of the userList array
        const userEntry = reversedUserList.find(
            (item) => item.Id === userid && item.Time.split(" ")[0] === currentDate[0]
        );
        // console.log(userEntry);
        if (userEntry) {
            setUserStatus(userEntry.Status);
            setUserID(userEntry.Id);
            setUserObjectID(userEntry._id);
        }else{
          setUserStatus(null);
        }
    } catch (error) {
        console.log("An error occurred in the useEffect:");
        // toast.error("Network Error", {
        //   position: toast.POSITION.BOTTOM_CENTER,
        // });
    }
}, [userList, userStatus]);

function calculateAverageRating(mechanicDetails) {
  if (!mechanicDetails || mechanicDetails.length === 0) {
    return 0; // No ratings available
  }

  const totalRating = mechanicDetails.reduce((acc, item) => acc + item.Rating, 0);
  const averageRating = totalRating / mechanicDetails.length;
  return averageRating;
}

useEffect(()=>{
  // console.log(feedbackList);
  const averageRating = calculateAverageRating(feedbackList);
  setMechanicRating(averageRating)
},[feedbackList])

const convertToStars = (rating) => {
  const starIcons = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      starIcons.push(<span key={i} className="full-star" >&#9733;</span>); // Full star (★)
    } else {
      starIcons.push(<span key={i} className="empty-star" >&#9734;</span>); // Empty star (☆)
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

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleRequestClose = () => {
    const req = {
      userId: userid,
      Status: "Request Closed",
    };
    updateMech(id, req);
  };

  const updateMech = async (Mid, value) => {
    const update = {
      $set: {
        "UserArray.$[elem].Status": value.Status,
      },
    };

    const options = {
      arrayFilters: [{ "elem.Id": value.userId }],
    };
    let mechData = await fetch(
      `http://localhost:3000/api/mechanicdetails/${Mid}`,
      {
        method: "PUT",
        body: JSON.stringify({ update, options }),
      }
    );

    mechData = await mechData.json();

    if (mechData.result) {
      alert("User Status has been Updated");
    }
  };

  const handleCopyToClipboard = (textToCopy) => {
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        // console.log('Phone number copied to clipboard');
        toast("Number Copied", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        // Optionally, you can show a notification or provide user feedback here
      })
      .catch((error) => {
        console.error('Failed to copy phone number: ', error);
      });
  };
  
  return (
    <div className="Mech-card-container">
      <div className="Mech-card">
        <div className="profile-panel">
          {/* <h4>profile</h4> */}
          <PiUserCircleFill className="profile-icon" />
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
                <FaCopy style={{marginLeft:"4px", color:"black"}}/>
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
            <h6>TCharge:</h6>
            <h6>{nearby < 4 ? 0 : (nearby * 6).toFixed(0)} Rs</h6>
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
      <ToastContainer limit={2}/>
    </div>
  );
};

export default MechCard;
