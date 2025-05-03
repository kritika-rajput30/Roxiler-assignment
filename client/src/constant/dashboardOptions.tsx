// src/constants/dashboardOptions.js

import { HomeIcon, Lock, ShieldEllipsis, Star, User } from "lucide-react";

  
  export const dashboardOptions = {
    user: [
      { label: "My Profile", path: "/dashboard/user/profile", icon: <User/> },
      { label: "My Ratings", path: "/dashboard/user/ratings", icon: <Star /> },
      { label: "Change Password", path: "/dashboard/user/change-password", icon: <Lock /> },
    ],
    owner: [
      { label: "Dashboard", path: "/dashboard/owner", icon: <HomeIcon /> },
      { label: "Change Password", path: "/dashboard/user/change-password", icon: <Lock /> },

    ],
    admin: [
      { label: "Dashboard", path: "/dashboard/admin", icon: <ShieldEllipsis /> },
    ],
  };
  