'use client'
import Loader from "@/app/_components/loader";
import { useAuth } from "@/app/AuthContext";
import ky from "ky";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Appts {
  appt_id: string;
  vehicleId: string;
  appt_date: Date;
  est_finish_date?: Date | 'tbd';
  task: string;
  status: string;
  service_comments: string;
  model: any;
}

export default function Page() {
  const [appts, setAppts] = useState<Appts[] | null>(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!user) return; // Make sure user is defined before fetching
    console.log(user);
    const fetchData = async () => {
        try {
            const response = await ky.get(`/api/get-appt?uid=${user.userId}`).json<{ appointments: Appts[] }>();
            setAppts(response.appointments); // Extract appointments array from the response
            console.log('your appointments: ' + response.appointments);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [user]);

  return (
    <div className="bg-garage h-screen flex flex-col items-center p-6">
      {loading ? (
      <div><Loader/></div>
      ) : appts && appts.length > 0 ? (
      appts.map((appt, index) => (
        <div key={appt.appt_id} className="w-full flex items-center justify-between gap-2 bg-zinc-900/60 backdrop-blur-md border border-zinc-600 rounded-md p-4">
          <div className="flex gap-2">
            <div className="flex flex-col justify-center">
              <p className="text-xs text-zinc-400">Appt. No.</p>
              <h1 className="text-6xl">{index+1}</h1>
            </div>
            <div>
              <p className="text-zinc-400">{new Date(appt.appt_date).toLocaleDateString()} <span className="font-bold text-white">Task: {appt.task}</span></p>
              <p className="text-zinc-400">Vehicle: <span className="text-white font-bold">{appt.model || 'loading..'}</span></p>
              <p className="text-sm capitalize">{appt.status} | Estimated End Date: {appt.est_finish_date === 'tbd' ? 'Will be updated shortly' : appt.est_finish_date ? new Date(appt.est_finish_date).toLocaleDateString() : 'N/A'}</p>
              <p className="text-sm">{appt.service_comments? appt.service_comments : 'No comments by service yet.'}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Link href={`/user/feedback?appt=${appt.appt_id}`} className="px-2 text-center py-1 bg-gradient-to-r from-amber-600 to-orange-600 rounded-md">Give Feedback</Link>
            <button className="px-2 py-1 bg-gradient-to-r border border-zinc-600 rounded-md">Cancel Appointment</button>
          </div>
        </div>
      ))
      ) : (
      <div>You have no appointments</div>
      )}
    </div>
  );
}
