import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../apis/axiosInstance";

function CreateSessionPage() {
    const { showId } = useParams();
    const navigate = useNavigate();

    const [sessionDate, setSessionDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [seatCount, setSeatCount] = useState(10);
    const [seatPrice, setSeatPrice] = useState(50000);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            //  여기서 포맷 맞춰주기
            const formattedStartTime = `${startTime}:00`; // "14:00" → "14:00:00"
            const formattedEndTime = `${endTime}:00`;

            await axiosInstance.post(`/shows/sessions/${showId}`, {
                sessionDate, // 이미 YYYY-MM-DD 형식
                startTime: formattedStartTime,
                endTime: formattedEndTime,
                seatCount,
                seatPrice,
            });

            alert("회차 등록 완료!");
            navigate("/shows");
        } catch (err) {
            console.error("회차 등록 실패", err);
            alert("실패!");
        }
    };
    return (
        <div className="p-6 max-w-lg mx-auto">
            <h1 className="text-xl font-bold mb-4">공연 회차 등록</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="date" value={sessionDate} onChange={(e) => setSessionDate(e.target.value)} className="w-full p-2 border rounded" required />
                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full p-2 border rounded" required />
                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full p-2 border rounded" required />
                <input type="number" value={seatCount} onChange={(e) => setSeatCount(Number(e.target.value))} placeholder="좌석 수" className="w-full p-2 border rounded" />
                <input type="number" value={seatPrice} onChange={(e) => setSeatPrice(Number(e.target.value))} placeholder="가격" className="w-full p-2 border rounded" />

                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    회차 등록
                </button>
            </form>
        </div>
    );
}

export default CreateSessionPage;
