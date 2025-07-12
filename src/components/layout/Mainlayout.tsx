import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

const MainLayout = () => {

  return (
    <>
      {/* <Navbar />
      <div className="flex min-h-screen h-full">
        <Sidebar />
        <div
          className={`flex-1 transition-all duration-300 ease-in-out overflow-x-auto ${
            collapsed ? "md:ml-sp70 ml-sp40" : "ml-sp230"
          }  bg-f6f6f6`}
        >
          <div className="container">
            <Outlet />
          </div>
        </div>
      </div> */}

      <div>
        <Header />
        <div className="flex h-[calc(100vh-75px)]">
          <Sidebar />
          <div className="bg-[#f6f6f6] w-full overflow-y-auto">
            <div className="p-5"> 
            <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainLayout;
