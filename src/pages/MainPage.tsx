import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../apis/axiosInstance";

function MainPage() {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId"); // 회원가입에서 저장된 userId
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;

        axiosInstance
            .get(`/users/${userId}`)
            .then((res) => {
                console.log("유저 정보 응답:", res.data);
                setEmail(res.data.email);
            })
            .catch((err) => {
                console.error(" 유저 정보 요청 실패", err);
            });
    }, [userId]);
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">🎉 환영합니다! 🎉</h1>
            <p className="mb-4 text-gray-600">
                {email ? `${email} 님, OneVoice에 오신 것을 환영합니다.` : "사용자 정보 없음"}
            </p>

            <div className="flex flex-wrap gap-4">
                <button
                    onClick={() => navigate("/shows")}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    공연 선택하러 가기
                </button>
                <button
                    onClick={() => navigate("/profile")}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                >
                    내 정보
                </button>
                <button
                    onClick={() => navigate("/admin/create-show")}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    공연 생성
                </button>
                <button
                    onClick={() => {
                        localStorage.clear();
                        navigate("/login");
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    로그아웃
                </button>
            </div>
        </div>
    );
}
export default MainPage;
