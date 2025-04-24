import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../apis/axiosInstance";

type PaymentMethod = "CARD" | "ACCOUNT";

interface Seat {
    seatId: string;
    seatCode: string;
}

function PaymentPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const ticketId = new URLSearchParams(location.search).get("ticketId");

    const [paymentAmount, setPaymentAmount] = useState<number>(0);
    const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CARD");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const amount = Number(localStorage.getItem("paymentAmount") || "0");
        const seats = JSON.parse(localStorage.getItem("selectedSeats") || "[]");

        setPaymentAmount(amount);
        setSelectedSeats(seats);
    }, []);

    const handlePayment = async () => {
        if (!ticketId || paymentAmount <= 0) {
            alert("결제 정보가 부족합니다.");
            return;
        }

        setIsLoading(true);
        try {
            const res = await axiosInstance.post("/payments", {
                ticketId,
                paymentAmount,
                paymentMethod,
            });

            const paymentUri = res.data.result;
            const paymentId = paymentUri.split("/").pop();

            if (!paymentId) throw new Error("결제 ID 누락");

            if (paymentMethod === "CARD") {
                const kakaoRes = await axiosInstance.get(`/payments/rest/kakao/ready/${paymentId}`);
                const redirectUrl = kakaoRes.data.next_redirect_pc_url;

                if (!redirectUrl) throw new Error("카카오페이 redirect URL 누락");

                window.location.href = redirectUrl;
            } else {
                navigate("/payment-success");
            }
        } catch (err) {
            console.error("결제 실패", err);
            alert("결제에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">결제</h1>

            <div className="mb-4">
                <p className="text-gray-700">
                    <strong>결제 금액:</strong> {paymentAmount.toLocaleString()}원
                </p>
                <p className="text-gray-700 mt-2">
                    <strong>선택한 좌석:</strong>
                </p>
                <ul className="list-disc ml-6 text-gray-600">
                    {selectedSeats.map((seat, idx) => (
                        <li key={seat.seatId}>좌석 코드: {seat.seatCode}</li>
                    ))}
                </ul>
            </div>

            <div className="mb-4">
                <label className="block mb-2 font-semibold">결제 방식 선택</label>
                <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full p-2 border rounded"
                >
                    <option value="CARD">카카오페이</option>
                    <option value="ACCOUNT">무통장입금</option>
                </select>
            </div>

            <button
                onClick={handlePayment}
                disabled={isLoading}
                className={`w-full py-2 rounded text-white ${
                    isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
                {isLoading ? "결제 처리 중..." : "결제하기"}
            </button>
        </div>
    );
}

export default PaymentPage;
