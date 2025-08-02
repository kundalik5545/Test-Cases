import React from "react";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen px-2 py-5 bg-gray-100 md:py-10 lg:py-10 ">
      {children}
    </div>
  );
};

export default MainLayout;
