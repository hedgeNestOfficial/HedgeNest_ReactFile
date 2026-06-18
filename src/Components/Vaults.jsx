import React from "react";
import { RiLockLine, RiLockUnlockLine } from "react-icons/ri";
import "../Style/Vaults.css";

const Vaults = ({ vaultsData = [], onTopUp, onWithdraw, onToggleAutoSave }) => {
  return (
    <div className="vault-wrap">
      {vaultsData.map((vault) => {
        const vaultId = vault.id || vault._id;

        const isLocked =
          (vault.planType || vault.type)?.toUpperCase() === "LOCKED";

        return (
          <article key={vaultId} className="vault-card">
            {/* Badge */}
            <div className="badge">
              {isLocked ? (
                <RiLockLine className="badge-icon icon-gold" />
              ) : (
                <RiLockUnlockLine className="badge-icon icon-gold" />
              )}

              <span className="badge-text">
                {(vault.planType || vault.type)?.toUpperCase()}
              </span>
            </div>

            {/* Title */}
            <h2 className="vault-name">{vault.title}</h2>

            {/* Amount */}
            <div className="amount-group">
              <span className="vault-currency">₦</span>
              <span className="vault-balance">
                {Number(
                  vault.balance ?? vault.targetAmount ?? 0,
                ).toLocaleString()}
              </span>
            </div>

            
            <div className="progress-container">
              <div
                className="progress-fill"
                style={{ width: `${vault.progress || 0}%` }}
              />
            </div>

            <div className="metrics-row">
              <span className="rate-lbl">{vault.rate || "14%"} p.a.</span>

              <span className="freq-lbl">
                {vault.frequency || vault.savingFrequency || "DAILY"}
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
                    onChange={() => onToggleAutoSave(vaultId)}
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
