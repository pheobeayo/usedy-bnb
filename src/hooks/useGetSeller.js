import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { useState, useCallback, useEffect } from "react";
import useContractInstance from "./useContractInstance";

const useGetSeller = () => {
  const contract = useContractInstance(true);
  const [allSeller, setAllSeller] = useState([]);
  const { isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");

  const getAllSeller = useCallback(async () => {
    if (!isConnected || !walletProvider || !contract) return;

    try {
      const data = await contract.getallSeller();

      const converted = data?.map((item, index) => {
        return {
          address: item[0],
          id: item[1],
          name: item[2],
          location: item[3],
          mail: item[4],
          product: item[5],
          weight: item[6],
          payment: item[7],
        };
      });
      setAllSeller(converted);
    } catch (error) {
      console.log("Error fetching all seller", error);
      setAllSeller([]);
    }
  }, [isConnected, walletProvider, contract]);

  useEffect(() => {
    getAllSeller();
  }, [getAllSeller]);

  return {
    allSeller: Array.isArray(allSeller) ? allSeller : [],
  };
};

export default useGetSeller;
