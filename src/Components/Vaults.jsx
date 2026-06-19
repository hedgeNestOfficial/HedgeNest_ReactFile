import React from "react";
import { RiLockLine, RiLockUnlockLine } from "react-icons/ri";
import "../Style/Vaults.css";

const Vaults = ({ vaultsData = [], onTopUp, onWithdraw, onToggleAutoSave }) => {
  if (!Array.isArray(vaultsData) || vaultsData.length === 0) return null;

  return (
    <div className="vault-wrap">
      {vaultsData.map((vault) => {
        const vaultId = vault.id;
        const isLocked = vault.type?.toUpperCase() === "LOCKED";
        const progressPercentage = vault.interestRate; // Explicitly driven by interestRate

        return (
          <article key={vaultId} className="vault-card">
            {/* Badge */}
            <div className="badge">
              {isLocked ? (
                <RiLockLine className="badge-icon icon-gold" />
              ) : (
                <RiLockUnlockLine className="badge-icon icon-gold" />
              )}
              <span className="badge-text">{vault.type?.toUpperCase()}</span>
            </div>

            {/* Title */}
            <h2 className="vault-name">{vault.title}</h2>

            {/* Amount */}
            <div className="amount-group">
              <span className="vault-currency">₦</span>
              <span className="vault-balance">
                {Number(vault.targetAmount).toLocaleString()}
              </span>
              <div className="top-up">
                <h3>Top Up</h3>
                <div>
                  <span className="vault-currency">₦</span>
                  <span className="vault-balance">
                    {Number(vault.balance).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar driven by Interest Rate */}
            <div className="progress-container">
              <div
                className="progress-fill"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            {/* Metrics Row */}
            <div className="metrics-row">
              <span className="rate-lbl">{vault.interestRate}% p.a.</span>
              <span
                className="freq-lbl"
                style={{ textTransform: isLocked ? "none" : "uppercase" }}
              >
                {vault.frequency}
              </span>
            </div>

            {/* Actions */}
            <div className="action-row">
              {!isLocked && (
                <button
                  className="btn-gold-action"
                  onClick={() => onTopUp?.(vault)}
                >
                  Top Up
                </button>
              )}

              <button
                className={isLocked ? "btn-gold-full" : "btn-white-action"}
                onClick={() => onWithdraw?.(vault)}
              >
                Withdraw
              </button>
            </div>

            {/* AutoSave */}
            {!isLocked && (
              <footer className="card-footer">
                <span
                  className={`footer-lbl ${vault.autoSave ? "lbl-active" : ""}`}
                >
                  {vault.autoSave ? "Auto-Save Enabled" : "Enable Auto-Save"}
                </span>

                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={!!vault.autoSave}
                    onChange={() => onToggleAutoSave?.(vaultId)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </footer>
            )}
          </article>
        );
      })}
    </div>
  );
};

export default Vaults;
