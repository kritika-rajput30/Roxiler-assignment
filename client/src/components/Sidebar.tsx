import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { dashboardOptions } from "../constant/dashboardOptions";

const Sidebar = () => {
  const role = useSelector((state) => state.auth.role);
  const options = dashboardOptions[role] || [];
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/auth");
  };

  return (
    <>
      {/* Mobile Top Navbar */}
      <div className="md:hidden bg-gray-900 text-white p-4 flex justify-between items-center">
        <span className="text-xl font-bold">{role} Dashboard</span>
        <button onClick={() => setIsOpen(true)} aria-label="Open Menu">
          <Menu />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:relative w-64 h-screen bg-gray-900 text-white p-5 flex flex-col`}
      >
        {/* Close button for mobile */}
        <div className="flex items-center justify-between mb-10 md:hidden">
          <div className="text-2xl font-bold">{role} Dashboard</div>
          <button onClick={() => setIsOpen(false)} aria-label="Close Menu">
            <X />
          </button>
        </div>

        {/* Title for desktop */}
        <div className="hidden md:block text-2xl font-bold capitalize mb-10"><span className="text-white">RateHub</span></div>

        <ul className="space-y-4 flex-1">
          {options.map((opt, idx) => (
            <li key={idx}>
              <NavLink
                to={opt.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-800"
                  }`
                }
              >
                {opt.icon}
                <span>{opt.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Logout Button */}
        <div className="pt-6">
          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-md border-2 border-white hover:bg-red-600 w-full transition-colors"
          >
            <LogOut />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
