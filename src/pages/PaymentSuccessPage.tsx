import { useEffect, useState } from "react";

interface Seat {
    seatId: string;
    seatCode: string;
}

function PaymentSuccessPage() {
    const [seats, setSeats] = useState<Seat[]>([]);
    const [paymentAmount, setPaymentAmount] = useState<number>(0);

    useEffect(() => {
        const storedSeats = localStorage.getItem("selectedSeats");
        const amount = localStorage.getItem("paymentAmount");

        if (storedSeats) {
            setSeats(JSON.parse(storedSeats));
        }

        if (amount) {
            setPaymentAmount(Number(amount));
        }
    }, []);

    return (
        <div className="p-6 max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4 text-green-600">🎉 결제 완료!</h1>

            <div className="text-left text-gray-700 mb-6">
                <p>
                    <strong>결제 금액:</strong> {paymentAmount.toLocaleString()}원
                </p>
                <p className="mt-2">
                    <strong>예매한 좌석:</strong>
                </p>
                <ul className="list-disc ml-6">
                    {seats.length > 0 ? (
                        seats.map((seat, idx) => (
                            <li key={seat.seatId}>
                                좌석 코드: {seat.seatCode}
                            </li>
                        ))
                    ) : (
                        <li>좌석 정보 없음</li>
                    )}
                </ul>
            </div>

            <button
                onClick={() => window.location.href = "/main"}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                메인으로
            </button>

        </div>
    );
}

export default PaymentSuccessPage;
