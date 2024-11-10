'use client'
import Image from "next/image";
import { useAuth } from "./AuthContext";
import Link from "next/link";
import Icon from "./_components/icon-wrapper";
import { useEffect } from "react";

export default function Home() {
  const {user, isLoggedIn} = useAuth();
  useEffect(() => {
    console.log(user);
  });
  return (
    <div className="h-lvh bg-garage flex items-center justify-center">
      {!isLoggedIn ? (
        <div className="bg-zinc-900/60 flex flex-col items-center backdrop-blur-lg border border-zinc-600 p-6 w-96 -translate-y-16 rounded-md">
          <h1 className="text-lg">Welcome to <span className="text-amber-500 text-xl font-bold">CERBERUS</span>,</h1>
          <h2 className="-translate-y-1 text-sm text-neutral-400">Your one stop solution for vehicle service</h2>
          <Link href={"/user/register"} className="flex mt-4 items-center w-32 border border-white rounded-md px-2 py-1 bg-gradient-to-r from-amber-600 to-orange-600">Get Started <Icon icon="arrow_forward"/></Link>
        </div>
      ) : (
        <div>
          <div className="bg-zinc-900/60 flex flex-col items-center backdrop-blur-lg border border-zinc-600 p-6 w-96 rounded-md">
            <h1 className="text-xl font-bold">Book an Appointment</h1>
            <div className="flex flex-col">
              <label htmlFor="vehicle">Select your Vehicle</label>
              <select className="w-48 rounded-md border border-neutral-400 p-1 text-black">
                <option value="service">Service</option>
                <option value="repair">Repair</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
