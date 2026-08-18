import React from "react";
import { Outlet } from "react-router-dom";

import Header from "../Components/Header";
import Footer from "../Components/Footer";

const MainLayout = () => {
  return (
    <>
      <Header />
      <main style={{ width: "100%", padding: "0%" }}>
        <Outlet />
      </main>

      <Footer />
    </>
  );
};

export default MainLayout;
