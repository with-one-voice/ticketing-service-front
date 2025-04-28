import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../apis/axiosInstance";

interface Seat {
    seatId: string;
    seatCode: string;
    status: "AVAILABLE" | "HELD" | "RESERVED";
}

function SeatSelectionPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const sessionId = new URLSearchParams(location.search).get("sessionId");
    const seatPrice = Number(new URLSearchParams(location.search).get("seatPrice"));
    const userId = localStorage.getItem("userId");

    const [seats, setSeats] = useState<Seat[]>([]);
    const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!sessionId) return;

        axiosInstance
            .get(`/seats/${sessionId}`)
            .then((res) => setSeats(res.data.result))
            .catch((err) => {
                console.error("좌석 조회 실패", err);
                alert("좌석을 불러오는 데 실패했습니다.");
            });
    }, [sessionId]);

    const toggleSeat = (seat: Seat) => {
        setSelectedSeats((prev) =>
            prev.find((s) => s.seatId === seat.seatId)
                ? prev.filter((s) => s.seatId !== seat.seatId)
                : [...prev, seat]
        );
    };

    const handleSubmit = async () => {
        if (!userId || !sessionId || selectedSeats.length === 0) {
            alert("정보가 부족하거나 선택된 좌석이 없습니다.");
            return;
        }

        setIsLoading(true);

        try {
            const seatIds = selectedSeats.map((seat) => seat.seatId);
            const totalPrice = seatPrice * seatIds.length;

            const res = await axiosInstance.post("/tickets", {
                userId,
                sessionId,
                seatIds,
            });

            const ticketId = res.data.result.ticketId;

            // localStorage에 seatCode와 seatId 저장
            localStorage.setItem("selectedSeats", JSON.stringify(selectedSeats));
            localStorage.setItem("paymentAmount", totalPrice.toString());

            alert("티켓이 생성되었습니다! 결제 페이지로 이동합니다.");
            navigate(`/shows/${sessionId}/payment?ticketId=${ticketId}&paymentAmount=${totalPrice}`);
        } catch (err) {
            console.error("티켓 생성 실패", err);
            alert("티켓 생성에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">좌석 선택</h1>
            <div className="grid grid-cols-5 gap-4 mb-6">
                {seats.map((seat) => (
                    <button
                        key={seat.seatId}
                        onClick={() => toggleSeat(seat)}
                        disabled={seat.status !== "AVAILABLE"}
                        className={`p-4 border rounded text-center ${
                            selectedSeats.find((s) => s.seatId === seat.seatId)
                                // ? "bg-green-500 text-white"
                                // : seat.status !== "AVAILABLE"
                                //     ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                //     : "bg-white hover:bg-gray-100"
                                ? "bg-green-500 text-white" // 내가 선택한 좌석
                                : seat.status === "AVAILABLE" 
                                    ? "bg-white hover:bg-gray-100" // 예약 가능
                                    : seat.status === "HELD"
                                        ? "bg-yellow-300 text-black cursor-not-allowed" // 선점 중
                                        : "bg-gray-400 text-white cursor-not-allowed" // 예약 완료
                        }`}
                    >
                        {seat.seatCode}
                    </button>
                ))}
            </div>
            <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`w-full py-2 rounded text-white ${
                    isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
                {isLoading ? "예매 중..." : "예매하기"}
            </button>
        </div>
    );
}

export default SeatSelectionPage;
