import React, { useCallback, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MobileSidebar from "../components/MobileSidebar";
import { useAppKitAccount } from "@reown/appkit/react";

const DashboardLayout = () => {
  const { isConnected } = useAppKitAccount();
  const navigate = useNavigate();

  const handleRedirect = useCallback(async () => {
    if (isConnected) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  }, [isConnected, navigate]);

  useEffect(() => {
    handleRedirect();
  }, [handleRedirect, isConnected]);

  return (
    <div>
      <div className="flex bg-white">
        <div className="h-auto w-[20%] lg:h-[100vh] md:h-[80vh] overflow-y-scroll no-scrollbar max-h-[982px]">
        <Sidebar />
        </div>
        <div className="px-6 w-[100%] lg:w-[77%] md:w-[77%] lg:h-[100vh] md:h-[80vh] h-auto max-h-[982px] overflow-y-scroll no-scrollbar">
          <MobileSidebar />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
