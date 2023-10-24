"use client";
import Link from "next/link";
import "./register.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import codeAddress from "../home/LocationFunctions/AddressToLocation";
import bcrypt from "bcryptjs";
import {FaFileUpload} from "react-icons/fa"


const Regester = () => {
  const router = useRouter();

  const [UserName, setUserName] = useState("");
  const [Email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [PhoneNo, setPhoneNo] = useState("");
  const [checkBox, setCheckBox] = useState(false);
  const [MechType, setMechType] = useState("");
  const [VehicleType, setVehicleType] = useState("");
  const [Address, setAddress] = useState("");
  const [City, setCity] = useState("");
  const [State, setState] = useState("");
  const [loading, setLoading] = useState(false);
  const [UploadFile, setUploadFile] = useState({ myFile : ""});
  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleCheckBoxChange = (e) => {
    setCheckBox(e.target.checked); // Set the value of the checkbox based on user interaction
  };

  const checkPasswordStrength = (password) => {
    // Define your password strength criteria here
    const strongRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

    if (strongRegex.test(password)) {
      setPasswordStrength("Strong");
      setPasswordError("");
    } else {
      setPasswordStrength("Weak");
      setPasswordError("min 8 characters");
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  const Adduser = async (e) => {
    e.preventDefault();
    // Hash the password before storing it
    const Password = await bcrypt.hash(password, 10);
    try {
      setLoading(true);
      if (checkBox) {
        const location = await codeAddress(Address == City ? Address + State : Address + City + State);
        const Latitude = location.lat;
        const Longitude = location.lng;
      
        // Step 1: Insert data into the first collection
        const response = await fetch("http://localhost:3000/api/mechanicdetails", {
          method: "POST",
          body: JSON.stringify({
            UserName,
            Email,
            Password,
            PhoneNo,
            MechType,
            VehicleType,
            Address,
            City,
            State,
            Latitude,
            Longitude,
            Status: "Pending",
            UserArray: [],
          }),
        });
      
        const result = await response.json();
        // console.log(result);
        if (result.existing) {
          alert(result.message);
          router.push("/login");
        } else if (result.existingUser) {
          alert(result.message);
          router.push("/login");
        } else {
          if (result.success) {
            // Step 2: Insert data into the second collection using the retrieved _id
            const MechId = result.result._id; // Assuming this is the _id of the first collection
            console.log(MechId)
            const response2 = await fetch("http://localhost:3000/api/mechanicPDF", {
              method: "POST",
              body: JSON.stringify({ MechId, UploadFile: UploadFile.myFile }),
            });
            const result2 = await response2.json();
      
            if (result2.success) {
              alert("It takes 24 hours to verify by admin");
              router.push("/login");
            } else {
              alert("Details Not added");
            }
          } else {
            alert("Details Not added");
          }
        }
      }
       else {
        let result = await fetch("http://localhost:3000/api/userdetails", {
          method: "POST",
          body: JSON.stringify({ UserName, Email, Password, PhoneNo}),
        });
        result = await result.json();
        if (result.existing) {
          alert(result.message);
          router.push("/login");
        }else if(result.existingMech){
          alert(result.message);
          router.push("/login");
        }else {
          if (result.success) {
            alert("New user Added");
            router.push("/login");
          } else {
            alert("Details Not added");
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Hide loading indicator when verification is done
    }
  };

  const handleFileUpload= async (e) =>{
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Create a new FileReader
      const reader = new FileReader();
  
      // Set up an event listener for when the FileReader has read the file
      reader.onload = function (e) {
        // The result property contains the base64-encoded data
        const base64Data = e.target.result;
        setUploadFile({...UploadFile,myFile: base64Data});
      };
  
      // Read the selected file as a data URL
      console.log(reader.readAsDataURL(selectedFile));
    }
  }

  return (
    <div className="register-main">
      <form className="register-form" onSubmit={Adduser}>
        <h1 className="heading">RideFixr</h1>
        <h3>Register</h3>
        <input
          type="text"
          className="input-class"
          placeholder="User Name"
          value={UserName}
          onChange={(e) => setUserName(e.target.value)}
          required
          autoComplete="off"
        />
        <input
          type="email"
          className="input-class"
          placeholder="Email"
          value={Email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="off"
        />
        <input
          type="password"
          className="input-class"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          required
          autoComplete="off"
        />
        <div className={passwordStrength ? "password-details" : "password-hide"}>
        {passwordStrength && (
          <div className="password-strength">
            Password Strength: {passwordStrength}
          </div>
        )}
        {passwordError && (
          <div className="password-error">{passwordError}</div>
        )}
        </div>
        <input
          type="tel"
          className="input-class"
          id="phone"
          name="phone"
          placeholder="Mobile Number"
          pattern="[0-9]{10}" // Pattern to allow only 10 digits
          maxLength="10"
          minLength="10"
          value={PhoneNo}
          onChange={(e) => {
            const numericPhoneNumber = e.target.value
              .replace(/\D/g, "")
              .substring(0, 10);
            setPhoneNo(numericPhoneNumber);
          }}
          required
          autoComplete="off"
        />
        {/* </div> */}
        <div className="mic-details">
          <input
            className="check-box"
            type="checkbox"
            placeholder="Check box"
            value={checkBox}
            onChange={handleCheckBoxChange}
          />
          <p>Are you a Mechanic</p>
        </div>
        {checkBox && (
          <div className="dropdown">
            <select
              id="dropdown"
              value={MechType}
              required
              onChange={(e) => setMechType(e.target.value)}
            >
              <option value="">Select Mechanic Type</option>
              <option value="Engine">Engine</option>
              <option value="Electric">Electric</option>
              <option value="Tyre">Tyre</option>
            </select>
            {MechType === "Engine" && (
              <select
                id="vehicleDropdown"
                value={VehicleType}
                required
                onChange={(e) => setVehicleType(e.target.value)}
              >
                <option value="">Select Vehicle Type</option>
                <option value="Bike">Motorcycle</option>
                <option value="Car">Car</option>
                <option value="Tractor">Tractor</option>
                <option value="Truck">Truck</option>
              </select>
            )}
            <label htmlFor="file-upload">
              <div className="upload-button"><FaFileUpload style={{marginLeft:"2px"}}/><p>Upload Document to verify as Mechanic</p></div>
            </label>
            <input
              type="file"
              lable ="file"
              name = "myFile"
              id="file-upload"
              accept ='.jpeg, .png, .jpg, .pdf'
              className="mech-input-class"
              onChange={(e) => handleFileUpload(e)}
              required
            />
            <input
              type="text"
              className="mech-input-class"
              placeholder="Address"
              value={Address}
              onChange={(e) => setAddress(e.target.value)}
              required
              autoComplete="off"
            />
            <input
              type="text"
              className="mech-input-class"
              placeholder="City"
              value={City}
              onChange={(e) => setCity(e.target.value)}
              required
              autoComplete="off"
            />
            <input
              type="text"
              className="mech-input-class"
              placeholder="State"
              value={State}
              onChange={(e) => setState(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
        )}
        {loading ? ( // Display loading indicator when loading is true
          // <div className="loader"></div>
          <img className="spinner" src="/gear_spinner.svg" alt="Spinner" />
        ) : (
          <button type="submit">Sign Up</button>
        )}
        <div className="next-page">
          <p>Already a member?</p>
          <Link href="/login">Sign In</Link>
        </div>
      </form>
    </div>
  );
};

export default Regester;
