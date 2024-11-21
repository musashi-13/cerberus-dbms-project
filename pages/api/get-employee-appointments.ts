import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma"; // Ensure this path is correct to your Prisma client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if the request is a GET request
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Fetch all appointments, joining with vehicle and customer information
    const appointments = await prisma.appointment.findMany({
      select: {
        appt_id: true,
        appt_date: true,
        task: true,
        status: true,
        service_comments: true,
        est_finish_date: true,
        vehicle: {
          select: {
            model: true,
            type: true,
            registrationNo: true,
            color: true,
          },
        },
        customer: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Check if appointments exist
    if (appointments.length === 0) {
      return res.status(200).json({ appointments: [] });
    }

    // Sort the appointments:
    // 1. Pending first, 2. Accepted second, 3. Declined last
    const sortedAppointments = appointments.sort((a, b) => {
      const statusOrder = {
        "Pending": 1,
        "Accepted": 2,
        "Declined": 3
      };
      
      return statusOrder[a.status] - statusOrder[b.status];
    });

    // Format the appointments to include vehicle model and customer info
    const formattedAppointments = sortedAppointments.map((appt) => ({
      appt_id: appt.appt_id,
      appt_date: appt.appt_date,
      task: appt.task,
      status: appt.status,
      service_comments: appt.service_comments || "No comments",
      est_finish_date: appt.est_finish_date,
      vehicle: appt.vehicle,
      customer: appt.customer, // Include customer info in the response
    }));

    return res.status(200).json({ appointments: formattedAppointments });
  } catch (error) {
    console.error("Error fetching employee appointments:", error);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect(); // Close the Prisma client connection
  }
}
