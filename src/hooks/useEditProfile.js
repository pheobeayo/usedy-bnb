import { useCallback } from "react";
import useContractInstance from "./useContractInstance";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { toast } from "react-toastify";
import { bscTestnet } from "@reown/appkit/networks";
import { ErrorDecoder } from "ethers-decode-error";
import abi from "../constants/abi.json";

const useEditProfile = () => {
  const contract = useContractInstance(true);
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const errorDecoder = ErrorDecoder.create([abi]);

  return useCallback(
    async (location, mail) => {
      if (!location || !mail) {
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
        toast.error("You're not connected to BSC Network");
        return;
      }

      try {
        const tx = await contract.updateProfile(location, mail);
        const receipt = await tx.wait();

        if (receipt.status === 1) {
          toast.success("Profile Edit Successful");
          return;
        }

        toast.error("Failed to edit Profile");
        return;
      } catch (err) {
        const decodedError = await errorDecoder.decode(err);
        toast.error(`Failed to edit Profile - ${decodedError.reason}`, {
          position: "top-center",
        });
      }
    },
    [contract, address, chainId]
  );
};

export default useEditProfile;