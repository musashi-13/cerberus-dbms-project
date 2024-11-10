import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function addVehicle(req: NextApiRequest, res: NextApiResponse) {
    const { uid, registration, color, type, model } = req.body;
    if (!uid || !registration || !color || !type || !model) {
        return res.status(400).json({ error: 'Invalid Prompt' });
    }
    
    try {
        const existingVehicle = await prisma.vehicle.findUnique({ where: { registrationNo: registration } });

        if (existingVehicle) {
            return res.status(401).json({ message: 'Vehicle already exists' });
        }
        const vehicle = await prisma.vehicle.create({
            data: {
                ownerId: uid,
                registrationNo: registration,
                color,
                type,
                model,
            },
        });

        res.status(200).json({ message: 'Vehicle added successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    } 
}