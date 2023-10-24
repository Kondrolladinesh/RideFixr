import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import "./LandingPage.css";

const UserTestimonialSlider = () => {
  const testimonials = [
    {
      text: "RideFixr made my life so much easier! I was stuck on the highway with a flat tire, and within minutes, I had a mechanic on the way. Highly recommended!",
      user: "John Doe",
      role: "Happy User",
    },
    {
      text: "Fast and efficient service! The app is user-friendly, and the mechanics are professional. I'll never hit the road without RideFixr again.",
      user: "Jane Smith",
      role: "Satisfied Customer",
    },
    {
      text: "RideFixr is a game-changer. It saved me when my car broke down in the middle of nowhere. The response time is impressive, and the service is top-notch.",
      user: "Mark Johnson",
      role: "Lifesaver",
    },
    // Add more testimonials as needed
  ];

  return (
    <section className="testimonial-slider-container">
      <div className="testimonial-slider-content">
        <h2 className="testimonial-slider-heading">What Our Users Say</h2>
        <Carousel showArrows={true} showThumbs={false} infiniteLoop={true} autoPlay={true} interval={5000} className="testimonial-carousel">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <p className="testimonial-text">{testimonial.text}</p>
              <p className="user-info">
                - {testimonial.user}, {testimonial.role}
              </p>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
};

export default UserTestimonialSlider;
