import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function getVehicles(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    let userId: string;
    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        userId = body.userId;
    } catch (error) {
        return res.status(400).json({ error: 'Invalid request body' });
    }

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const vehicles = await prisma.vehicle.findMany({
            where: { 
                ownerId: userId 
            },
            select: {
                vid: true,
                registrationNo: true,
                model: true,
                color: true,
                type: true,
            }
        });

        if (vehicles.length === 0) {
            return res.status(201).json({ message: 'No vehicles found for this user' });
        }

        return res.status(200).json({ vehicles });
    } catch (error) {
        console.error("Error fetching vehicles:", error);
        return res.status(500).json({ error: 'Internal server error' });
    } finally {
        await prisma.$disconnect();
    }
}