import React, { useState, useEffect } from "react";
import { get, put } from "../../../utils/api";
import { useSelector } from "react-redux";

const UserProfile = () => {
  const [user, setUser] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);

  const token = useSelector((state: any) => state.auth.token);

  const fetchUserDetails = async () => {
    try {
      console.log("Token:", token); // Log the token to make sure it's valid
      const data = await get("/user", {
        Authorization: `Bearer ${token}`,
      });
      setUser(data);
      setName(data.name);
      setEmail(data.email);
    } catch (err) {
      console.error("Error fetching user details:", err);
      if (err instanceof Error) {
        console.error("Error details:", err.message);
      }
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleEditToggle = () => {
    setEditMode((prev) => !prev);
  };

  const handleSaveChanges = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      if (profilePic) formData.append("profilePic", profilePic);

      const response = await put("/user", formData, {
        Authorization: `Bearer ${token}`,
      });

      if (response) {
        fetchUserDetails(); // Refresh user data after saving changes
        setEditMode(false); // Exit edit mode
      }
    } catch (err) {
      console.error("Error saving changes:", err);
    }
  };

  return (
    <div className="p-6">
      {user ? (
        <div>
          <h1 className="text-xl font-semibold mb-4">User Profile</h1>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden">
              <img
                src={user.profilePic || "/default-profile-pic.jpg"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-semibold text-lg">{user.name}</p>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleEditToggle}
              className="text-blue-600 underline"
            >
              {editMode ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {editMode && (
            <div className="mt-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium">
                  Profile Picture
                </label>
                <input
                  type="file"
                  onChange={(e) => setProfilePic(e.target.files?.[0] || null)}
                  className="mt-1"
                />
              </div>

              <button
                onClick={handleSaveChanges}
                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default UserProfile;
