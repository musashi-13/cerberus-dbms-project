'use client'
import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

export default function Page() {
    const params = useSearchParams()
    const [apptId, setApptId] = useState('')
    useEffect(() => {
        if (params) {
            setApptId(params.get('appt') || '')
        }
    }, [params])
    return (
        <div>
            Feedback for {apptId}
        </div>
    )
}