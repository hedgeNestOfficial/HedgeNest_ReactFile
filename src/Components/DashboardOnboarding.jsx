import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiChevronDown,
  FiChevronUp,
  FiCompass,
  FiCreditCard,
  FiExternalLink,
  FiBriefcase,
  FiRepeat,
  FiTarget,
  FiTrendingUp,
  FiX,
} from "react-icons/fi";
import { getLinkedAccounts } from "../Services/Walletservice.js";
import { getTransactionHistory } from "../Services/authService.js";
import { getAllPlan } from "../Services/Smartsafeservice.js";
import { getUserInvestments } from "../Services/investmentService.js";
import "../Css/DashboardOnboarding.css";

const TOUR_STEPS = [
  {
    target: "welcome",
    title: "Welcome to HedgeNest",
    description:
      "This is your home base. You can return here any time to see your wallet overview and pick up where you left off.",
  },
  {
    target: "balances",
    title: "Understand your balances",
    description:
      "Your available balance and your NGN and USDT balances help you understand the funds currently shown in your account.",
  },
  {
    target: "actions",
    title: "Your main actions",
    description:
      "Use these shortcuts to open currency conversion, SmartSave, and investment features. Review details before confirming any financial action.",
  },
  {
    target: "savings-investments",
    title: "Track saving and investment plans",
    description:
      "These cards summarize your SmartSave plans and investments. Open each area to review its details and terms.",
  },
  {
    target: "transactions",
    title: "Review recent activity",
    description:
      "Recent transactions help you review activity. For a financial action, rely on the confirmed status shown by HedgeNest rather than assuming a request has completed.",
  },
];

const TASKS = [
  {
    key: "funded",
    title: "Make your first deposit",
    description: "Add money to your wallet to start using HedgeNest.",
    action: "Open wallet",
    icon: FiCreditCard,
    route: "/wallet",
  },
  {
    key: "linkedBank",
    title: "Add a withdrawal bank account",
    description: "Set up the bank account you want to use for withdrawals.",
    action: "Link bank account",
    icon: FiBriefcase,
    route: "/wallet?onboarding=link-bank",
  },
  {
    key: "converted",
    title: "Make your first conversion",
    description: "Explore converting between Naira and USDT.",
    action: "Explore conversion",
    icon: FiRepeat,
    route: "/convert",
  },
  {
    key: "saved",
    title: "Create your first saving goal",
    description: "Explore SmartSave and choose a saving plan that fits you.",
    action: "Explore SmartSave",
    icon: FiTarget,
    route: "/SmartSafe",
  },
  {
    key: "invested",
    title: "Explore investment options",
    description:
      "Review available investment products and their terms before deciding.",
    action: "Explore investments",
    icon: FiTrendingUp,
    route: "/invest",
  },
];

const getStorage = (userKey) => `hedgenest:onboarding:v1:${userKey}`;

const readStoredState = (storageKey) => {
  try {
    const value = localStorage.getItem(storageKey);
    return value ? JSON.parse(value) : {};
  } catch {
    return {};
  }
};

const getArrayFromResponse = (response, keys = []) => {
  for (const key of keys) {
    const value = key
      .split(".")
      .reduce((current, part) => current?.[part], response);
    if (Array.isArray(value)) return value;
  }

  if (Array.isArray(response)) return response;
  return null;
};

const isCompletedLedgerEntry = (transaction) => {
  const status = String(
    transaction?.status ||
      transaction?.transactionStatus ||
      transaction?.paymentStatus ||
      "",
  ).toLowerCase();

  // The current transaction-history UI renders ledger entries without a status field.
  // When a status is supplied, only confirmed completion states count toward onboarding.
  if (!status) return true;

  return [
    "success",
    "successful",
    "completed",
    "complete",
    "confirmed",
    "settled",
  ].includes(status);
};

const hasTransactionType = (transactions, expectedType) => {
  return transactions.some((transaction) => {
    const type = String(
      transaction?.transactionType || transaction?.type || "",
    ).toLowerCase();

    return type === expectedType && isCompletedLedgerEntry(transaction);
  });
};

const getVisibleTarget = (targetName) => {
  const candidates = document.querySelectorAll(
    `[data-onboarding-target="${targetName}"]`,
  );

  return Array.from(candidates).find((element) => {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    return (
      rect.width > 0 &&
      rect.height > 0 &&
      style.display !== "none" &&
      style.visibility !== "hidden"
    );
  });
};

const DashboardOnboarding = ({ userKey, token, onNavigate }) => {
  const safeUserKey = userKey || "authenticated-user";
  const storageKey = useMemo(() => getStorage(safeUserKey), [safeUserKey]);

  const [completed, setCompleted] = useState({});
  const [hasLoadedPreferences, setHasLoadedPreferences] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [tourStep, setTourStep] = useState(null);
  const [isCheckingProgress, setIsCheckingProgress] = useState(false);
  const [hasProgressCheckRun, setHasProgressCheckRun] = useState(false);
  const [spotlight, setSpotlight] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState(null);

  const persist = useCallback(
    (updates) => {
      try {
        const current = readStoredState(storageKey);
        localStorage.setItem(
          storageKey,
          JSON.stringify({ ...current, ...updates }),
        );
      } catch {
        // Onboarding remains usable when browser storage is unavailable.
      }
    },
    [storageKey],
  );

  const mergeCompletion = useCallback((incoming) => {
    setCompleted((current) => {
      const next = { ...current };

      Object.entries(incoming).forEach(([key, value]) => {
        if (value === true) {
          next[key] = true;
        } else if (value === false && current[key] !== true) {
          next[key] = false;
        }
      });

      return next;
    });
  }, []);

  useEffect(() => {
    const stored = readStoredState(storageKey);
    setHasLoadedPreferences(false);
    setCompleted(stored.completed || {});
    setIsCollapsed(Boolean(stored.collapsed));

    if (!stored.tourSeen) {
      setTourStep(0);
    } else {
      setTourStep(null);
    }

    setHasProgressCheckRun(false);
    setHasLoadedPreferences(true);
  }, [storageKey]);

  // Persist client-side preferences and only completion flags that were previously
  // confirmed by backend-backed account data.
  useEffect(() => {
    if (!hasLoadedPreferences) return;

    const storedCompleted = Object.fromEntries(
      Object.entries(completed).filter(([, value]) => value === true),
    );
    persist({ completed: storedCompleted });
  }, [completed, hasLoadedPreferences, persist]);

  // Verify checklist progress from the same authenticated endpoints used by the app.
  // Failed/unavailable requests remain unknown instead of being treated as incomplete.
  useEffect(() => {
    if (!token || !hasLoadedPreferences) return undefined;

    let cancelled = false;
    const storedCompleted = readStoredState(storageKey).completed || {};
    const checksRequired = [
      storedCompleted.linkedBank !== true,
      storedCompleted.funded !== true || storedCompleted.converted !== true,
      storedCompleted.saved !== true,
      storedCompleted.invested !== true,
    ];
    const checks = [
      checksRequired[0] ? getLinkedAccounts(token) : Promise.resolve(null),
      checksRequired[1] ? getTransactionHistory(token) : Promise.resolve(null),
      checksRequired[2] ? getAllPlan(token) : Promise.resolve(null),
      checksRequired[3] ? getUserInvestments(token) : Promise.resolve(null),
    ];
    const needsCheck = checksRequired.some(Boolean);

    if (!needsCheck) {
      setHasProgressCheckRun(true);
      setIsCheckingProgress(false);
      return undefined;
    }

    setIsCheckingProgress(true);

    const checkProgress = async () => {
      const results = await Promise.allSettled(checks);

      if (cancelled) return;

      const next = {};

      // Linked-account API returns { success, linkedAccounts } in the current app.
      const linkedResult = results[0];
      if (linkedResult && linkedResult.status === "fulfilled") {
        const payload = linkedResult.value;
        const accounts = getArrayFromResponse(payload, [
          "linkedAccounts",
          "data.linkedAccounts",
          "data.data",
          "data",
        ]);

        if (accounts) next.linkedBank = accounts.length > 0;
        else if (payload?.totalAccounts === 0) next.linkedBank = false;
        else if (payload?.success === true) next.linkedBank = false;
      } else if (linkedResult && linkedResult.status === "rejected") {
        const error = linkedResult.reason;
        const status = error?.response?.status || error?.status;
        const message = String(
          error?.message || error?.response?.data?.message || "",
        ).toLowerCase();
        if (status === 404 || message.includes("no linked account")) {
          next.linkedBank = false;
        }
      }

      const transactionResult = results[1];
      if (transactionResult && transactionResult.status === "fulfilled") {
        const transactions = getArrayFromResponse(transactionResult.value, [
          "data",
          "transactions",
          "transactionHistory",
          "history",
          "data.data",
          "data.transactions",
        ]);

        if (transactions) {
          next.funded = hasTransactionType(transactions, "deposit");
          next.converted = hasTransactionType(transactions, "conversion");
        }
      }

      const savingsResult = results[2];
      if (savingsResult && savingsResult.status === "fulfilled") {
        const plans = getArrayFromResponse(savingsResult.value, [
          "plans",
          "plan",
          "data.plan",
          "data.plans",
          "data.data",
          "data",
        ]);
        if (plans) next.saved = plans.length > 0;
      }

      const investmentsResult = results[3];
      if (investmentsResult && investmentsResult.status === "fulfilled") {
        const investments = getArrayFromResponse(investmentsResult.value, [
          "data",
          "investments",
          "userInvestments",
          "data.data",
        ]);
        if (investments) next.invested = investments.length > 0;
      }

      mergeCompletion(next);
      setHasProgressCheckRun(true);
      setIsCheckingProgress(false);
    };

    checkProgress().catch(() => {
      if (!cancelled) {
        setHasProgressCheckRun(true);
        setIsCheckingProgress(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [token, storageKey, hasLoadedPreferences, mergeCompletion]);

  const finishTour = useCallback(() => {
    persist({ tourSeen: true });
    setTourStep(null);
    setSpotlight(null);
    setTooltipPosition(null);
  }, [persist]);

  const openTour = useCallback(() => {
    setTourStep(0);
  }, []);

  const currentTourStep = tourStep === null ? null : TOUR_STEPS[tourStep];

  useEffect(() => {
    if (!currentTourStep) {
      setSpotlight(null);
      setTooltipPosition(null);
      return undefined;
    }

    let resizeFrame;
    let fallbackTimer;

    const updatePosition = () => {
      const target = getVisibleTarget(currentTourStep.target);
      if (!target) {
        setSpotlight(null);
        setTooltipPosition(null);
        return;
      }

      const rect = target.getBoundingClientRect();
      const padding = 7;
      const top = Math.max(8, rect.top - padding);
      const left = Math.max(8, rect.left - padding);
      const width = Math.min(
        window.innerWidth - left - 8,
        rect.width + padding * 2,
      );
      const height = Math.min(
        window.innerHeight - top - 8,
        rect.height + padding * 2,
      );
      const center = left + width / 2;
      const tooltipWidth = Math.min(380, window.innerWidth - 32);
      const tooltipHeightEstimate = 230;
      const belowTop = top + height + 14;
      const placeBelow =
        belowTop + tooltipHeightEstimate <= window.innerHeight - 12;
      const tooltipTop = placeBelow
        ? belowTop
        : Math.max(12, top - tooltipHeightEstimate - 14);
      const tooltipLeft = Math.min(
        Math.max(16, center - tooltipWidth / 2),
        window.innerWidth - tooltipWidth - 16,
      );

      setSpotlight({ top, left, width, height });
      setTooltipPosition({
        top: tooltipTop,
        left: tooltipLeft,
        width: tooltipWidth,
      });
    };

    const target = getVisibleTarget(currentTourStep.target);
    target?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });

    fallbackTimer = window.setTimeout(updatePosition, 180);
    resizeFrame = window.requestAnimationFrame(updatePosition);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    const handleKeyDown = (event) => {
      if (event.key === "Escape") finishTour();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentTourStep, finishTour]);

  const progressCount = TASKS.filter(
    (task) => completed[task.key] === true,
  ).length;
  const allTasksComplete = progressCount === TASKS.length;

  const handleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    persist({ collapsed: next });
  };

  const handleTaskAction = (task) => {
    onNavigate(task.route);
  };

  const handleNextTourStep = () => {
    if (tourStep === TOUR_STEPS.length - 1) {
      finishTour();
      return;
    }
    setTourStep((current) => current + 1);
  };

  const handlePreviousTourStep = () => {
    setTourStep((current) => Math.max(0, current - 1));
  };

  return (
    <>
      <section
        className={`dashboard-onboarding ${isCollapsed ? "is-collapsed" : ""}`}
        aria-label="Get started with HedgeNest"
      >
        {isCollapsed ? (
          <button
            type="button"
            className="onboarding-reopen"
            onClick={handleCollapse}
          >
            <FiCompass aria-hidden="true" />
            <span>Get started guide</span>
            <FiChevronDown aria-hidden="true" />
          </button>
        ) : (
          <>
            <div className="onboarding-header">
              <div className="onboarding-title-group">
                <span className="onboarding-mark" aria-hidden="true">
                  <FiCompass />
                </span>
                <div>
                  <p className="onboarding-eyebrow">YOUR HEDGENEST GUIDE</p>
                  <h2>
                    {allTasksComplete
                      ? "You're all set"
                      : "Quick steps to get started"}
                  </h2>
                  <p className="onboarding-subtitle">
                    {allTasksComplete
                      ? "You've explored the key steps. You can reopen this guide whenever you need it."
                      : "A few simple steps to help you get familiar with your account."}
                  </p>
                </div>
              </div>
              <div className="onboarding-header-actions">
                <button
                  type="button"
                  className="onboarding-tour-button"
                  onClick={openTour}
                >
                  <FiCompass aria-hidden="true" />
                  <span>Take dashboard tour</span>
                </button>
                <button
                  type="button"
                  className="onboarding-collapse-button"
                  onClick={handleCollapse}
                  aria-label="Collapse get started guide"
                  title="Collapse guide"
                >
                  <FiChevronUp aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="onboarding-progress-row">
              <div className="onboarding-progress-copy">
                <span>Your progress</span>
                <strong>
                  {progressCount} of {TASKS.length} completed
                </strong>
              </div>
              <div
                className="onboarding-progress-track"
                role="progressbar"
                aria-label="Onboarding progress"
                aria-valuemin={0}
                aria-valuemax={TASKS.length}
                aria-valuenow={progressCount}
              >
                <span
                  style={{ width: `${(progressCount / TASKS.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="onboarding-task-list">
              {TASKS.map((task, index) => {
                const Icon = task.icon;
                const isComplete = completed[task.key] === true;
                const isUnknown =
                  completed[task.key] === undefined ||
                  completed[task.key] === null;

                return (
                  <article
                    className={`onboarding-task ${isComplete ? "is-complete" : ""}`}
                    key={task.key}
                  >
                    <div
                      className={`onboarding-task-icon ${isComplete ? "is-complete" : ""}`}
                    >
                      {isComplete ? (
                        <FiCheck aria-hidden="true" />
                      ) : (
                        <Icon aria-hidden="true" />
                      )}
                    </div>

                    <div className="onboarding-task-content">
                      <div className="onboarding-task-heading">
                        <span className="onboarding-step-label">
                          STEP {index + 1}
                        </span>
                        {isComplete && (
                          <span className="onboarding-complete-label">
                            Completed
                          </span>
                        )}
                      </div>
                      <h3>{task.title}</h3>
                      <p>{task.description}</p>
                      {isUnknown &&
                        hasProgressCheckRun &&
                        !isCheckingProgress &&
                        task.key !== "funded" && (
                          <span className="onboarding-status-note">
                            Progress could not be verified yet.
                          </span>
                        )}
                    </div>

                    <button
                      type="button"
                      className="onboarding-task-action"
                      onClick={() => handleTaskAction(task)}
                      aria-label={`${task.action}: ${task.title}`}
                    >
                      <span>{isComplete ? "Open again" : task.action}</span>
                      <FiExternalLink aria-hidden="true" />
                    </button>
                  </article>
                );
              })}
            </div>

            <div className="onboarding-footer">
              <p>
                {isCheckingProgress
                  ? "Checking your progress against your account data…"
                  : "Progress is updated from your account data when available. Explore at your own pace."}
              </p>
              <button
                type="button"
                className="onboarding-text-button"
                onClick={openTour}
              >
                Show me around <FiArrowRight aria-hidden="true" />
              </button>
            </div>
          </>
        )}
      </section>

      {currentTourStep && (
        <div className="dashboard-tour" role="presentation">
          <div className="dashboard-tour-backdrop" />
          {spotlight && (
            <div
              className="dashboard-tour-spotlight"
              style={{
                top: spotlight.top,
                left: spotlight.left,
                width: spotlight.width,
                height: spotlight.height,
              }}
              aria-hidden="true"
            />
          )}
          <section
            className="dashboard-tour-card"
            style={
              tooltipPosition || {
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }
            }
            role="dialog"
            aria-modal="true"
            aria-labelledby="dashboard-tour-title"
            aria-describedby="dashboard-tour-description"
          >
            <div className="dashboard-tour-card-topline">
              <span>HEDGENEST DASHBOARD TOUR</span>
              <button
                type="button"
                onClick={finishTour}
                aria-label="Skip tour"
                title="Skip tour"
              >
                <FiX aria-hidden="true" />
              </button>
            </div>
            <div className="dashboard-tour-count">
              STEP {tourStep + 1} OF {TOUR_STEPS.length}
            </div>
            <h2 id="dashboard-tour-title">{currentTourStep.title}</h2>
            <p id="dashboard-tour-description">{currentTourStep.description}</p>
            <div className="dashboard-tour-bottom">
              <button
                type="button"
                className="dashboard-tour-skip"
                onClick={finishTour}
              >
                Skip tour
              </button>
              <div className="dashboard-tour-controls">
                {tourStep > 0 && (
                  <button
                    type="button"
                    className="dashboard-tour-back-button"
                    onClick={handlePreviousTourStep}
                  >
                    <FiArrowLeft aria-hidden="true" /> Back
                  </button>
                )}
                <button
                  type="button"
                  className="dashboard-tour-next-button"
                  onClick={handleNextTourStep}
                >
                  {tourStep === TOUR_STEPS.length - 1 ? "Finish" : "Next"}
                  {tourStep !== TOUR_STEPS.length - 1 && (
                    <FiArrowRight aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default DashboardOnboarding;
