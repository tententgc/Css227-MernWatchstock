import React, { useEffect, useState } from "react";
import axios from "axios";
import MainLayout  from "../../components/MainLayout";
const ProfilePage = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const account = localStorage.getItem("account"); 
        const token = JSON.parse(account).token; 
        const config = token
          ? {
              headers: { Authorization: `Bearer ${token}` },
            }
          : {};
  
        const response = await axios.get(
          "http://localhost:3001/api/users/profile"
        ,config);
        setProfile(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  if (!profile) return <div>Loading...</div>;

  return (
    <MainLayout> 
    <div className="container mx-auto p-4">
      <div className="flex justify-center">
        <div className="bg-orange-600 p-4 rounded shadow-md w-full md:w-2/3 lg:w-1/2">
          <h2 className="text-white text-2xl mb-4">Profile</h2>
          <div className="text-white">
            <p>
              <b>Name:</b> {profile.name}
            </p>
            <p>
              <b>Email:</b> {profile.email}
            </p>
            <p>
              <b>Username:</b> {profile.username}
            </p>
            {/* Add other profile fields as needed */}
          </div>
        </div>
      </div>
    </div>
    </MainLayout>
  );
};

export default ProfilePage;
