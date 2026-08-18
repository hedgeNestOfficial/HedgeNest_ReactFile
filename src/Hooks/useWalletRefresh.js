import { useDispatch, useSelector } from "react-redux";
import { getMyWallet } from "../Services/Walletservice";
import { updateWallet } from "../Store/UserSlice";

export const useWalletRefresh = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);

  const refreshWallet = async () => {
    try {
      if (!token) return null;

      const response = await getMyWallet(token);

      console.log("Wallet Response");

      const walletData = response?.data?.[0];

      if (walletData) {
        dispatch(updateWallet(walletData));
      }

      return walletData;
    } catch (error) {
      console.log("Wallet refresh failed:", error);
      return null;
    }
  };

  return refreshWallet;
};
