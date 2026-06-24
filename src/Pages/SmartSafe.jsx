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
  breakPlan,
  topUp,
  getAllPlan,
  createPlan,
  previewPlan,
} from "../Services/Smartsafeservice";

import "../Css/SmartSafe.css";

const SmartSafe = () => {
  const token = useSelector((state) => state.user.token);

  // Core Data States
  const [vaults, setVaults] = useState([]);
  const [isLoadingVaults, setIsLoadingVaults] = useState(true);

  // Modal Screen Flow State
  const [modalScreen, setModalScreen] = useState("NONE");

  // Presentation UI Toggle States
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isFlexibleMode, setIsFlexibleMode] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);

  // Active Selections for Sub-Modals
  const [activeTopUpVault, setActiveTopUpVault] = useState(null);
  const [activeWithdrawVault, setActiveWithdrawVault] = useState(null);

  // Local Security Pin Sequence Array
  const [pin, setPin] = useState(["", "", "", "", "", ""]);

  // Summary state vs Form preview state
  const [previewSummaryData, setPreviewSummaryData] = useState(null);
  const [formLivePreviewData, setFormLivePreviewData] = useState(null);

  // Core Schema Blueprint Form State
  const [formData, setFormData] = useState({
    title: "",
    targetAmount: "",
    duration: "",
    savingFrequency: "DAILY",
    initialAmount: "",
    planType: "LOCKED",
  });

  // Structural normalization logic to safely parse backend responses
  const normalizePlans = (plans = []) => {
    return plans
      .filter((plan) => {
        const hasBalance = Number(plan.currentBalance || 0) > 0;
        const hasLockedAmount = Number(plan.amount || 0) > 0;
        return hasBalance || hasLockedAmount;
      })
      .map((plan) => ({
        id: plan._id,
        _id: plan._id,
        title: plan.title,
        type: plan.planType,
        planType: plan.planType,
        amount: Number(plan.amount || 0),
        targetAmount: Number(plan.targetAmount || 0),
        currentBalance: Number(plan.currentBalance || 0),
        interestRate: plan.interestRate || 0,
        frequency: plan.savingFrequency,
        autoSave: plan.autoSave ?? false,
        breakingFeePercentage: plan.breakingFeePercentage || 0,
      }));
  };

  // 1. API CALL: Fetch Active Plan Vaults
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

  // Clean-up hook to scrub temporary fields
  useEffect(() => {
    if (modalScreen === "NONE" || modalScreen === "CREATE") {
      setFormData({
        title: "",
        targetAmount: "",
        duration: "",
        savingFrequency: "DAILY",
        initialAmount: "",
        planType: "LOCKED",
      });
      setPin(["", "", "", "", "", ""]);
      setPreviewSummaryData(null);
      setFormLivePreviewData(null);
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
    setPin((prevPin) => {
      const newPin = [...prevPin];
      newPin[index] = value;
      return newPin;
    });
  };

  // 2. API CALL: Preview configuration request
  // 2. API CALL: Preview configuration request
  // 2. API CALL: Preview configuration request
  const handleFormPreviewFetch = async (payload) => {
    try {
      const response = await previewPlan(payload, token);

      // Check if we actually got data back
      const previewData = response?.data || response;

      if (!previewData) {
        throw new Error("No preview data received from server.");
      }

      setFormLivePreviewData(previewData);
      setPreviewSummaryData(previewData);

      // Only proceed to the summary screen if the fetch was successful
      setModalScreen("SUMMARY");

      return response;
    } catch (error) {
      console.error("Live form preview failed:", error);

      // Extract the backend message if it exists
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to calculate preview. Please try again.";

      // Toast the error so the user knows why it failed
      // Duration: 4000ms ensures it disappears automatically
      toast.error(errorMessage, {
        duration: 1500,
        position: "top-center",
      });

      // CRITICAL: We explicitly do NOT set modalScreen to "SUMMARY".
      // This keeps the user on the creation form so they can fix their inputs.
      // If you need to force a reset, you can set it to "CREATE"
      setModalScreen("CREATE");
    }
  }; // 3. API CALL: Create and Save a New Vault
  const handleCreatePlanSubmit = async (pinString) => {
    // Lock the UI immediately to prevent double submissions
    setModalScreen("LOADING");

    try {
      const isFlexible = formData.planType === "FLEXIBLE";

      const payload = {
        title: formData.title,
        planType: formData.planType,
        transactionPin: pinString,
        ...(isFlexible
          ? { targetAmount: Number(formData.targetAmount) }
          : { amount: Number(formData.targetAmount) }),
      };

      if (isFlexible) {
        payload.savingFrequency = formData.savingFrequency;
        payload.amountPerFrequency = Number(formData.initialAmount);
      } else {
        payload.duration = Number(formData.duration);
      }

      await createPlan(payload, token);

      setModalScreen("SUCCESS");
      fetchUserVaults();
    } catch (err) {
      toast.error(err?.message || "Plan creation failed");
      // Revert to PIN screen on failure and clear the inputs
      setModalScreen("PIN");
      setPin(["", "", "", "", "", ""]);
    }
  };

  // 4. API CALL: Top Up an Existing Plan Vault
  const handleTopUp = async (vault, amount, pinValue) => {
    const targetCeiling = Number(vault?.targetAmount || 0);
    const existingTopUpBalance = Number(vault?.currentBalance || 0);
    const incomingAmount = Number(amount || 0);

    if (existingTopUpBalance + incomingAmount > targetCeiling) {
      const remainderSpace = Math.max(0, targetCeiling - existingTopUpBalance);

      toast.error(
        `Limit Exceeded. Maximum additional top-up allowed is ₦${remainderSpace.toLocaleString()}.`,
        { duration: 5000, position: "top-center" },
      );

      throw new Error("Validation Limit Exceeded");
    }

    try {
      const vaultId =
        vault?.id ||
        vault?._id ||
        activeTopUpVault?.id ||
        activeTopUpVault?._id;
      if (!vaultId) {
        toast.error("Invalid vault profile data selection.");
        return;
      }

      const payload = { amount: incomingAmount, transactionPin: pinValue };

      const response = await topUp(payload, vaultId, token);
      toast.success("Top up successful");

      const serverNewBalance =
        response?.data?.newSavingsBalance ?? response?.newSavingsBalance;

      if (serverNewBalance !== undefined && serverNewBalance !== null) {
        setVaults((prevVaults) =>
          prevVaults.map((v) =>
            v.id === vaultId || v._id === vaultId
              ? { ...v, currentBalance: Number(serverNewBalance) }
              : v,
          ),
        );
      }

      setTimeout(async () => {
        await fetchUserVaults();
      }, 500);
    } catch (error) {
      if (error.message !== "Validation Limit Exceeded") {
        toast.error(error?.message || "Top up failed");
      }
      throw error;
    }
  };

  // 5. API CALL: Early Break or Normal Withdrawal Sequence
  const handleWithdraw = async (vault, payload) => {
    const vaultId = vault?.id || vault?._id;
    return await breakPlan(vaultId, payload, token);
  };

  const handleWithdrawClick = (vault) => {
    setActiveWithdrawVault(vault);
    setIsWithdrawModalOpen(true);
  };

  const handleToggleAutoSave = (vaultId) => {
    setVaults((prev) =>
      prev.map((vault) =>
        vault.id === vaultId || vault._id === vaultId
          ? { ...vault, autoSave: !vault.autoSave }
          : vault,
      ),
    );
  };

  // Complete cleanup callback invoked when workflow finishes successfully
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
    setPreviewSummaryData(null);
    setFormLivePreviewData(null);
    setModalScreen("NONE");
    fetchUserVaults();
  };

  return (
    <main className="smart-container" onClick={() => setIsHelpOpen(false)}>
      <header className="dash-header">
        <div className="header-titles">
          <h1 className="main-title">Smart Safe</h1>
          <p className="sub-title">Save with intent. Earn up to 17% p.a.</p>
        </div>

        <div className="header-actions">
          <div
            className="dropdown-wrapper"
            onClick={(e) => e.stopPropagation()}
          >
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
            onClick={(e) => {
              e.stopPropagation();
              setModalScreen("CREATE");
            }}
          >
            <FaPlus />
            New Vault
          </button>
        </div>
      </header>

      {/* SKELETON LOADER CONTAINER */}
      {isLoadingVaults ? (
        <div className="vault-wrap">
          {[1, 2].map((i) => (
            <div key={i} className="vault-card skeleton-card">
              <div className="skeleton-element skeleton-badge"></div>
              <div className="skeleton-element skeleton-title"></div>
              <div className="skeleton-element skeleton-balance-block"></div>
              <div className="skeleton-element skeleton-progress"></div>
              <div className="skeleton-element skeleton-metrics"></div>
              <div className="skeleton-element skeleton-actions"></div>
            </div>
          ))}
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

      {/* TOP UP MODAL SUB-ROUTE */}
      <TopUpModal
        isOpen={isTopUpOpen}
        onClose={() => {
          setIsTopUpOpen(false);
          setActiveTopUpVault(null);
        }}
        vault={activeTopUpVault}
        onTopUpSuccess={handleTopUp}
      />

      {/* WITHDRAWAL MODAL SUB-ROUTE */}
      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        vault={activeWithdrawVault}
        onClose={() => setIsWithdrawModalOpen(false)}
        onWithdraw={handleWithdraw}
        onWithdrawSuccess={() => {
          setVaults((prev) =>
            prev.filter(
              (v) =>
                v.id !== activeWithdrawVault?.id &&
                v._id !== activeWithdrawVault?._id,
            ),
          );
          fetchUserVaults();
        }}
      />

      {/* CENTRAL SAVINGS ACTION MODAL INTERNALS */}
      <SavingsModal
        modalScreen={modalScreen}
        setModalScreen={setModalScreen}
        isFlexibleMode={isFlexibleMode}
        setIsFlexibleMode={setIsFlexibleMode}
        formData={formData}
        handleInputChange={handleInputChange}
        handleCloseSuccess={handleCloseSuccess}
        fetchUserVaults={fetchUserVaults}
        pin={pin}
        handlePinChange={handlePinChange}
        previewSummaryData={previewSummaryData}
        formLivePreviewData={formLivePreviewData}
        onFormPreviewRequested={handleFormPreviewFetch}
        handlePinSubmit={handleCreatePlanSubmit}
      />
    </main>
  );
};

export default SmartSafe;
