import React from 'react';
import Link from 'next/link';
import "./home.css";

const RepairItem = ({ title, services,card }) => {
  return (
    <div className="item">
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <div className={`${card}`}></div>
            <div className='card-details'><h3>{title} Repair</h3></div>
        </div>
        <div className="flip-card-back">
          <h1>{title} Repair</h1>
          {services.map((service, index) => (
            <Link key={index} href={`/home/mechanicdata/${service}/${title}`}>
              <button>{service} Related</button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RepairItem;
