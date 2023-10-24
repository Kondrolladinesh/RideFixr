import Image from 'next/image';
import './LandingPage.css';
// import {FaInstagramSquare, FaFacebookSquare, FaWhatsappSquare} from "react-icons/fa"
import {FaXTwitter, FaInstagram, FaWhatsapp, FaFacebook} from "react-icons/fa6"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section about">
            {/* <h2 className="logo"></h2> */}
            <Image
              src={"/RideFixr-logo_white.png"}
              alt="Logo"
              width={100}
              height={100}
              priority
            />
            <p>
              RideFixr is your trusted companion on the road, providing swift
              and reliable roadside assistance.
            </p>
            <div className="contact">
              <span>
                <i className="fas fa-phone"></i> +91 9515316904
              </span>
              <span>
                <i className="fas fa-envelope"></i> ridefixr@gmail.com
              </span>
            </div>
          </div>
          <div className="footer-section links">
            <h2>Quick Links</h2>
            <ul>
              <li>
                <a href="#home">Home</a>
              </li>
              <li>
                <a href="#services">Services</a>
              </li>
              <li>
                <a href="#about">About Us</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
            </ul>
          </div>
          <div className="footer-section social">
            <h2>Follow Us</h2>
            <div className="social-links">
              <a href="#" style={{ color: "#E1306C" }}>
                <FaInstagram />
              </a>
              <a href="#" style={{ color: "#1DA1F2" }}>
                <FaXTwitter />
              </a>
              <a href="#" style={{ color: "#1877F2" }}>
                <FaFacebook />
              </a>
              <a href="#" style={{ color: "#25D366" }}>
                <FaWhatsapp />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} RiderFixrr. All rights reserved.
        </p>
        <p>Owned by: Kondrolla Dinesh Reddy</p>
      </div>
    </footer>
  );
};

export default Footer;
