import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../apis/axiosInstance";

interface Show {
    showId: string;
    title: string;
    artist: string;
    posterUrl: string | null;
    description: string;
}

function ShowSelectionPage() {
    const [shows, setShows] = useState<Show[]>([]);
    const [selectedShowId, setSelectedShowId] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        axiosInstance.get("/shows")
            .then((res) => setShows(res.data.result))
            .catch((err) => console.error("공연 목록 불러오기 실패", err));
    }, []);

    const toggleShowDetail = (showId: string) => {
        setSelectedShowId(prev => (prev === showId ? null : showId));
    };

    return (
        <div className="min-h-screen px-6 py-8 bg-white">
            <h1 className="text-2xl font-bold mb-6 text-center">🎭 공연을 선택하세요</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {shows.map((show) => (
                    <div
                        key={show.showId}
                        className="border rounded-lg p-4 shadow hover:shadow-lg transition"
                    >
                        <div
                            className="cursor-pointer"
                            onClick={() => toggleShowDetail(show.showId)}
                        >
                            <img
                                src={show.posterUrl || "/default-poster.png"}
                                alt={show.title}
                                onError={(e) => {
                                    e.currentTarget.src = "/default-poster.png";
                                }}
                                className="w-full h-64 object-cover rounded mb-4"
                            />
                            <h2 className="text-lg font-bold">{show.title}</h2>
                            <p className="text-sm text-gray-600">{show.artist}</p>
                        </div>

                        {selectedShowId === show.showId && (
                            <div className="mt-4 text-gray-700 text-sm">
                                <p className="mb-2">{show.description}</p>
                                <button
                                    onClick={() => navigate(`/shows/${show.showId}`)}
                                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    회차 보기 →
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ShowSelectionPage;
