import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function deleteUser(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    const { uid } = req.body;

    if (!uid) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        await prisma.user.delete({
            where: { uid },
        });

        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ message: 'Internal server error', error });
    } finally {
        await prisma.$disconnect();
    }
}