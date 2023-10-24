"use client"
import React, { useState } from 'react';
import "../globals.css";

const StarRating = ({ rating, onRatingChange }) => {
  const [hoveredRating, setHoveredRating] = useState(null);

  const handleStarHover = (starRating) => {
    setHoveredRating(starRating);
  };

  const handleStarClick = (starRating) => {
    onRatingChange(starRating);
  };

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= (hoveredRating || rating) ? 'filled' : ''}`}
          onMouseEnter={() => handleStarHover(star)}
          onMouseLeave={() => setHoveredRating(null)}
          onClick={() => handleStarClick(star)}
        >
          &#9733; {/* Star Unicode Character */}
        </span>
      ))}
    </div>
  );
};

export default StarRating;
