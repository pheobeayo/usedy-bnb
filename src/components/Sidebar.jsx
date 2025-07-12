import { CgHomeAlt } from "react-icons/cg";
import { BiBox } from "react-icons/bi";
import { IoIosAddCircleOutline } from "react-icons/io";
import { TbSettings } from "react-icons/tb";
import { ImCart } from "react-icons/im";
import { BsBell } from "react-icons/bs";
import { BsReceipt } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import logo from "../assets/whitelogo.svg";
import { useDisconnect } from "@reown/appkit/react";
import { useAppKitAccount } from "@reown/appkit/react";
import useGetUsedyToken from "../hooks/useGetUsedyToken";
import { formatUnits } from "ethers";

const Sidebar = () => {
  const { disconnect } = useDisconnect();
  const { address } = useAppKitAccount()
  const userBal = useGetUsedyToken()

  const activeStyle = {
    borderLeft: "1px solid #FFFFFF",
    borderRight: "1px solid #FFFFFF",
    width: "100%",
    padding: "20px",
  };

  const truncateAddress = (address) => {
    if (!address) return '';
    const start = address.slice(0, 8);
    return `${start}...`;
  };

  return (
    <div className="bg-[#263E59] w-[20%] text-white p-8 py-12 h-[120vh] hidden lg:flex md:flex flex-col">
      <img src={logo} alt="logo" className="mb-10" />
      <div className="text-[14px] mb-10  px-6 ">
      <p className="text-[14px] text-white items-center py-2 font-bold">
        Wallet Address: <br /> <span>{truncateAddress(address)}</span>
      </p>
      <p>UTN Balance: {formatUnits(userBal)} UTN</p>
      </div>
      <NavLink
        to="/dashboard"
        className="text-[14px] text-white flex items-center py-4 mb-4 px-6"
        style={({ isActive }) => (isActive ? activeStyle : null)}
        end
      >
        <CgHomeAlt className="mr-4" />
        Dashboard
      </NavLink>
      <NavLink
        to="chat"
        className="text-[14px] text-white  flex items-center py-4 mb-4 px-6 "
        style={({ isActive }) => (isActive ? activeStyle : null)}
      >
        <BiBox className="mr-4" /> Chat
      </NavLink>
      <NavLink
        to="createprofile"
        className="text-[14px] text-white  flex items-center py-4 mb-4 px-6 "
        style={({ isActive }) => (isActive ? activeStyle : null)}
      >
        <IoIosAddCircleOutline className="mr-4" />
        Create Profile
      </NavLink>
      <NavLink
        to="market_place"
        className="text-[14px] text-white  flex items-center py-4 mb-4 px-6 "
        style={({ isActive }) => (isActive ? activeStyle : null)}
      >
        <ImCart className="mr-4" /> Marketplace
      </NavLink>
      <NavLink
        to="transactions"
        className="text-[14px] text-white  flex items-center py-4 mb-4 px-6 "
        style={({ isActive }) => (isActive ? activeStyle : null)}
      >
        <BsReceipt className="mr-4" /> Transactions
      </NavLink>
      <button
        className="text-[14px] text-white  flex items-center py-4 mb-4 px-6 "
        onClick={disconnect}
      >
        <TbSettings className="mr-4" /> Log out
      </button>
    </div>
  );
};

export default Sidebar;
