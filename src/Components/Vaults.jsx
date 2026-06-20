import React from "react";
import { RiLockLine, RiLockUnlockLine } from "react-icons/ri";
import "../Style/Vaults.css";

const Vaults = ({ vaultsData = [], onTopUp, onWithdraw, onToggleAutoSave }) => {
  if (!Array.isArray(vaultsData) || vaultsData.length === 0) return null;

  return (
    <div className="vault-wrap">
      {vaultsData.map((vault) => {
        const vaultId = vault.id;
        const vaultTypeUpper = vault.type?.toUpperCase();

        const isLocked = vaultTypeUpper === "LOCKED";
        const isStealth = vaultTypeUpper === "STEALTH";
        const isFlexible = vaultTypeUpper === "FLEXIBLE";

        const progressPercentage = vault.interestRate;

        return (
          <article key={vaultId} className="vault-card">
            <div className="badge">
              {isFlexible ? (
                <RiLockUnlockLine className="badge-icon icon-gold" />
              ) : (
                <RiLockLine className="badge-icon icon-gold" />
              )}
              <span className="badge-text">{vaultTypeUpper}</span>
            </div>

            <h2 className="vault-name">{vault.title}</h2>

            <div className="amount-group">
              <span className="vault-currency">₦</span>
              <span className="vault-balance">
                {Number(vault.targetAmount).toLocaleString()}
              </span>

              {isFlexible && (
                <div className="top-up">
                  <h3>Top Up</h3>
                  <div>
                    <span className="vault-currency">₦</span>
                    <span className="vault-balance">
                      {Number(vault.balance).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="progress-container">
              <div
                className="progress-fill"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <div className="metrics-row">
              <span className="rate-lbl">{vault.interestRate}% p.a.</span>
              <span
                className="freq-lbl"
                style={{ textTransform: isFlexible ? "uppercase" : "none" }}
              >
                {vault.frequency}
              </span>
            </div>

            {/* Actions */}
            <div className="action-row">
              {isFlexible && (
                <button
                  className="btn-gold-action"
                  onClick={() => onTopUp?.(vault)}
                >
                  Top Up
                </button>
              )}

              <button
                className={isFlexible ? "btn-white-action" : "btn-gold-full"}
                disabled={isStealth}
                onClick={() => onWithdraw?.(vault)}
                style={
                  isStealth
                    ? {
                        background: "#fef9e7",
                        color: "#b89047",
                        borderColor: "#e8d7b0",
                        cursor: "not-allowed",
                        opacity: 0.9,
                      }
                    : undefined
                }
              >
                Withdraw
              </button>
            </div>

            {isFlexible && (
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
