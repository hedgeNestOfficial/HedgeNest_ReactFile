import React, { useState, useEffect } from "react";
import "../Style/WhyChoose.css";
import { WhyChooseData } from "../JS/HeroCrad";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import WhychooseCard from "../static/WhychooseCard";

const WhyChoose = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 🌟 Swipe Logic State Tracking
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Minimum pixel distance to register as an actual swipe action
  const minSwipeDistance = 50;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🌟 Touch Event Handlers
  const handleTouchStart = (e) => {
    setTouchEnd(null); // Reset end touch state on new action
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    // Swipe Left -> Go to Next Card
    if (isLeftSwipe && currentIndex < WhyChooseData.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }

    // Swipe Right -> Go to Previous Card
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <section className="why-section">
      <div className="why-container">
        <div className="why-header">
          <h2>Why Choose HedgeNest?</h2>
        </div>

        {isMobile ? (
          /* Mobile Viewport with Floating Controls & Touch Listeners */
          <div className="mobile-carousel-container">
            {/* Left Absolute Button */}
            <button
              className={`carousel-btn prev-btn ${currentIndex === 0 ? "disabled" : ""}`}
              onClick={() => setCurrentIndex(Math.max(currentIndex - 1, 0))}
              disabled={currentIndex === 0}
            >
              <FaChevronLeft />
            </button>

            {/* 🌟 Attached Touch Bindings to the Visible Viewport Frame */}
            <div
              className="carousel-viewport"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                cursor: "grab",
              }} /* Visual hint for testing on desktop dev tools */
            >
              <div
                className="carousel-track"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {WhyChooseData.map((item, index) => (
                  <div className="carousel-slide" key={index}>
                    <WhychooseCard {...item} />
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
                <WhychooseCard {...item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default WhyChoose;
