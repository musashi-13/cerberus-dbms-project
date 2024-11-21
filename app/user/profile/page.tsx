"use client";
import { useAuth } from "@/app/AuthContext";
import Link from "next/link";
import Icon from "@/app/_components/icon-wrapper";
import { useEffect, useState } from "react";
import ky from "ky";
import secureLocalStorage from "react-secure-storage";
import Loader from "@/app/_components/loader";

interface Vehicle {
  vid: string;
  registrationNo: string;
  model: string;
  color?: string;
  type: string;
}

interface VehiclesResponse {
  vehicles: Vehicle[];
}

interface UserDetails {
  uid: string;
  email: string;
  name: string;
}


export default function Page() {
  const { user } = useAuth();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [editValues, setEditValues] = useState<UserDetails | null>(null);
  const [isModified, setIsModified] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [loadingUserDetails, setLoadingUserDetails] = useState(true);

  useEffect(() => {
    const fetchVData = async () => {
      if (!user) return;

      const token = secureLocalStorage.getItem("token");
      if (!token) return;

      try {
        const response: VehiclesResponse = await ky
          .post("/api/get-vehicles", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            json: { userId: user.userId },
          })
          .json();
          setVehicles(response.vehicles)
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setLoadingVehicles(false); // Mark vehicles loading as complete
      }
    };

    const fetchUData = async () => {
      if (!user) return;
      const token = secureLocalStorage.getItem("token");
      if (!token) return;
      try {
        const response = await ky
          .post("/api/get-user-details", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            json: { userId: user.userId },
          })
          .json<{ user: UserDetails }>();
        setUserDetails(response.user);
        setEditValues(response.user); // Set initial values for editing
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoadingUserDetails(false); // Mark vehicles loading as complete
      }
    };

    fetchVData();
    fetchUData();
  }, [user]);

  const deleteVehicle = async (vid: string) => {
    const token = secureLocalStorage.getItem("token");
    if (!token) return;

    try {
      await ky
        .post("/api/delete-vehicle", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          json: { vid },
        })
        .json();
      setVehicles((prev) => prev.filter((vehicle) => vehicle.vid !== vid));
    } catch (error) {
      console.error("Error removing vehicle:", error);
    } 
  };

  const deleteAccount = async () => {
    const token = secureLocalStorage.getItem("token");
    if (!token) return;
    if (!user) return;
    const uid = user.userId;
    try {
      await ky
        .post("/api/delete-user", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          json: { uid },
        })
        .json();
      secureLocalStorage.removeItem("token");
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting account:", error);
    } 
  };

  const handleInputChange = (field: keyof UserDetails, value: string | number) => {
    if (!editValues || !userDetails) return;

    const updatedValues = { ...editValues, [field]: value };
    setEditValues(updatedValues);

    // Check if any value has changed compared to the original fetched values
    const modified = Object.keys(userDetails).some(
      (key) => (userDetails as any)[key] !== (updatedValues as any)[key]
    );
    setIsModified(modified);
  };

  const handleCancel = () => {
    if (userDetails) {
      setEditValues(userDetails); // Reset to original fetched values
      setIsModified(false); // Disable the save button
    }
  };

  const handleSave = async () => {
    if (!editValues || !user) return;
    const token = secureLocalStorage.getItem("token");
    if (!token) return;
    try {
      await ky.post("/api/update-profile", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        json: editValues, // Send the updated values
      });
      setUserDetails(editValues); // Update original details with the saved values
      setIsModified(false); // Disable the save button
      alert("Your profile details have been updated")
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loadingVehicles || loadingUserDetails) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }
  return (
    <div className="h-screen w-full flex justify-center">
    <div className="p-6 flex flex-col w-max h-fit items-center relative mt-16 bg-zinc-900/60 backdrop-blur-md border border-zinc-600 rounded-md ">
      <div className="flex flex-col items-center">
        <h2 className="text-xl items-center font-bold mb-4">Profile</h2>
        {editValues && (
          <div className="flex flex-col">
            <label className="text-zinc-400 text-sm translate-y-2">Full Name</label>
            <input
              className="w-48 border-b-2 border-zinc-600/60 p-1 bg-transparent outline-none mb-2"
              value={editValues.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
            <label className="text-zinc-400 text-sm translate-y-2">Email</label>
            <input
              className="w-48 border-b-2 border-zinc-600/60 p-1 bg-transparent outline-none mb-2"
              value={editValues.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
            <p className="flex gap-2 w-full justify-end">
              <button
                className="px-1 py-0.5 border border-zinc-600 rounded-md"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className={`px-1 py-0.5 rounded-md ${
                  isModified ? "bg-amber-600" : "bg-gray-500 cursor-not-allowed"
                }`}
                disabled={!isModified}
                onClick={handleSave}
              >
                Save
              </button>
            </p>
          </div>
        )}
      </div>
      
      <h2 className="text-xl font-bold my-4">Your Vehicles</h2>
      {vehicles.length > 0 ? (
        <div className="flex gap-4">
          {vehicles.map((vehicle) => (
            <div key={vehicle.vid} className="flex flex-col gap-1 items-center">
              <img
                className="h-36 w-64"
                src={`/${vehicle.type}s/${vehicle.model}.png`}
                alt={vehicle.model}
              />
              <p>{vehicle.model}</p>
              <button
                onClick={() => deleteVehicle(vehicle.vid)}
                className="text-red-600 px-4 py-0.5 mt-2 bg-zinc-900 border border-zinc-600 flex items-center rounded-md"
              >
                <Icon icon="delete_forever" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No vehicles found.</p>
      )}
      <button
        onClick={deleteAccount}
        className="text-red-600 px-4 py-0.5 mt-2 bg-zinc-900 border border-zinc-600 flex items-center rounded-md"
      >
        Delete Account
      </button>
    </div>
  </div>
  );
 
}
