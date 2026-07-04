import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

function UserLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default UserLayout;