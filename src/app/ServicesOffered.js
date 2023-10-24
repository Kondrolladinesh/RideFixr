import React from "react";
import "./LandingPage.css";
import Image from "next/image";

const ServicesOffered = () => {
  const servicesData = [
    {
      title: "Swift Locator",
      description: "Quickly find nearby Mechanics during breakdowns.",
      icon: "/Swift_Locator.png", // Replace with the actual icon URL or path
    },
    {
      title: "Real-Time Access",
      description: "Immediate assistance, anytime, anywhere.",
      icon: "/Real_Time_Access.png", // Replace with the actual icon URL or path
    },
    {
      title: "Verified Mechanics",
      description: "Highly skilled and trusted Mechanics.",
      icon: "/Verified_Mechanics.png", // Replace with the actual icon URL or path
    },
    {
      title: "User-Friendly Interface",
      description: "Intuitive and easy-to-use for all users.",
      icon: "/User_Friendly_Interface.png", // Replace with the actual icon URL or path
    },
    {
      title: "Cost-Efficient",
      description: "Reduced downtime and operational costs.",
      icon: "/Cost_Efficient.png", // Replace with the actual icon URL or path
    },
    {
      title: "Mechanic's Career Boost",
      description: "Boost Your Career with New Opportunities.",
      icon: "/Mechanic's_Career_Boost.png", // Replace with the actual icon URL or path
    },
  ];

  return (
    <div className="services-container">
      <h2 className="services-heading">Services Offered</h2>
      <div className="services-content">
        {servicesData.map((service, index) => (
          <div className="service" key={index}>
            <div className="service-icon">
              <Image
              src={service.icon}
              alt={service.title}
              width={90}
              height={60}
            />
            </div>
            <h3 className="service-title">{service.title}</h3>
            <p className="service-description">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesOffered;
