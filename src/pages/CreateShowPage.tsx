import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../apis/axiosInstance";

function CreateShowPage() {
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [venueId, setVenueId] = useState("");
    const [posterUrl, setPosterUrl] = useState("");
    const [description, setDescription] = useState("");
    const [venues, setVenues] = useState<any[]>([]);
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axiosInstance.get("/venues")
            .then(res => setVenues(res.data.result))
            .catch(err => console.error("공연장 불러오기 실패", err));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axiosInstance.post("/shows", {
                venueId,
                title,
                artist,
                posterUrl,
                description,
                category: "CONCERT",
                ticketingStartTime: start,
                ticketingEndTime: end,
            });

            const showId = res.data.result.showId;
            alert("🎉 공연 등록 완료! 회차 등록 페이지로 이동합니다.");
            navigate(`/admin/create-session/${showId}`);
        } catch (err) {
            console.error("공연 등록 실패", err);
            alert("공연 등록 실패 ");
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">공연 등록</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <select
                    value={venueId}
                    onChange={(e) => setVenueId(e.target.value)}
                    required
                    className="w-full p-2 border rounded"
                >
                    <option value="">공연장 선택</option>
                    {venues.map((v) => (
                        <option key={v.venueId} value={v.venueId}>{v.name}</option>
                    ))}
                </select>

                <input type="text" placeholder="공연 제목" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" required />
                <input type="text" placeholder="아티스트" value={artist} onChange={(e) => setArtist(e.target.value)} className="w-full p-2 border rounded" required />
                <input type="text" placeholder="포스터 이미지 URL" value={posterUrl} onChange={(e) => setPosterUrl(e.target.value)} className="w-full p-2 border rounded" />
                <textarea placeholder="설명" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded" required />
                <h3>- 티켓팅 날짜</h3>
                <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} className="w-full p-2 border rounded" required />
                <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} className="w-full p-2 border rounded" required />

                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    공연 등록
                </button>
            </form>
        </div>
    );
}

export default CreateShowPage;
