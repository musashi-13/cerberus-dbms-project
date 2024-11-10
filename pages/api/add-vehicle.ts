import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function addVehicle(req: NextApiRequest, res: NextApiResponse) {
    const { userId, registrationNo, color, type, model } = req.body;
    if (!userId || !registrationNo || !color || !type || !model) {
        return res.status(400).json({ error: 'Invalid Prompt' });
    }
    
    try {
        const existingVehicle = await prisma.vehicle.findUnique({ where: { registrationNo } });

        if (existingVehicle) {
            return res.status(401).json({ message: 'Vehicle already exists' });
        }
        const vehicle = await prisma.vehicle.create({
            data: {
                ownerId: userId,
                registrationNo,
                color,
                type,
                model,
            },
        });

        res.status(200).json(vehicle);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await prisma.$disconnect();
    } 
}