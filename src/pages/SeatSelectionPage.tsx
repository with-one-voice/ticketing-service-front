import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";

interface Seat {
  seatId: string;
  seatCode: string;
  status: "AVAILABLE" | "HOLD" | "RESERVED";
  price: number;
}

function SeatSelectionPage() {
  const { accessToken } = useAuth();
  const { showId } = useParams();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionId) return;

    const fetchSeats = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/seats/${sessionId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setSeats(res.data.result);
      } catch (err) {
        console.error("좌석 불러오기 실패", err);
      }
    };

    fetchSeats();
  }, [accessToken, sessionId]);

  const handleSelect = (seatId: string) => {
    setSelectedSeatId(seatId === selectedSeatId ? null : seatId);
  };

  const selectedSeat = seats.find((s) => s.seatId === selectedSeatId);

  const goToPayment = () => {
    if (selectedSeatId && sessionId) {
      navigate(
        `/shows/${showId}/payment?sessionId=${sessionId}&seatId=${selectedSeatId}`,
        { state: { seatCode: selectedSeat?.seatCode } }
      );
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-white">
      <h1 className="text-2xl font-bold text-center mb-6">좌석을 선택하세요</h1>

      <div className="max-w-3xl mx-auto grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
        {seats.map((seat) => {
          const isSelected = seat.seatId === selectedSeatId;

          const baseClass = "p-4 text-center rounded cursor-pointer border font-semibold";
          const statusClass = {
            AVAILABLE: "bg-green-100 hover:bg-green-200 text-green-700 border-green-300",
            HOLD: "bg-yellow-100 text-yellow-700 border-yellow-300 cursor-not-allowed",
            RESERVED: "bg-red-100 text-red-600 border-red-300 cursor-not-allowed",
          }[seat.status];

          const selectedClass = isSelected ? "ring-2 ring-blue-500" : "";

          return (
            <div
              key={seat.seatId}
              className={`${baseClass} ${statusClass} ${selectedClass}`}
              onClick={() => seat.status === "AVAILABLE" && handleSelect(seat.seatId)}
            >
              {seat.seatCode}
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        {selectedSeat ? (
          <>
            <p className="text-lg text-blue-700 mb-4">
              선택된 좌석: <strong>{selectedSeat.seatCode}</strong>
            </p>
            <button
              onClick={goToPayment}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
            >
              결제하러 가기
            </button>
          </>
        ) : (
          <p className="text-gray-500">좌석을 선택해주세요.</p>
        )}
      </div>
    </div>
  );
}

export default SeatSelectionPage;
