"use client";
import Link from "next/link";
import { useState } from "react";
import "./forgotPassword.css";
import { SendMail } from "@/lib/SendMail";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import bcrypt from "bcryptjs";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [mechanic, setMechanic] = useState(false);
  const [userFound, setUserFound] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(null);
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState(null);
  const [APIUrl, setAPIUrl] = useState("");

  const router = useRouter();

  const isStrongPassword = (password) => {
    const strongPasswordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleRePasswordChange = (e) => {
    setRePassword(e.target.value);
  };

  const verifyData = async (e) => {
    e.preventDefault();
    let apiUrl;
    if (mechanic) {
      apiUrl = "/api/mechanicdetails";
    } else {
      apiUrl = "/api/userdetails";
    }

    try {
      const response = await fetch(apiUrl);
      setAPIUrl(apiUrl);
      if (!response.ok) {
        // Handle network error
        toast.error("Network Error", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        return;
      }

      const data = await response.json();

      if (data.success) {
        const foundItem = data.result.find((item) => item.Email === email);

        if (foundItem) {
          setUserFound(true);
          setUserId(foundItem._id);
          toast.success("User Found", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        } else {
          toast.error("Email Not Found", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          setUserFound(false);
        }
      }
    } catch (error) {
      toast.error("Network Error", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    const generatedOtp = generateOTP();
    const emailSubject = "Password Reset OTP";
    const emailText = `Your OTP for password reset: ${generatedOtp}`;

    const emailSent = await SendMail({
      to: email,
      subject: emailSubject,
      text: emailText,
    });

    if (emailSent) {
      Cookies.set("otp", generatedOtp, { expires: 3 / (24 * 60) });
      toast.success("OTP sent via email", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      setOtpSent(true);
    } else {
      toast.error("Failed to send OTP via email", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const savedOtp = Cookies.get("otp");
    if (otp === savedOtp) {
      setOtpVerified("verified");
      toast.success("OTP Verified", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else {
      setOtpVerified("notVerified");
      toast.error("Wrong OTP, Recheck", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  const resetUserPassword = async (e) => {
    e.preventDefault();
    if (newPassword === rePassword && isStrongPassword(newPassword)) {
      try {
        const Pass = await bcrypt.hash(newPassword, 10);
        const response = await fetch(APIUrl + `/${userId}`, {
          method: "PUT",
          body: JSON.stringify({
            Password: Pass,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          toast.success("Password Reset Successful", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          router.push("/login");
        } else {
          toast.error("Failed to Reset Password", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      } catch (error) {
        toast.error("Network Error", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    } else {
      toast.error("Password does not meet the requirements or does not match", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  return (
    <div className="login-main">
      <form className="reset-form">
        <div className="reset-heading">
          <h1 className="heading">RideFixr</h1>
          <h3>Reset Your password</h3>
        </div>
        <div className="login-details">
          {!otpSent && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          )}
          {otpVerified !== "verified" && otpSent && (
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          )}
          {otpVerified === "verified" && (
            <>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={handleNewPasswordChange}
                required
              />
              <input
                type="password"
                placeholder="Re-Enter password"
                value={rePassword}
                onChange={handleRePasswordChange}
                required
              />
              {!isStrongPassword(newPassword) && (
                <div className="error-message">
                  Password is not strong enough.
                </div>
              )}
              {newPassword !== "" &&
                rePassword !== "" &&
                newPassword !== rePassword && (
                  <div className="error-message">Passwords do not match.</div>
                )}
            </>
          )}
        </div>
        {!otpSent && (
          <div className="check-mechanic">
            {userFound ? null : ( // Conditional rendering: only show the checkbox if userFound is false
              <>
                <input
                  className="check-box"
                  type="checkbox"
                  placeholder="Check box"
                  value={mechanic}
                  onChange={() => setMechanic(!mechanic)}
                />
                <p>Are you a Mechanic</p>
              </>
            )}
          </div>
        )}
        <div className="next-page">
          {otpVerified === "verified" ? (
            <button type="submit" onClick={resetUserPassword}>
              Reset Password
            </button>
          ) : otpSent ? (
            <button type="submit" onClick={handleVerify}>
              Verify
            </button>
          ) : userFound ? (
            <button type="submit" onClick={sendOtp}>
              Send OTP
            </button>
          ) : (
            <>
              <button type="submit" onClick={verifyData}>
                Enter
              </button>
              <div>
                <p>Not a member?</p>
                <Link href="/register">Sign Up</Link>
              </div>
            </>
          )}
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;
