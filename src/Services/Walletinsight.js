export const getFinancialInsight = async (token) => {
  if (!token) throw new Error("Authentication token required");

  const curatedInsights = [
    "💸 Inflation is a quiet tax on stagnant cash. Strategic diversification into stable assets preserves your real purchasing power. 🛡️",
    "🔄 Automating your currency conversions blocks local devaluation cycles and maintains cross-border capital stability. 🌐",
    "📊 Do not save what is left after spending; instead, spend what is left after executing your daily savings plan. 💰",
    "🌱 Compound interest transforms consistent accumulation into lasting leverage. Start small, remain disciplined, and let time compound. 📈",
    "🎯 Dollar-cost averaging mitigates emotional trading pitfalls. Consistency outperforms market timing over every historical cycle. ⏱️",
    "🔐 Wealth generation relies heavily on asset custody choices. Protect your family's future value by retaining inflation-resistant balances. 💎",
    "🚀 Financial freedom isn't merely an income milestone; it is the deliberate preservation of choice through smart liquidity allocation. 🕊️",
  ];

  try {
    // 🔀 TESTING MODE: Changes based on the current second so you can see it rotate live
    const currentSecond = new Date().getSeconds();
    const dynamicIndex = currentSecond % curatedInsights.length;

    // Alternative: If you want a brand new insight on EVERY single click/refresh:
    // const dynamicIndex = Math.floor(Math.random() * curatedInsights.length);

    await new Promise((resolve) => setTimeout(resolve, 1150));

    return {
      success: true,
      insight: curatedInsights[dynamicIndex],
    };
  } catch (error) {
    console.error("Insight engine execution breakdown:", error);
    return {
      success: false,
      insight:
        "🛡️ Automating asset preservation shields capital allocations against structural currency erosion. ⚙️",
    };
  }
};
