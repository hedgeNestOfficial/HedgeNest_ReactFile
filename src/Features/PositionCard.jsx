import "../Style/PositionCard.css";
export const PositionCard = ({ position }) => {
  const isPositive = position.change > 0;
  const arrow = isPositive ? "▲" : "▼";
  const changeClass = isPositive ? "positive" : "negative";

  return (
    <div className="position-card">
      <div className="pos-header">
        <div className="pos-title">
          <span className={changeClass}>{arrow}</span> <h3>{position.name}</h3>
        </div>
        <div className="pos-amount">₦{position.amount.toLocaleString()}</div>
      </div>
      <div className={`pos-change ${changeClass}`}>
        <span className={changeClass}>{arrow}</span> {isPositive ? "+" : ""}
        {position.change}%
      </div>

      <div className="pos-footer">
        <div className="info">
          <span>Expected: ₦{position.expected.toLocaleString()}</span>
          <span>Matures {position.maturityDate}</span>
        </div>
        <div className="pos-actions">
          <button className="btn-secondary">Top Up</button>
          <button className="btn-outline">Withdraw</button>
        </div>
      </div>
    </div>
  );
};
