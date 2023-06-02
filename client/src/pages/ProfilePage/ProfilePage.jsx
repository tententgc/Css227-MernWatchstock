import React, { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../../components/MainLayout";
import { images, stables } from "../../constants";

import Mycollection from "./container/Mycollection";
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
          "http://localhost:3001/api/users/profile",
          config
        );
        setProfile(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  console.log(profile);
  if (!profile) return <div>Loading...</div>;

  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-center">
          <div className="bg-orange-600 p-4 rounded shadow-md w-full md:w-2/3 lg:w-1/2">
            <h2 className="text-white text-2xl mb-4"></h2>
            <div className="text-white flex items-center">
              <div className="rounded-full overflow-hidden mr-4">
                <div
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={
                      profile.avatar
                        ? stables.UPLOAD_FOLDER_BASE_URL + profile.avatar
                        : images.samplePostImage
                    }
                    alt="Profile"
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </div>
              </div>
              <div>
                <p>
                  <b>Name:</b> {profile.name}
                </p>
                <p>
                  <b>Email:</b> {profile.email}
                </p>
                <p> 
                  <b>Description:</b> {profile.description} 
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Mycollection />
    </MainLayout>
  );
};

export default ProfilePage;
