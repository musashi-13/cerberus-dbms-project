import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function getAppt(req: NextApiRequest, res: NextApiResponse) {
    const { uid } = req.query;
    if (!uid || typeof uid !== 'string') {
        return res.status(400).json({ message: 'invalid request' });
    }

    try {
        const appointments = await prisma.appointment.findMany({
            where: { customerId: uid },
            select: {
                appt_id: true,
                appt_date: true,
                task: true,
                vehicleId: true,
                status: true,
                service_comments: true,
                est_finish_date: true,
                vehicle: {
                    select: {
                        model: true // Fetch the model from the related Vehicle table
                    }
                }
            }
        });

        if (appointments.length === 0) {
            return res.status(200).json({ appointments: [] });
        }
        
        // Format the response to include model at the top level of each appointment object
        const formattedAppointments = appointments.map(appt => ({
            ...appt,
            model: appt.vehicle?.model || null
        }));

        return res.status(200).json({ appointments: formattedAppointments });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return res.status(500).json({ message: 'Internal server error' });
    } finally {
        prisma.$disconnect();
    }
}
