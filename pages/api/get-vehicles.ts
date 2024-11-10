import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function getVehicles(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const vehicles = await prisma.vehicle.findMany({
            where: { ownerId: String(userId) },
        });

        if (vehicles.length === 0) {
            return res.status(404).json({ message: 'No vehicles found for this user' });
        }

        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await prisma.$disconnect();
    }
}