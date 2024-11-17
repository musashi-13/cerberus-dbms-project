import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function deleteVehicle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    const { vid } = req.body;

    if (!vid) {
        return res.status(400).json({ message: 'Vehicle ID is required' });
    }

    try {
        await prisma.vehicle.delete({
            where: { vid },
        });

        return res.status(200).json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        return res.status(500).json({ message: 'Internal server error', error });
    } finally {
        await prisma.$disconnect();
    }
}
