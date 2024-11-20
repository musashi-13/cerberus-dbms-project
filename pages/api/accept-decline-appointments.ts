import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma"; // Ensure this path is correct to your Prisma client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { apptId, action } = req.body;

  if (!apptId || !action) {
    return res.status(400).json({ message: "Invalid request" });
  }

  try {
    // Update the appointment status based on the action
    const appointment = await prisma.appointment.update({
      where: { appt_id: apptId },
      data: {
        status: action === "accept" ? "Accepted" :
                action === "decline" ? "Declined" :
                action === "start-servicing" ? "Being Serviced" :
                action === "complete" ? "Completed" : "Pending"
      },
    });

    res.status(200).json({ message: "Appointment status updated", appointment });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
