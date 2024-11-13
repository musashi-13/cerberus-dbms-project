import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { comments, rating, appointmentId, customerId } = req.body;

        try {
            const feedback = await prisma.feedback.create({
                data: {
                    comments,
                    rating,
                    appointmentId,
                    customerId,
                },
            });

            res.status(201).json(feedback);
        } catch (error) {
            res.status(500).json({ error: 'Error creating feedback' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}