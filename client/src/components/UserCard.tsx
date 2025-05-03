import React from "react";

type UserCardProps = {
  user: {
    id: string;
    name: string;
    email: string;
    address: string;
    role: "user" | "admin" | "store_owner";
    rating?: number; // optional for store owners
  };
};

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 border hover:shadow-lg transition duration-300 ease-in-out">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{user.name}</h2>
      <p className="text-sm text-gray-600">
        <span className="font-medium">Email:</span> {user.email}
      </p>
      <p className="text-sm text-gray-600">
        <span className="font-medium">Address:</span> {user.address}
      </p>
      <p className="text-sm text-gray-600">
        <span className="font-medium">Role:</span> {user.role}
      </p>
      {user.role === "store_owner" && user.rating !== undefined && (
        <p className="text-sm text-yellow-600 font-semibold mt-2">
          ⭐ Store Rating: {user.rating}/5
        </p>
      )}
    </div>
  );
};

export default UserCard;
