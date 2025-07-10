import { useCallback, useState, useEffect } from "react";
import { tokenContract } from "../constants/tokenContract";
import { useAppKitAccount } from "@reown/appkit/react";


const useGetUsedyToken = () => {
  const { address } = useAppKitAccount();
  const [userBal, setUserBal] = useState(0);

  const fetchBalance = useCallback(async (address) => {
    try {
      const tx = await tokenContract.balanceOf(address);
      setUserBal(tx);
    } catch (err) {
    console.log(err)
    }
  }, []);

  useEffect(() => {
    fetchBalance(address);
  }, [fetchBalance, address]);

  return userBal;
};

export default useGetUsedyToken;