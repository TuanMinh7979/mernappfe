import { Outlet } from "react-router-dom";
import "./Social.scss";
import Header from "@components/header/Header";
import Sidebar from "@components/sidebar/SideBar";
const Social = () => {
  return (
    <>
      <Header></Header>
      <div className="dashboard">
        <div className="dashboard-sidebar">
          <Sidebar />
        </div>
        <div className="dashboard-content">
          <Outlet></Outlet>
        </div>
      </div>
    </>
  );
};
export default Social;
