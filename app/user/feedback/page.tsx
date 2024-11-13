'use client'
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/AuthContext";
import { useState, useEffect } from "react";
import ky from "ky";

export default function Page() {
    const params = useSearchParams();
    const { user } = useAuth();
    const [apptId, setApptId] = useState('');
    const [feedback, setFeedback] = useState('');
    const [rating, setRating] = useState<number | null>(null);
    
    useEffect(() => {
        if (params) {
            setApptId(params.get('appt') || '');
        }
    }, [params]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) {
            console.error('User not found');
            return;
        }
        if (!apptId || !rating) {
            console.error('Missing required fields');
            return;
        }
        try {
            // Send data to the API
            const response = await ky.post('/api/add-feedback', {
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    comments: feedback,
                    rating,
                    appointmentId: apptId,
                    customerId: user.userId,
                }),
            }).json();

            console.log('Feedback submitted:', response);
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
    };

    return (
        <div className="bg-garage h-screen flex items-center justify-center">
            <form onSubmit={handleSubmit} className="w-96 p-4 flex flex-col gap-2 -translate-y-16 bg-zinc-900/60 backdrop-blur-md border border-zinc-600 rounded-md">
                <h1 className="text-center text-xl font-bold mb-4">Feedback for Appointment</h1>
                <label htmlFor="feedback">Give your Feedback: <span className="text-xs text-zinc-600">(optional)</span></label>
                <textarea
                    id="feedback"
                    className="w-full p-2 h-24 resize-none bg-transparent border-b border-zinc-600"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                />
                <div className="flex items-center gap-4">
                    <label>Give us a Rating!</label>
                    <div className="rating">
                        <input
                            value={5}
                            name="rating"
                            id="star5"
                            type="radio"
                            checked={rating === 5}
                            onChange={() => setRating(5)}
                        />
                        <label htmlFor="star5"></label>
                        <input
                            value={4}
                            name="rating"
                            id="star4"
                            type="radio"
                            checked={rating === 4}
                            onChange={() => setRating(4)}
                        />
                        <label htmlFor="star4"></label>
                        <input
                            value={3}
                            name="rating"
                            id="star3"
                            type="radio"
                            checked={rating === 3}
                            onChange={() => setRating(3)}
                        />
                        <label htmlFor="star3"></label>
                        <input
                            value={2}
                            name="rating"
                            id="star2"
                            type="radio"
                            checked={rating === 2}
                            onChange={() => setRating(2)}
                        />
                        <label htmlFor="star2"></label>
                        <input
                            value={1}
                            name="rating"
                            id="star1"
                            type="radio"
                            checked={rating === 1}
                            onChange={() => setRating(1)}
                        />
                        <label htmlFor="star1"></label>
                    </div>
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-amber-600 to-orange-600 px-2 py-1 rounded-md">
                    Submit Feedback
                </button>
            </form>
        </div>
    );
}
