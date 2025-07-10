import React, { useState, useEffect } from "react";
import { readOnlyProvider } from "../../constants/readOnlyProvider";
import { formatUnits, Contract } from 'ethers';
import { useAppKitAccount } from "@reown/appkit/react";
import bgIcon from '../../assets/transaction.png'
import { useNavigate } from 'react-router-dom'
import useGetAllProduct from "../../hooks/useGetAllProduct";
import useGetSeller from "../../hooks/useGetSeller";
import emptyPurchase from "../../assets/order.png"
import ApprovePayment from "../../components/ApprovePayment";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import abi from '../../constants/abi.json'

const Transactions = () => {
  const navigate = useNavigate();
  const { allSeller } = useGetSeller();
  const { address } = useAppKitAccount();
  const { allProduct } = useGetAllProduct();
  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [purchase, setPurchase] = useState()
  const [approved, setApproved] = useState([])

  const [buyerAddress, setBuyerAddress] = useState(`${address}`);
  const userSeller = allSeller.find((data) => data?.address.toLowerCase() === address.toLowerCase());

  useEffect(() => {
    const fetchEvents = async () => {
      const contract = new Contract(import.meta.env.VITE_CONTRACT_ADDRESS, abi, readOnlyProvider);
      const deploymentBlockNumber = 57573073; 

      const filter = contract.filters.ProductBought(buyerAddress);
      const events = await contract.queryFilter(filter, deploymentBlockNumber, 'latest'); 
      const approveFilter = contract.filters.PaymentApproved(buyerAddress);
      const approveEvent = await contract.queryFilter(approveFilter, deploymentBlockNumber, 'latest')

      const purchases = events.map(event => event.args);
      const converted = purchases?.map((item, index)=>{
        return{
            address: item[0],
            id: Number(item[1]),
            quantity: Number(item[2]),
      }      
    }) 
    const approvedItem = approveEvent.map(event => event.args);
    const convertedItem = approvedItem?.map((item, index)=>{
      return{
          address: item[0],
          id: Number(item[1]),
          amount: Number(item[2]),
    }      
  }) 
      setPurchase(converted);
      setApproved(convertedItem);
    };

    fetchEvents();
  }, [buyerAddress]);

  return (
    <main>
       <section className='flex flex-col lg:flex-row md:flex-row bg-[#0C3B45] rounded-[20px] w-[100%] text-white'>
        <div className='lg:w-[60%] md:w-[60%] w-[100%] p-8'>
            <h2 className='lg:text-[24px] md:text-[24px] text-[18px] font-bold mb-4'>GreeenEarns - Where environmental consciousness meets blockchain innovation</h2>
            <p>View all your eco-friendly product purchases in one place. Track your contributions to a greener planet with each sustainable product you buy.</p>
            <div className='mt-6'>
            <button onClick={() => navigate('/dashboard/marketplace')}  className="bg-white text-[#0C3B45] py-2 px-4 rounded-lg lg:text-[20px] md:text-[20px] font-bold text-[16px] lg:w-[50%] md:w-[50%] w-[100%] my-2 hover:bg-[#C7D5D8] hover:font-bold">Buy Product</button>
            </div>
        </div>
        <div className='lg:w-[40%] md:w-[40%] w-[100%] bg-[#C7D5D8] lg:rounded-tl-[50%] md:rounded-tl-[50%] lg:rounded-bl-[50%] rounded-tl-[50%] rounded-tr-[50%] text-right lg:rounded-tr-[20px] rounded-bl-[20px] rounded-br-[20px] p-6 flex justify-center'>
            <img src={bgIcon} alt="dashboard" className='w-[70%] mx-auto'/>
        </div>
    </section>
    <section>
    <h2 className="font-titiliumweb text-[20px] text-[#0F160F] lg:text-[24px] md:text-[24px] font-[700] mt-4">
        Purchased Products
      </h2>
    <div className="flex mb-6 text-[#0F160F] items-center">
        <img
          src='https://img.freepik.com/free-psd/abstract-background-design_1297-86.jpg?t=st=1719630441~exp=1719634041~hmac=3d0adf83dadebd27f07e32abf8e0a5ed6929d940ed55342903cfc95e172f29b5&w=2000'
          alt=""
          className='w-[40px] h-[40px] rounded-full'
        />
        {userSeller ? (
          <p className='ml-4 font-bold'>{userSeller.name}</p>
        ) : (
          <p>Unregistered.</p>
        )}
      </div>
    </section>
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Purchased Items" value="1" />
            <Tab label="Approved Items" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
    <section className="text-[#0F160F] flex lg:flex-row md:flex-row flex-col justify-between">
    {purchase?.length === 0 ? (
      <div className="flex flex-col items-center w-full text-[rgb(15,22,15)]">
          <img src={emptyPurchase} alt="" />
          <p>No purchase yet</p>
          </div>
        ) : (purchase?.map((p, index) => {
          const userPurchase = allProduct.find((data) => data?.id === p.id);
          return (
            <div key={index} className="border p-4 mb-4 rounded-lg shadow-md lg:w-[32%] md:w-[32%] w-[100%]">
              <p className="my-4"><strong>Quantity:</strong> {p.quantity}</p>
              {userPurchase ? (
                <div>
                  <img src={userPurchase.image} alt="" className="w-[300px] h-[300px] mb-4" />
                  <p><strong>Product Name:</strong> {userPurchase.name}</p>
                  <p className='flex justify-between my-4 font-bold'>Price <span>{formatUnits(userPurchase.price)}tBNB</span> </p>
                </div>
              ) : (
                <p>Product details not available.</p>
              )}
              {approved?.map((item) => {
        return item.address !== address ? (
          <ApprovePayment key={item.id} id={p.id} index={index} />
        ) : null;
      })}
            </div>
          );
        }))}
      </section>
      </TabPanel>
        <TabPanel value="2">
        <section className="text-[#0F160F] flex lg:flex-row md:flex-row flex-col justify-between">
    {approved?.length === 0 ? (
      <div className="flex flex-col items-center w-full text-[rgb(15,22,15)]">
          <img src={emptyPurchase} alt="" />
          <p>No Approved Payment yet</p>
          </div>
        ) : (approved.map((p, index) => {
          const userApproval = allProduct.find((data) => data?.id === p.id);
          return (
            <div key={index} className="border p-4 mb-4 rounded-lg shadow-md lg:w-[32%] md:w-[32%] w-[100%]">
              {userApproval ? (
                <div>
                  <img src={userApproval.image} alt="" className="w-[300px] h-[300px] mb-4" />
                  <p className='flex justify-between my-4 font-bold'>Price <span>{formatUnits(userApproval.price)}tBNB</span> </p>
                </div>
              ) : (
                <p>Product details not available.</p>
              )}
            </div>
          );
        }))}
      </section>
        </TabPanel>
      </TabContext>
    </Box>
    </main>
  )
}

export default Transactions