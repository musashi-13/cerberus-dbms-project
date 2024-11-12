"use client";
import { useAuth } from "./AuthContext";
import Link from "next/link";
import Icon from "./_components/icon-wrapper";
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
export default function Home() {
  const { user, isLoggedIn } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [vid, setVid] = useState<string>("");
  const [date, setDate] = useState<string>("");
  useEffect(() => {
    if (typeof isLoggedIn !== "undefined") {
      setLoading(false);
    }
  }, [isLoggedIn]);

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
            json: { userId: user.userId }, // Use json option instead of JSON.stringify
          })
          .json();

        if (response.vehicles) {
          setVehicles(response.vehicles);
          if (!vid && response.vehicles.length > 0) {
            setVid(response.vehicles[0].vid); // Set vid to the first vehicle's vid
          }
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchData();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = secureLocalStorage.getItem("token");
    if (!token) return;
    const uid = user?.userId;
    if (!uid) return;
    const appointmentDate = new Date(date);
    const estEndDate = new Date(appointmentDate);
    estEndDate.setDate(appointmentDate.getDate() - 1);

    const data = {
      uid,
      vid,
      date: new Date(date),
      stat: "pending approval",
      estEndDate: new Date(estEndDate),
    };
    console.log(data);
    const reponse = await ky.post("/api/make-appt", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      json: data,
    });
    console.log(reponse);

  }


  return (
    <div className="h-lvh bg-garage flex items-center justify-center">
      {!isLoggedIn ? (
        <div className="bg-zinc-900/60 flex flex-col items-center backdrop-blur-md border border-zinc-600 p-6 w-96 -translate-y-16 rounded-md">
          <h1 className="text-lg">
            Welcome to{" "}
            <span className="text-amber-500 text-xl font-bold">CERBERUS</span>,
          </h1>
          <h2 className="-translate-y-1 text-sm text-neutral-400">
            Your one stop solution for vehicle service
          </h2>
          <Link
            href={"/user/register"}
            className="flex mt-4 items-center w-32 border border-white rounded-md px-2 py-1 bg-gradient-to-r from-amber-600 to-orange-600"
          >
            Get Started <Icon icon="arrow_forward" />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4 items-center">
          <div className="bg-zinc-900/60 flex flex-col items-center backdrop-blur-md border border-zinc-600 p-6 w-96 rounded-md">
            <h1 className="text-xl font-bold">Book an Appointment</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center mt-4 gap-2">
              <div className="flex items-center gap-1">
                <label htmlFor="vehicle" className="text-zinc-300">Vehicle:</label>
                <select
                  value={vid || vehicles[0]?.vid} // Set default to first vehicle's vid if vid is empty
                  onChange={(e) => setVid(e.target.value)}
                  className="w-48 bg-transparent border-b border-zinc-600 outline-none text-white p-1"
                >
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.vid} value={vehicle.vid} className="bg-zinc-900">
                      {vehicle.model}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="service" className="text-zinc-300">Appointment Date:</label>
                <input value={date} onChange={(e) => setDate(e.target.value)} type="date" className="w-32 rounded-md border border-zinc-600 p-1 text-white bg-transparent" />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-amber-600 to-orange-600 px-2 py-1 rounded-md">Book Appointment</button>
            </form>
          </div>
          <div className="flex gap-2">
            <button className="border bg-zinc-900/60 backdrop-blur-md border-zinc-600 px-2 py-1 rounded-md">View Appointments</button>
            <button className="border bg-zinc-900/60 backdrop-blur-md border-zinc-600 px-2 py-1 rounded-md">Give Feedback </button>
          </div>
        </div>
      )}
    </div>
  );
}
