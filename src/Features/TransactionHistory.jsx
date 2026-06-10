import "../Style/TransactionHistory.css";

export const TransactionHistory = ({ transactions = [] }) => {
  return (
    <div className="transaction-card">
      <div className="trans-header">
        <button className="back-btn">←</button>

        <h3>Transactions</h3>
      </div>

      <div className="trans-list">
        {transactions.length > 0 ? (
          transactions.map((t) => (
            <div key={t.id} className="trans-item">
              <div className={`icon-box ${t.type}`}>
                {t.type === "in" ? "↙" : "↗"}
              </div>

              <div className="details">
                <p className="title">{t.title}</p>

                <p className="subtitle">{t.description}</p>
              </div>

              <div className={`amount ${t.type}`}>
                {t.type === "in" ? "+" : "-"} ₦
                {Number(t.amount).toLocaleString()}
              </div>
            </div>
          ))
        ) : (
          <p className="no-transaction">No transactions yet</p>
        )}
      </div>
    </div>
  );
};
