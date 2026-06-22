import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import "../Style/DashLayout.css";

const DashboardLayout = () => {
  return (
    <div className="dashboard-container">
      <section className="sidebar-container">
        <Sidebar />
      </section>

      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
