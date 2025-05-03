// src/components/layout/Navbar.js

import { useSelector } from "react-redux";

const Navbar = () => {
  const role = useSelector((state) => state.auth.role);
  const name = useSelector((state) => state.users.currentUser.name);


    return (
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold capitalize">{role} dashboard</h1>
        <div className="text-gray-500 text-sm">Welcome back! {name}</div>
      </header>
    );
  };
  
  export default Navbar;
  