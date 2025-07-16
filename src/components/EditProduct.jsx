import { useState } from "react";
import { ethers } from "ethers";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import useEditProduct from "../hooks/usEditProduct";
import usePinataUpload from "../hooks/usePinataUpload";
import LoadingSpinner from "./Loader/LoadingSpinner";
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

const EditProduct = ({ id }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleEdit = useEditProduct();
  const { uploadToPinata, isUploading } = usePinataUpload();

  const [selectedFile, setSelectedFile] = useState();
  const [imageUrl, setImageUrl] = useState("");
  const [productName, setProductName] = useState("");
  const [productWeight, setProductWeight] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [error, setError] = useState("");

  const handleEditproduct = async () => {
    const amount = ethers.parseUnits(productPrice);
    await handleEdit(id, productName, imageUrl, productDesc, amount, productWeight);
    setImageUrl("");
    setProductName("");
    setProductDesc("");
    setProductPrice("");
    setProductWeight("");
    handleClose();
  };

  const changeHandler = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > 1) {
        setError("File size exceeds 1MB. Please choose a smaller file.");
        setSelectedFile(null);
      } else {
        setError("");
        setSelectedFile(file);
        try {
          const uploadedUrl = await uploadToPinata(file);
          setImageUrl(uploadedUrl);
        } catch (error) {
          console.error("File upload failed:", error);
        }
      }
    }
  };

  return (
    <div>
      <button
        className="border border-[#0C3B45] text-[#0C3B45] py-2 px-4 rounded-lg text-[18px] font-bold w-[100%] my-2 hover:bg-bg-ash hover:text-darkGrey hover:font-bold"
        onClick={handleOpen}
      >
        Edit Products
      </button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <label className="form-label font-bold text-[20px] font-titiliumweb">
            Select a Product Image
          </label>
          <p className="mb-2">Image URL (Below 1mb)</p>
          {imageUrl ? (
            <input
              type="text"
              value={imageUrl}
              placeholder="Organization Image"
              className="border mb-4 border-white/20 w-[100%] rounded-md hover:outline-0 p-3"
              readOnly
            />
          ) : (
            <div className="relative mb-4 w-[100%]">
              <input
                type="file"
                required
                onChange={changeHandler}
                className={`border mb-4 border-white/20 bg-transparent w-[100%] rounded-md hover:outline-0 p-3 ${
                  isUploading ? "cursor-not-allowed" : ""
                }`}
                disabled={isUploading}
              />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-lg">
                  <div className="loader"><LoadingSpinner /></div>
                </div>
              )}
            </div>
          )}
           <input
            type="text"
            value={id}
            readOnly
            className="border mb-4 border-white/20 w-[100%] rounded-md hover:outline-0 p-3"
          />
          <p className="mb-2">Product Name</p>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Enter product name"
            className="border mb-4 border-white/20 w-[100%] rounded-md hover:outline-0 p-3"
          />
          <p className="mb-2">Product Description</p>
          <input
            type="text"
            value={productDesc}
            onChange={(e) => setProductDesc(e.target.value)}
            placeholder="Enter product description"
            className="border mb-4 border-white/20 w-[100%] rounded-md hover:outline-0 p-3"
          />
          <p className="mb-2">Quantity</p>
          <input
            type="text"
            value={productWeight}
            onChange={(e) => setProductWeight(e.target.value)}
            placeholder="Enter quantity"
            className="border mb-4 border-white/20 w-[100%] rounded-md hover:outline-0 p-3"
          />
          <p className="mb-2">Product Price</p>
          <input
            type="text"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            placeholder="Enter product price"
            className="border mb-4 border-white/20 w-[100%] rounded-md hover:outline-0 p-3"
          />
          <button
            className="bg-[#073F77] text-[white] py-2 px-4 rounded-lg lg:text-[20px] md:text-[20px] font-bold text-[16px] w-[100%] my-4"
            onClick={handleEditproduct}
          >
            Edit Product &rarr;
          </button>
        </Box>
      </Modal>
    </div>
  );
};

export default EditProduct;