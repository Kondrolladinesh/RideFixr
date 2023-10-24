"use client";
import React, { useState } from "react";
import "../LandingPage.css";
import NavWithOutAccess from "../components/NavWithOutAccess";
import { SendMail } from "@/lib/SendMail";
import { useRouter } from "next/navigation";

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const router = useRouter();

  const handleSendEmail = async () => {
    const emailSent = await SendMail({
      status: "contact",
      to: email,
      subject: `${subject} | ${name}`,
      text: message,
    });
    router.push("/");
  }

  // Enable the button only if all fields are filled
  const enableButton = () => {
    if (name && email && subject && message) {
      setIsButtonEnabled(true);
    } else {
      setIsButtonEnabled(false);
    }
  };

  return (
    <>
      <NavWithOutAccess />
      <div className="contact-container">
        <div className="contact-content">
          <h1>Contact Us</h1>
          <p>
            Have questions or need assistance? Feel free to get in touch with us.
          </p>
          <form className="contact-form">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                enableButton();
              }}
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                enableButton();
              }}
              required
            />
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                enableButton();
              }}
              required
            />
            <textarea
              placeholder="Your Message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                enableButton();
              }}
              required
            ></textarea>
            <button
              type="submit"
              className="submit-button"
              onClick={handleSendEmail}
              disabled={!isButtonEnabled}
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
