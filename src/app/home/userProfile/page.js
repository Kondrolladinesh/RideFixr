"use client";
import { useState, useEffect } from "react";
import "../../mechDashBoard/profilePage/profilePage.css";
import { useRouter } from "next/navigation";
import { getUserDetails } from "./getUserData";
import cookies from "js-cookie";
import Image from "next/image";
import { FaEdit, FaArrowCircleLeft } from "react-icons/fa";
import { FiSave, FiXSquare } from "react-icons/fi";
import { updateUserProfileImage } from "./userProfileUrlAPI";

const UserProfile = () => {
  const [UserName, setUserName] = useState("");
  const [Email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [PhoneNo, setPhoneNo] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [changed, setIsChanged] = useState(false);

  const router = useRouter();
  const userid = cookies.get("userid");

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userData = await getUserDetails();
      setUserName(userData.UserName);
      setEmail(userData.Email);
      // setPassword(userData.Password);
      setPhoneNo(userData.PhoneNo);
    };
    fetchUserDetails();
    FindprofileOfUser();
  }, [changed]);

  const FindprofileOfUser = async () => {
    try {
      const response = await fetch(`/api/userprofiles/${userid}`);
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

  const updateUser = async () => {
    
    // const Password = await bcrypt.hash(password, 10);
    try {
      const response = await fetch(
        `/api/userdetails/${userid}`,
        {
          method: "PUT",
          body: JSON.stringify({ UserName, Email, PhoneNo }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const userData = await response.json();

      if (userData.result) {
        toast.success("Successfully Updated!!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      } else {
        alert("Failed to update user data");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const reader = new FileReader();       // Create a new FileReader
      reader.onload = async function (e) {   // Set up an event listener for when the FileReader has read the file
        const base64Data = e.target.result;   // The result property contains the base64-encoded data
        try {
          const updatedSuccessfully = await updateUserProfileImage(userid, base64Data);

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
      reader.readAsDataURL(selectedFile);    // Read the selected file as a data URL
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

  //To Edit
  const ToEdit = (e) => {
    e.preventDefault();
    setIsEditable(true);
  };

  // Block Edit
  const BlockEdit = () => {
    setIsEditable(false);
  };

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
            <h1>{UserName.toUpperCase()}</h1>
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
          {isEditable && (
            <div className="button-panel">
              <button type="submit" onClick={updateUser}>
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
            <button
              type="button"
              onClick={() => {
                router.push("/home"); // Navigate back
              }}
            >
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
