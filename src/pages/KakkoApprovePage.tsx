// import { useEffect } from "react";
// import { useNavigate, useParams, useSearchParams } from "react-router-dom";
// import axiosInstance from "../apis/axiosInstance";
//
// function KakaoApprovePage() {
//     const { paymentId } = useParams();
//     const [searchParams] = useSearchParams();
//     const navigate = useNavigate();
//
//     useEffect(() => {
//         const pgToken = searchParams.get("pg_token");
//
//         if (!paymentId || !pgToken) {
//             alert("결제 승인에 필요한 정보가 부족합니다.");
//             navigate("/main");
//             return;
//         }
//
//         axiosInstance
//             .get(`/payments/rest/kakao/approve/${paymentId}?pg_token=${pgToken}`)
//             .then(() => {
//                 alert("결제가 완료되었습니다!");
//                 navigate("/payment-success");
//             })
//             .catch((err) => {
//                 console.error("카카오페이 승인 실패", err);
//                 alert("결제 승인에 실패했습니다.");
//                 navigate("/main");
//             });
//     }, [paymentId, searchParams, navigate]);
//
//     return (
//         <div className="text-center p-10">
//             <h2 className="text-xl font-bold mb-4">결제를 확인 중입니다...</h2>
//         </div>
//     );
// }
//
// export default KakaoApprovePage;
import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axiosInstance from "../apis/axiosInstance";

function KakaoApprovePage() {
    const { paymentId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const pgToken = searchParams.get("pg_token");
        const ticketId = localStorage.getItem("ticketId");
        const paymentAmount = localStorage.getItem("paymentAmount");



        // 백엔드 REST 승인 API 호출
        axiosInstance
            .get(`/payments/kakao/approve/${paymentId}?pg_token=${pgToken}`)
            .then(() => {
                alert("결제가 완료되었습니다!");
                navigate(`/payment-success?ticketId=${ticketId}&paymentAmount=${paymentAmount}`);
            })
            .catch((err) => {
                console.error("카카오페이 승인 실패", err);
                alert("결제 승인에 실패했습니다.");
                navigate("/main");
            });
    }, [paymentId, searchParams, navigate]);

    return (
        <div className="text-center p-10">
            <h2 className="text-xl font-bold mb-4">결제를 확인 중입니다...</h2>
        </div>
    );
}

export default KakaoApprovePage;
