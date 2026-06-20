import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { CiCircleQuestion } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import { LuPiggyBank } from "react-icons/lu";
import toast from "react-hot-toast";

import SavingsModal from "../Components/SavingsModal";
import Vaults from "../Components/Vaults";
import TopUpModal from "../Components/TopUpModal";
import WithdrawModal from "../Components/WithdrawModal";

import {
  createPlan,
  breakPlan,
  topUp,
  getAllPlan,
} from "../Services/Smartsafeservice";

import "../Css/SmartSafe.css";

const SmartSafe = () => {
  const token = useSelector((state) => state.user.token);

  const [vaults, setVaults] = useState([]);
  const [isLoadingVaults, setIsLoadingVaults] = useState(true);

  const [modalScreen, setModalScreen] = useState("NONE");
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isFlexibleMode, setIsFlexibleMode] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [pin, setPin] = useState(["", "", "", "", "", ""]);

  const [formData, setFormData] = useState({
    title: "",
    targetAmount: "",
    duration: "",
    savingFrequency: "DAILY",
    initialAmount: "",
    planType: "LOCKED",
  });

  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [activeTopUpVault, setActiveTopUpVault] = useState(null);
  const [activeWithdrawVault, setActiveWithdrawVault] = useState(null);

  // Normalizes API schema down to your frontend's clean properties
  const normalizePlans = (plans = []) => {
    return plans.map((plan) => ({
      id: plan._id,
      title: plan.title,
      type: plan.planType,
      planType: plan.planType,
      targetAmount: Number(plan.targetAmount || 0), // Your static target goal (e.g. 5000)
      balance: Number(plan.currentBalance || 0), // Your TRUE live balance pool (e.g. 6200)
      progress: plan.progress || 0,
      interestRate: plan.interestRate || 0,
      frequency: plan.savingFrequency,
      autoSave: plan.autoSave ?? false,
      breakingFeePercentage: plan.breakingFeePercentage || 0,
    }));
  };

  const fetchUserVaults = async () => {
    if (!token) return;

    try {
      setIsLoadingVaults(true);
      const response = await getAllPlan(token);
      const plansData =
        response?.plans || response?.plan || response?.data?.plan || [];
      setVaults(normalizePlans(plansData));
    } catch (error) {
      toast.error("Could not load your savings vaults.");
      setVaults([]);
    } finally {
      setIsLoadingVaults(false);
    }
  };

  useEffect(() => {
    fetchUserVaults();
  }, [token]);

  useEffect(() => {
    if (modalScreen === "NONE") {
      setFormData({
        title: "",
        targetAmount: "",
        duration: "",
        savingFrequency: "DAILY",
        initialAmount: "",
        planType: "LOCKED",
      });
      setPin(["", "", "", "", "", ""]);
    }
  }, [modalScreen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePinChange = (value, index) => {
    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);
  };

  const handlePinKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!pin[index] && index > 0) {
        const newPin = [...pin];
        newPin[index - 1] = "";
        setPin(newPin);

        const prevInput = document.querySelector(
          `input[name="pin-${index - 1}"]`,
        );
        if (prevInput) prevInput.focus();
      } else if (pin[index]) {
        const newPin = [...pin];
        newPin[index] = "";
        setPin(newPin);
      }
    }
  };

  const handleCreateVault = async () => {
    try {
      if (!token) {
        toast.error("Session expired. Please login again.");
        return;
      }

      setModalScreen("LOADING");

      const payload = {
        title: formData.title,
        targetAmount: Number(formData.targetAmount),
        planType: formData.planType, // Fixed: Sends user dropdown choice safely (e.g. STEALTH)
        duration: formData.planType === "FLEXIBLE" ? null : formData.duration,
        savingFrequency: formData.savingFrequency,
        amountPerFrequency: Number(formData.initialAmount),
        transactionPin: pin.join(""),
      };

      await createPlan(payload, token);
      toast.success("Vault created successfully");
      setModalScreen("SUCCESS");
      fetchUserVaults();
    } catch (error) {
      toast.error(error?.message || "Failed to create vault");
      setModalScreen("SUMMARY");
    }
  };

  const handleTopUp = async (vault, amount, pinValue) => {
    try {
      const payload = {
        amount: Number(amount),
        transactionPin: pinValue,
      };

      const res = await topUp(payload, vault.id, token);
      const apiData = res?.data?.data || res?.data;

      setVaults((prev) =>
        prev.map((v) =>
          v.id === vault.id
            ? {
                ...v,

                balance:
                  apiData?.newSavingsBalance !== undefined
                    ? Number(apiData.newSavingsBalance)
                    : Number(v.balance) + Number(amount),
              }
            : v,
        ),
      );

      toast.success("Top up successful");
      fetchUserVaults(); // Keep frontend synced perfectly with DB
    } catch (error) {
      toast.error(error?.message || "Top up failed");
      throw error;
    }
  };

  const handleWithdraw = async (vault, payload) => {
    return await breakPlan(vault.id, payload, token);
  };

  const handleWithdrawClick = (vault) => {
    setActiveWithdrawVault(vault);
    setIsWithdrawModalOpen(true);
  };

  const handleToggleAutoSave = (vaultId) => {
    setVaults((prev) =>
      prev.map((vault) =>
        vault.id === vaultId ? { ...vault, autoSave: !vault.autoSave } : vault,
      ),
    );
  };

  const handleCloseSuccess = () => {
    setPin(["", "", "", "", "", ""]);
    setFormData({
      title: "",
      targetAmount: "",
      duration: "",
      savingFrequency: "DAILY",
      initialAmount: "",
      planType: "LOCKED",
    });
    setModalScreen("NONE");
    fetchUserVaults();
  };

  return (
    <main className="smart-container">
      <header className="dash-header">
        <div className="header-titles">
          <h1 className="main-title">Smart Safe</h1>
          <p className="sub-title">Save with intent. Earn up to 17% p.a.</p>
        </div>

        <div className="header-actions">
          <div className="dropdown-wrapper">
            <button
              className={`help-btn ${isHelpOpen ? "active" : ""}`}
              onClick={() => setIsHelpOpen(!isHelpOpen)}
            >
              <CiCircleQuestion className="icon-help" />
            </button>

            {isHelpOpen && (
              <div className="dropdown-panel">
                <div className="arrow-top"></div>
                <div className="panel-content">
                  <p className="info-text">
                    Interest on Smart Safe is calculated per annum and paid on
                    the matured date of the savings plan.
                  </p>
                  <p className="info-text">
                    In compliance with Nigerian tax regulations, a Withholding
                    Tax of 10% applies to the interest earned on your savings.
                  </p>
                  <p className="info-text">
                    Breaking Fees of 1.5% will be attracted for early Withdrawal
                    for locked Saving Plans while with Flexible plans, users can
                    break savings without additional charges.
                  </p>

                  <div className="rate-banner">Interest Rate Details</div>

                  <div className="rate-list">
                    <div className="rate-row rate-header">
                      <span className="cell text-left">Duration</span>
                      <span className="cell text-right">Rate</span>
                    </div>
                    <div className="rate-row bg-highlight">
                      <span className="cell text-left">7 - 90 days</span>
                      <span className="cell text-right">14% p.a.</span>
                    </div>
                    <div className="rate-row">
                      <span className="cell text-left">91 - 180 days</span>
                      <span className="cell text-right">15% p.a.</span>
                    </div>
                    <div className="rate-row bg-highlight">
                      <span className="cell text-left">181 - 364 days</span>
                      <span className="cell text-right">16% p.a.</span>
                    </div>
                    <div className="rate-row">
                      <span className="cell text-left">365 - 1000 days</span>
                      <span className="cell text-right">17% p.a.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            className="create-btn"
            onClick={() => setModalScreen("CREATE")}
          >
            <FaPlus />
            New Vault
          </button>
        </div>
      </header>

      {isLoadingVaults ? (
        <div style={{ padding: 40, textAlign: "center" }}>
          Loading your Nests...
        </div>
      ) : vaults.length === 0 ? (
        <section className="empty-card">
          <div className="empty-content">
            <div className="icon-box">
              <LuPiggyBank className="icon-piggy" />
            </div>
            <h2 className="card-title">Build Your First Nest</h2>
            <p className="card-desc">
              Pick a goal, set how often you'll save, and let HedgeNest do the
              rest.
            </p>
          </div>
        </section>
      ) : (
        <Vaults
          vaultsData={vaults}
          onTopUp={(vault) => {
            setActiveTopUpVault(vault);
            setIsTopUpOpen(true);
          }}
          onWithdraw={handleWithdrawClick}
          onToggleAutoSave={handleToggleAutoSave}
        />
      )}

      <TopUpModal
        isOpen={isTopUpOpen}
        onClose={() => {
          setIsTopUpOpen(false);
          setActiveTopUpVault(null);
        }}
        vault={activeTopUpVault}
        onTopUpSuccess={handleTopUp}
      />

      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        vault={activeWithdrawVault}
        onClose={() => setIsWithdrawModalOpen(false)}
        onWithdraw={handleWithdraw}
        onWithdrawSuccess={fetchUserVaults}
      />

      <SavingsModal
        modalScreen={modalScreen}
        setModalScreen={setModalScreen}
        isFlexibleMode={isFlexibleMode}
        setIsFlexibleMode={setIsFlexibleMode}
        formData={formData}
        handleInputChange={handleInputChange}
        handleFormSubmit={(e) => {
          e.preventDefault();
          setModalScreen("SUMMARY");
        }}
        handleConfirmClick={() => setModalScreen("PIN")}
        pin={pin}
        handlePinChange={handlePinChange}
        handlePinKeyDown={handlePinKeyDown}
        handlePinSubmit={handleCreateVault}
        handleCloseSuccess={handleCloseSuccess}
      />
    </main>
  );
};

export default SmartSafe;
