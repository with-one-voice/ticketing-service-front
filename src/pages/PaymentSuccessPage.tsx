import { useLocation, useNavigate } from "react-router-dom";

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const seatCode = location.state?.seatCode || "선택한 좌석";
  const amount = location.state?.paymentAmount || 0;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white px-4">
      <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 결제 완료!</h1>
      <p className="text-gray-700 mb-2">
        <strong>{seatCode}</strong> 좌석에 대해 <strong>{amount.toLocaleString()}원</strong> 결제가 완료되었습니다.
      </p>

      <div className="mt-6 space-x-4">
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          메인으로
        </button>
        <button
          onClick={() => navigate("/profile")}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          내 정보 보기
        </button>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;
