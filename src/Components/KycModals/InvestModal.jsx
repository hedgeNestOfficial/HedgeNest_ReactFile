import React, { useState, useEffect, useRef } from "react";
import "../../Style/InvestModal.css";
import { FiArrowLeft } from "react-icons/fi";
import toast from "react-hot-toast";
const InvestModal = ({ isOpen, product }) => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);

  const pinRefs = useRef([]);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setAmount("");
      setPin(Array(6).fill(""));
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen || !product) {
    return null;
  }

  return (
    <div className="invest-modal-overlay">
      <div className="invest-modal-card">
        {/* STEP 1 */}

        {step === 1 && (
          <form onSubmit={handleAmountSubmit}>
            <h2>{investmentName}</h2>

            <p>
              Earn {roi}% ROI over {term} days.
            </p>

            <div className="invest-info-box">
              <p>
                Minimum Investment:
                <strong>₦{Number(minAmount).toLocaleString()}</strong>
              </p>
            </div>

            <div className="invest-input-group">
              <label>Amount</label>

              <input
                type="number"
                value={amount}
                placeholder={minAmount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="invest-summary">
              <span>Expected Return</span>

              <strong>₦{Number(expectedReturn).toLocaleString()}</strong>
            </div>

            <div className="invest-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>

              <button type="submit" className="btn-primary">
                Continue
              </button>
            </div>
          </form>
        )}

        {/* STEP 2 */}

        {step === 2 && (
          <form onSubmit={handleInvestmentSubmit}>
            <button
              type="button"
              className="back-btn"
              onClick={() => setStep(1)}
            >
              <FiArrowLeft />
            </button>

            <h2>Enter Transaction Pin</h2>

            <div className="pin-container">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  type="password"
                  maxLength={1}
                  value={digit}
                  ref={(el) => (pinRefs.current[index] = el)}
                  onChange={(e) => handlePinChange(e.target.value, index)}
                  onKeyDown={(e) => handlePinBackspace(e, index)}
                />
              ))}
            </div>

            <button
              type="submit"
              className="btn-primary full-width"
              disabled={loading}
            >
              {loading ? "Processing..." : "Invest"}
            </button>
          </form>
        )}

        {/* STEP 3 */}

        {step === 3 && (
          <div className="success-container">
            <div className="success-icon">✓</div>

            <h2>Investment Created</h2>

            <p>Your investment request has been submitted successfully.</p>

            <button className="btn-primary full-width" onClick={onClose}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestModal;
