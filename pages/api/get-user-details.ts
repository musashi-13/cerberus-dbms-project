import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@/lib/prisma";

export default async function getUserDetails(req: NextApiRequest, res: NextApiResponse) {
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
        const user = await prisma.user.findUnique({
            where: { uid: userId },
            select: {uid: true, email: true, name: true}
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ user });
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    } finally {
        prisma.$disconnect();
    }
}