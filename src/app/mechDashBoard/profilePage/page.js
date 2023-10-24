"use client";
import { useState, useEffect } from "react";
import "./profilePage.css";
import { useRouter } from "next/navigation";
import cookies from "js-cookie";
import { getMechanicDetails } from "./getMechanicDetails";
import Image from "next/image";
import { FaEdit, FaArrowCircleLeft } from "react-icons/fa";
import { FiSave, FiXSquare } from "react-icons/fi";
import { FcApproval } from "react-icons/fc";
import { updateMechProfileImage } from "./mechProfileUrlAPI";
import codeAddress from "@/app/home/LocationFunctions/AddressToLocation";
import bcrypt from "bcryptjs";

const UserProfile = () => {
  const [UserName, setUserName] = useState("");
  const [Email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [PhoneNo, setPhoneNo] = useState("");
  const [Address, setAddress] = useState("");
  const [City, setCity] = useState("");
  const [State, setState] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [changed, setIsChanged] = useState(false);

  const router = useRouter();
  const mechid = cookies.get("mechid");

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userData = await getMechanicDetails();
      setUserName(userData.UserName);
      setEmail(userData.Email);
      // setPassword(userData.Password);
      setPhoneNo(userData.PhoneNo);
      setAddress(userData.Address);
      setCity(userData.City);
      setState(userData.State);
    };
    fetchUserDetails();
    FindprofileOfMech();
  }, [changed]);

  const FindprofileOfMech = async () => {
    try {
      const response = await fetch(
        `/api/mechprofiles/${mechid}`
      );
      if (response.ok) {
        const userData = await response.json();
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

  const updateMech = async () => {
    const location = await codeAddress(
      Address == City ? Address + State : Address + City + State
    );
    const Latitude = location.lat;
    const Longitude = location.lng;
    // const Password = await bcrypt.hash(password, 10);
    let userData = await fetch(
      "/api/mechanicdetails/" + mechid,
      {
        method: "PUT",
        body: JSON.stringify({
          UserName,
          Email,
          PhoneNo,
          Address,
          City,
          State,
          Latitude,
          Longitude,
        }),
      }
    );
    userData = await userData.json();
    if (userData.result) {
      toast.success("Successfully Updated!!", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };
  //To Edit
  const ToEdit = (e) => {
    e.preventDefault();
    setIsEditable(true);
  };

  // Block Edit
  const BlockEdit = () => {
    setIsEditable(false);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const reader = new FileReader(); // Create a new FileReader
      reader.onload = async function (e) {
        // Set up an event listener for when the FileReader has read the file
        const base64Data = e.target.result; // The result property contains the base64-encoded data
        try {
          const updatedSuccessfully = await updateMechProfileImage(
            mechid,
            base64Data
          );

          if (updatedSuccessfully) {
            console.log("User profile image updated/created successfully.");
            setIsChanged(!changed);
          } else {
            console.error("User profile image update/creation failed.");
          }
        } catch (error) {
          console.error(error.message);
        }
      };
      reader.readAsDataURL(selectedFile); // Read the selected file as a data URL
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
    <div className="profile-main">
      <div className="form-div">
        <form className="form">
          <div className="panel-1">
            <div className="user_profile">
              <label htmlFor="file-upload" className="custom-image-upload">
                <Image
                  src={pdfUrl || "/draft_user_profile_icon.png"}
                  alt="User Profile"
                  width={80}
                  height={80}
                  style={{ borderRadius: "50%", transform: "scale(1.1)" }}
                />
              </label>
              <input
                type="file"
                label="Image"
                name="myFile"
                id="file-upload"
                accept=".jpeg, .png, .jpg"
                onChange={(e) => handleFileUpload(e)}
              />
            </div>
            <div className="panel-username">
              <h1>{UserName.toUpperCase()}</h1> <FcApproval className="icon" />
            </div>
          </div>
          <div className="panel-2">
            <h3>User Details</h3>
            <div className="input-panel">
              <label>UserName:</label>
              {isEditable ? (
                <input
                  type="text"
                  placeholder="User Name"
                  value={UserName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  autoComplete="off"
                />
              ) : (
                <span>{UserName}</span>
              )}
            </div>
            <div className="input-panel">
              <label>Email:</label>
              {isEditable ? (
                <input
                  type="email"
                  placeholder="Email"
                  value={Email}
                  onChange={(e) => setEmail(e.target.value)}
                  readOnly={!isEditable}
                  required
                  autoComplete="off"
                />
              ) : (
                <span>{Email}</span>
              )}
            </div>
            {/* <div className="input-panel">
              {isEditable ? (
                <>
                  <label>Password:</label>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    readOnly={!isEditable}
                    required
                    autoComplete="off"
                  />
                </>
              ) : null}
            </div> */}
            <div className="input-panel">
              <label>Phone:</label>
              {isEditable ? (
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={PhoneNo}
                  onChange={(e) => setPhoneNo(e.target.value)}
                  readOnly={!isEditable}
                  required
                  autoComplete="off"
                />
              ) : (
                <span>{PhoneNo}</span>
              )}
            </div>
            <div className="input-panel">
              <label>Address:</label>
              {isEditable ? (
                <input
                  type="text"
                  placeholder="Address"
                  value={Address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  autoComplete="off"
                />
              ) : (
                <span>{Address}</span>
              )}
            </div>
            <div className="input-panel">
              <label>City:</label>
              {isEditable ? (
                <input
                  type="text"
                  placeholder="City"
                  value={City}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  autoComplete="off"
                />
              ) : (
                <span>{City}</span>
              )}
            </div>
            <div className="input-panel">
              <label>State:</label>
              {isEditable ? (
                <input
                  type="text"
                  placeholder="City"
                  value={State}
                  onChange={(e) => setState(e.target.value)}
                  required
                  autoComplete="off"
                />
              ) : (
                <span>{State}</span>
              )}
            </div>
            {isEditable && (
              <div className="button-panel">
                <button onClick={updateMech}>
                  <FiSave /> Save
                </button>
                <button onClick={BlockEdit}>
                  Cancel <FiXSquare />
                </button>
              </div>
            )}
          </div>
        </form>
        {!isEditable && (
          <div className="button-panel">
            <button onClick={() => router.push("/mechDashBoard")}>
              <FaArrowCircleLeft /> Go Back
            </button>
            <button onClick={(e) => ToEdit(e)}>
              Edit <FaEdit />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default UserProfile;
