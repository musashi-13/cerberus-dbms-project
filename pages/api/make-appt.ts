import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma';

export default async function bookAppt(req: NextApiRequest, res: NextApiResponse) {
    const {uid, vid, date, stat, task } = req.body;
    if(!uid || !vid || !date || !stat || !task){
        return res.status(400).json({ error: 'Invalid Prompt' });
    }
    try {
        const existingAppt = await prisma.appointment.findFirst({ where: { AND: [{ appt_date: date }, { customerId : uid }, { vehicleId: vid }] } });

        if (existingAppt) {
            return res.status(401).json({ message: 'Appointment already exists' });
        }
        const appt = await prisma.appointment.create({
            data: {
                customerId: uid,
                vehicleId: vid,
                appt_date: date,
                status: stat,
                task: task,    
            },
        });

        res.status(200).json({ message: 'Appointment added successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}