'use client'

import { useEffect, useState } from "react";
import ky from "ky";
import { useAuth } from "@/app/AuthContext";
import Loader from "@/app/_components/loader";
import secureLocalStorage from "react-secure-storage";

interface Appointment {
  appt_id: string;
  vehicle: {
    model: string;
    registrationNo: string;
    color?: string;
    type: string;
  };
  appt_date: Date;
  task: string;
  status: string;
  service_comments: string;
}

export default function EmployeeHomePage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;

      const token = secureLocalStorage.getItem("token");
      if (!token) return;

      try {
        const response = await ky
          .get(`/api/get-employee-appointments?userId=${user.userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .json<{ appointments: Appointment[] }>();

        if (response.appointments) {
          setAppointments(response.appointments);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  const handleAppointmentAction = async (apptId: string, action: 'accept' | 'decline' | 'start-servicing' | 'complete') => {
    try {
      const token = secureLocalStorage.getItem("token");
      await ky.post('/api/accept-decline-appointments', {
        json: { apptId, action },
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      // Update local state to reflect the change
      setAppointments(prev => 
        prev.map(appt => 
          appt.appt_id === apptId 
            ? { 
                ...appt, 
                status: action === 'accept' 
                          ? 'Accepted' 
                          : action === 'decline' 
                          ? 'Declined' 
                          : action === 'start-servicing' 
                          ? 'Being Serviced' 
                          : 'Completed' 
              } 
            : appt
        )
      );
    } catch (error) {
      console.error(`Error ${action} appointment:`, error);
    }
  };

  return (
    <div className="bg-garage min-h-screen flex items-center justify-center p-4">
      <div className="p-6 w-full max-w-6xl flex flex-col items-center relative bg-white/10 backdrop-blur-md border border-zinc-600 rounded-md">
        {loading ? (
          <Loader />
        ) : (
          <>
            <h2 className="text-2xl mb-6 text-white font-semibold">
              Total Appointments: {appointments.length}
            </h2>

            {appointments.length > 0 ? (
              <div className="overflow-x-auto w-full">
                <table className="w-full text-white">
                  <thead>
                    <tr className="bg-zinc-800 text-zinc-400">
                      <th className="p-3 text-left">Car</th>
                      <th className="p-3 text-left">Model</th>
                      <th className="p-3 text-left">Registration</th>
                      <th className="p-3 text-left">Date</th>
                      <th className="p-3 text-left">Task</th>
                      <th className="p-3 text-left">Comments</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appt) => (
                      <tr key={appt.appt_id} className="border-b border-zinc-700 hover:bg-zinc-800/50">
                        <td className="p-3">
                          <img
                            src={`/${appt.vehicle.type}s/${appt.vehicle.model}.png`}
                            alt={appt.vehicle.model}
                            className="w-20 h-12 object-cover rounded"
                          />
                        </td>
                        <td className="p-3">{appt.vehicle.model}</td>
                        <td className="p-3">{appt.vehicle.registrationNo}</td>
                        <td className="p-3">{new Date(appt.appt_date).toLocaleDateString()}</td>
                        <td className="p-3">{appt.task}</td>
                        <td className="p-3">{appt.service_comments || "No comments"}</td>
                        <td className="p-3">
                          {/* Display buttons based on status */}
                          {appt.status === 'Pending' && (
                            <div className="flex flex-col gap-2">
                              <button 
                                onClick={() => handleAppointmentAction(appt.appt_id, 'accept')}
                                className="px-4 py-2 bg-green-500 text-white rounded"
                              >
                                Accept
                              </button>
                              <button 
                                onClick={() => handleAppointmentAction(appt.appt_id, 'decline')}
                                className="px-4 py-2 bg-red-500 text-white rounded"
                              >
                                Decline
                              </button>
                            </div>
                          )}

                          {appt.status === 'Accepted' && (
                            <button 
                              onClick={() => handleAppointmentAction(appt.appt_id, 'start-servicing')}
                              className="px-4 py-2 bg-blue-500 text-white rounded"
                            >
                              Start Servicing
                            </button>
                          )}

                          {appt.status === 'Being Serviced' && (
                            <div className="flex flex-col gap-2">
                              <span className="text-blue-500 font-bold">Being Serviced</span>
                              <button 
                                onClick={() => handleAppointmentAction(appt.appt_id, 'complete')}
                                className="px-4 py-2 border border-green-500 text-green-500 rounded"
                              >
                                Completed
                              </button>
                            </div>
                          )}

                          {appt.status === 'Declined' && (
                            <span className="text-red-500 font-bold">Declined</span>
                          )}

                          {appt.status === 'Completed' && (
                            <span className="text-green-500 font-bold">Completed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-white">No appointments available</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
