"use client";
import { useAuth } from "@/app/AuthContext";
import Link from "next/link";
import Icon from "@/app/_components/icon-wrapper";
import { useEffect, useState } from "react";
import ky from "ky";
import secureLocalStorage from "react-secure-storage";

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

export default function Page() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [noVehicles, setNoVehicles] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
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
        console.log(response);
        if (response.vehicles && response.vehicles.length > 0) {
          setVehicles(response.vehicles);
        } else {
          setNoVehicles(true);
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchData();
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
  return (
    <div className="p-6 flex flex-col w-max items-center relative mt-16 left-1/2 -translate-x-1/2  bg-zinc-900/60 backdrop-blur-md border border-zinc-600 rounded-md ">
      <h2 className="text-xl font-bold mb-4">Your Vehicles</h2>
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
  );
}
