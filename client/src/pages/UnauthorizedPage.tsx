import React from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 p-6 text-center">
      <div className="flex flex-col items-center">
        <Lock size={60} className="text-primary mb-4" />
        <h1 className="text-4xl font-bold mb-2 text-primary-dark">
          403 - Unauthorized Access
        </h1>
        <p className="text-lg mb-6 max-w-md">
          Oops! You don’t have permission to view this page.
          <br />
          Either you’re not logged in or your role doesn’t grant access.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/")}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition"
          >
            Go Home
          </button>
          <button
            onClick={() => navigate("/auth")}
            className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
