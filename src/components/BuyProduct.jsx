import { useState, useCallback } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useAppKitAccount, useAppKitNetwork, useAppKitProvider } from "@reown/appkit/react";
import { toast } from "react-toastify";
import { bscTestnet } from "@reown/appkit/networks";
import { ErrorDecoder } from "ethers-decode-error";
import abi from "../constants/abi.json";
import { ethers, Contract } from "ethers";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  color: "white",
  transform: "translate(-50%, -50%)",
  width: 400,
  borderRadius: 10,
  boxShadow: 24,
  border: "1px solid #42714262",
  backgroundColor: "#1E1D34",
  p: 4,
};

const BuyProduct = ({ id, price }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [amount, setAmount] = useState(0);
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const errorDecoder = ErrorDecoder.create([abi]);
   const { walletProvider } = useAppKitProvider("eip155");
 

  const handleBuyProduct = useCallback(async (id, amount) => {
    if (!id || !amount) {
      toast.error("Invalid input!");
      return;
    }

    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    if (Number(chainId) !== Number(bscTestnet.id)) {
      toast.error("You're not connected to Bsc Testnet");
      return;
    }
    const getProvider = (provider) => new ethers.BrowserProvider(provider);
    const readWriteProvider = getProvider(walletProvider);
    const signer = await readWriteProvider.getSigner();

    const contract = new Contract(
      import.meta.env.VITE_CONTRACT_ADDRESS,
      abi,
      signer
    );

    const total = ethers.parseUnits(price.toString(), 18) * BigInt(amount);

    try {
      const transaction = await contract.buyProduct(id, amount, {
        value: total,
      });

      const receipt = await transaction.wait();

      if (receipt.status) {
        return toast.success("Product purchase successful!", {
          position: "top-center",
        });
      }

      toast.error("Product purchase failed", {
        position: "top-center",
      });
    } catch (err) {
      const decodedError = await errorDecoder.decode(err);
      toast.error(`Product purchase failed - ${decodedError.reason}`, {
        position: "top-center",
      });
      console.log(decodedError.reason);
    } finally {
      setAmount(0);
      setOpen(false);
    }
  }, []);

  return (
    <div>
      <div>
        <button
          className="bg-white text-[#0C3B45] border border-[#0C3B45] py-2 px-4 rounded-lg lg:text-[20px] md:text-[20px] font-bold text-[16px] w-[100%] my-2 hover:bg-bg-ash hover:text-darkGrey hover:font-bold"
          onClick={handleOpen}
        >
          Buy Products
        </button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <input
              type="text"
              placeholder="Product ID"
              value={id}
              className="text-white rounded-lg w-[100%] p-4 bg-[#2E343A] border border-white/50 backdrop-blur-lg mb-4 outline-none hidden"
              readonly
            />
            <input
              type="text"
              value={amount}
              placeholder="How many Item?"
              onChange={(e) => setAmount(e.target.value)}
              className="text-white rounded-lg w-[100%] p-4 bg-[#2E343A] border border-white/50 backdrop-blur-lg mb-4 outline-none"
            />
            <button
              className="bg-[#2E343A] text-[white] py-2 px-4 rounded-lg lg:text-[20px] md:text-[20px] font-bold text-[16px] w-[100%] my-4"
              onClick={() => handleBuyProduct(id, amount)}
            >
              Buy Product &rarr;
            </button>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default BuyProduct;
