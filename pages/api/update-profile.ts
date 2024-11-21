import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function updateProfile(req: NextApiRequest, res: NextApiResponse) {
    const { uid, name, email } = req.body;

    if (!uid || !name || !email ) {
        return res.status(400).json({ error: 'Invalid input. All fields are required.' });
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { uid },
        });

        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        const updatedUser = await prisma.user.update({
            where: { uid },
            data: {
                name,
                email,
            },
        });

        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
