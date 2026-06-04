import React, { useState, useEffect } from "react";
import FeatureCard from "../static/FeatureCard";
import "../Style/WhyChoose.css";
import { WhyChooseData } from "../JS/HeroCrad";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const WhyChoose = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="why-section">
      <div className="why-container">
        <div className="why-header">
          <h2>Why Choose HedgeNest?</h2>
        </div>

        {isMobile ? (
          /* Mobile Viewport with Floating Controls */
          <div className="mobile-carousel-container">
            {/* Left Absolute Button */}
            <button
              className={`carousel-btn prev-btn ${currentIndex === 0 ? "disabled" : ""}`}
              onClick={() => setCurrentIndex(Math.max(currentIndex - 1, 0))}
              disabled={currentIndex === 0}
            >
              <FaChevronLeft />
            </button>

            <div className="carousel-viewport">
              <div
                className="carousel-track"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {WhyChooseData.map((item, index) => (
                  <div className="carousel-slide" key={index}>
                    <FeatureCard {...item} />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Absolute Button */}
            <button
              className={`carousel-btn next-btn ${currentIndex === WhyChooseData.length - 1 ? "disabled" : ""}`}
              onClick={() =>
                setCurrentIndex(
                  Math.min(currentIndex + 1, WhyChooseData.length - 1),
                )
              }
              disabled={currentIndex === WhyChooseData.length - 1}
            >
              <FaChevronRight />
            </button>

            {/* Bottom Dots Indicator */}
            <div className="carousel-dots">
              {WhyChooseData.map((_, index) => (
                <div
                  key={index}
                  className={`dot ${currentIndex === index ? "active-dot" : ""}`}
                  onClick={() => setCurrentIndex(index)}
                ></div>
              ))}
            </div>
          </div>
        ) : (
          /* Desktop Flex View */
          <div className="desktop-flex-container">
            {WhyChooseData.map((item, index) => (
              <div className="flex-card-wrapper" key={index}>
                <FeatureCard {...item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default WhyChoose;
