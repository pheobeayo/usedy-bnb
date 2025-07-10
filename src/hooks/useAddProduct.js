import { useCallback } from "react";
import useContractInstance from "./useContractInstance";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { toast } from "react-toastify";
import { bscTestnet } from "@reown/appkit/networks";
import { ErrorDecoder } from "ethers-decode-error";
import abi from "../constants/abi.json";

const useAddProduct = () => {
  const contract = useContractInstance(true);
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const errorDecoder = ErrorDecoder.create([abi]);

  return useCallback(
    async (productName, imageUrl, productDesc, amount, productWeight) => {
      if (!productName || !imageUrl || !productDesc || !amount || !productWeight) {
        toast.error("Invalid input!");
        return;
      }

      if (!address) {
        toast.error("Please connect your wallet");
        return;
      }

      if (!contract) {
        toast.error("Contract not found");
        return;
      }

      if (Number(chainId) !== Number(bscTestnet.id)) {
        toast.error("You're not connected to Bsc Testnet");
        return;
      }

      try {
        const tx = await contract.listProduct(productName, imageUrl, productDesc, amount, productWeight);
        const receipt = await tx.wait();

        if (receipt.status === 1) {
          toast.success("Product Listing Successful");
          return;
        }

        toast.error("Failed to List product");
        return;
      } catch (err) {
        const decodedError = await errorDecoder.decode(err);
        toast.error(`Failed to List Product - ${decodedError.reason}`, {
          position: "top-center",
        });
      }
    },
    [contract, address, chainId]
  );
};

export default useAddProduct;
