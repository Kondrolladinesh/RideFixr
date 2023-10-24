"use client";
import Image from "next/image";
import "./LandingPage.css";
import { useRouter } from "next/navigation";
import NavWithOutAccess from "./components/NavWithOutAccess";
import ServicesOffered from "./ServicesOffered";
import UserTestimonialSlider from "./UserTestimonialSlider";
import Footer from "./Footer";

export default function Home() {
  const router = useRouter();
  return (
    <main>
      <NavWithOutAccess />
      <section id="home" className="hero-container">
        <div className="hero-content">
          <div className="blur_background">
            <h1 className="hero-heading">
              Swift Roadside Assistance When You Need It Most
            </h1>
            <p className="hero-subheading">
              Your Trusted Companion on the Road – RideFixr ensures help is
              just a tap away.
            </p>
          </div>
          <div className="cta-buttons">
            <a href="/login"><button className="primary-cta">Get Started Now</button></a>
            <button className="secondary-cta"><a href="#about">Learn More</a></button>
          </div>
        </div>
      </section>
      <section id="about" className="about-container">
        <div className="about-content">
          <Image
            src={"/About_Icon.png"}
            alt="Logo"
            width={60}
            height={60}
            priority
          />
          <h2 className="about-heading">About RiderFixr</h2>
          <p className="about-description">
            RiderFixr is your reliable partner in times of vehicle trouble. We
            connect riders with skilled mechanics, providing swift assistance
            wherever you are.
          </p>
        </div>
      </section>
      <div id="services">
      <ServicesOffered />
      </div>
      <UserTestimonialSlider />
      <Footer />
    </main>
  );
}
