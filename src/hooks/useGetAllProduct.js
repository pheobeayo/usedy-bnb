import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { useState, useCallback, useEffect } from "react";
import useContractInstance from "./useContractInstance";

const useGetAllProduct = () => {
  const contract = useContractInstance(true);
  const [allProduct, setAllProduct] = useState([]);
  const { isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");

  const getAllProduct = useCallback(async () => {
    if (!isConnected || !walletProvider || !contract) return;

    const convertIpfsUrl = (url) => {
      if (url.startsWith("ipfs://")) {
        return url.replace("ipfs://", "https://ipfs.io/ipfs/");
      }
      return url;
    };

    try {
      const data = await contract.getAllproduct();

      const converted = data?.map((item, index) => {
        return {
          id: index + 1,
          address: item[0],
          name: item[1],
          image: convertIpfsUrl(item[2]),
          location: item[3],
          product: item[4],
          price: item[5],
          weight: item[6],
          sold: item[7],
          inProgress: item[8],
        };
      });
      setAllProduct(converted);
    } catch (error) {
      console.log("Error fetching all Product", error);
      setAllProduct([]);
    }
  }, [isConnected, walletProvider, contract]);

  useEffect(() => {
    getAllProduct();
  }, [getAllProduct]);

  return {
    allProduct: Array.isArray(allProduct) ? allProduct : [],
  };
};

export default useGetAllProduct;
