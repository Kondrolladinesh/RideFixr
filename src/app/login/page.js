"use client";
import Link from "next/link";
import "./login.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { verifyUser } from "./LoginVerifications/verifyUser";
import { verifyAdmin } from "./LoginVerifications/verifyAdmin";
import { verifyMech } from "./LoginVerifications/verifyMech";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Input } from 'antd';


const Login = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [mechanic, setMechanic] = useState(false);
  const [checkBox, setChechBox] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const verifyData = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      let result = null;
      if (mechanic) {
        result = await verifyMech(email, pass);
      } else {
        const adminResult = await verifyAdmin(email, pass);
        const userResult = await verifyUser(email, pass);

        if (adminResult.Status) {
          result = adminResult;
        } else if (userResult.Status) {
          result = userResult;
        }
      }
      const fiveMinsInSeconds = 5 * 60 * 1000; // 5 hours in seconds
      const expirationTime = new Date(Date.now() + fiveMinsInSeconds).toUTCString();
      if (result && result.Status) {
        // Verification successful
        if (mechanic) {
          if(checkBox === false){
            document.cookie = `mechActivite=true; expires=${expirationTime}; path=/`;
          }else{
            Cookies.set("mechActivite", true);
          }
          Cookies.set("userType", "Mechanic");
          Cookies.set("mechid", result.id);
          router.push("/mechDashBoard");
          toast.success("Successfully Login!!", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        } else {
          if (result.Admin) {
            if(checkBox === false){
              document.cookie = `adminActivite=true; expires=${expirationTime}; path=/`;
            }else{
              Cookies.set("adminActivite", true);
            }
            // Cookies.set("adminActivite", true);
            Cookies.set("Adminid", result.id);
            router.push("/admin");
            toast.success("Successfully Login!!", {
              position: toast.POSITION.BOTTOM_CENTER,
            });
          } else {
            if(checkBox === false){
              document.cookie = `userActivite=true; expires=${expirationTime}; path=/`;
            }else{
              Cookies.set("userActivite", true);
            }
            // Cookies.set("userActivite", true);
            Cookies.set("userid", result.id);
            Cookies.set("userName", result.name);
            Cookies.set("userPhone", result.phone);
            router.push("/home");
            toast.success("Successfully Login!!", {
              position: toast.POSITION.BOTTOM_CENTER,
            });
          }
        }
        setLoading(false);
      } else {
        alert("No Data Found");
      }
    } catch (error) {
      toast.error(`Error, ${error}`, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-main">
      <form className="login-form">
        <div className="login-details">
          <h1 className="heading">RideFixr</h1>
          <h3>Login Page</h3>
          <Input
            className="input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input.Password
            className="input"
            type="password"
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
          />
        </div>
        <div className="check-mechanic">
          <input
            className="check-box"
            type="checkbox"
            placeholder="Check box"
            value={mechanic}
            onChange={() => setMechanic(!mechanic)}
          />
          <p>Are you a Mechanic</p>
        </div>
        <div className="checkbox">
          <div>
            <input
              className="check-box"
              type="checkbox"
              placeholder="Check box"
              value={checkBox}
              onChange={() => setChechBox(!checkBox)}
            />
            <p>Remember</p>
          </div>
          <a href="/login/forgotpassword">Forgot password?</a>
        </div>
        <div className="next-page">
          {loading ? ( // Display loading indicator when loading is true
            // <div className="loader"></div>
            <img src="/gear_spinner.svg" alt="Spinner" />
          ) : (
            <button type="submit" onClick={verifyData}>
              Sign In
            </button>
          )}
          <div>
            <p>Not a member?</p>
            <Link href="/register">Sign Up</Link>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;
