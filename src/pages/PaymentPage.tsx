import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "react-router-dom";

function PaymentPage() {
  const { accessToken } = useAuth();
  const [searchParams] = useSearchParams();
  const { showId } = useParams();
  const sessionId = searchParams.get("sessionId");
  const seatId = searchParams.get("seatId");
  const userId = localStorage.getItem("userId") || "";
  const navigate = useNavigate();

  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<"CARD" | "ACCOUNT">("CARD");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const location = useLocation();
  const selectedSeatCode = location.state?.seatCode || "";

  useEffect(() => {
    const fetchSessionDetail = async () => {
      if (!sessionId) return;
      try {
        const res = await axios.get(`http://localhost:8080/api/shows/sessions/${sessionId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setPaymentAmount(res.data.result.seatPrice);
      } catch (err) {
        console.error("세션 가격 조회 실패", err);
        setMessage("세션 정보를 불러오는 데 실패했습니다.");
      }
    };

    fetchSessionDetail();
  }, [accessToken, sessionId]);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      // 1️⃣ 티켓 생성
      const ticketRes = await axios.post(
        "http://localhost:8080/api/tickets",
        {
          userId,
          sessionId,
          seatId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const ticketId = ticketRes.data.result.ticketId;

      // 2️⃣ 결제 요청
      const paymentRes = await axios.post(
        "http://localhost:8080/api/payments",
        {
          ticketId,
          sessionId,
          seatId,
          paymentAmount,
          paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setMessage("✅ 결제가 완료되었습니다.");
      navigate("/payment-success", {
        state: {
          seatCode: selectedSeatCode, // 좌석 코드 (프론트에서 저장해둬야 함)
          paymentAmount,
        },
      });
    } catch (err) {
      console.error("결제 실패", err);
      setMessage("❌ 결제에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-6">결제 페이지</h1>

      <div className="max-w-md mx-auto space-y-4">
        <div>
          <label className="block font-medium">결제 금액</label>
          <input
            type="number"
            value={paymentAmount}
            readOnly
            className="w-full p-2 border rounded mt-1 bg-gray-100"
          />
        </div>

        <div>
          <label className="block font-medium">결제 수단</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as "CARD" | "ACCOUNT")}
            className="w-full p-2 border rounded mt-1"
          >
            <option value="CARD">카드 결제</option>
            <option value="ACCOUNT">계좌 이체</option>
          </select>
        </div>

        <button
          onClick={handlePayment}
          disabled={isLoading || !sessionId || !seatId || !userId}
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "결제 중..." : "결제하기"}
        </button>

        {message && (
          <p className="text-center text-lg font-semibold mt-4">{message}</p>
        )}
      </div>
    </div>
  );
}

export default PaymentPage;
