import { useState } from "react";
import axiosInstance from "../apis/axiosInstance";
import { useNavigate } from "react-router-dom";

function SignupPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            // 1. 회원가입 요청
            const response = await axiosInstance.post("/auth/signup", {
                email,
                password,
            });

            // 2. 회원가입 성공 → 로그인 요청
            const loginResponse = await axiosInstance.post("http://localhost:8080/api/auth/login", {
                email,
                password,
            });

            const token = loginResponse.headers["authorization"]?.replace("Bearer ", "");
            const userId = response.data.result?.userId;

            if (!token || !userId) {
                throw new Error("로그인 응답에 필요한 정보 없음");
            }

            // 3. 토큰 + 유저 ID 저장
            localStorage.setItem("accessToken", token);
            localStorage.setItem("userId", userId);

            // 4. 메인 페이지로 이동
            navigate("/main");
        } catch (err: any) {
            console.error("회원가입 or 로그인 실패", err);
            setError("회원가입 또는 자동 로그인에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4 text-center">회원가입</h1>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <label className="block mb-2">
                    이메일
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mt-1 p-2 border rounded"
                        required
                    />
                </label>

                <label className="block mb-4">
                    비밀번호
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mt-1 p-2 border rounded"
                        required
                    />
                </label>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    회원가입
                </button>

                <p className="text-sm text-center mt-4">
                    이미 계정이 있으신가요?{" "}
                    <span
                        className="text-blue-600 hover:underline cursor-pointer"
                        onClick={() => navigate("/login")}
                    >
            로그인
          </span>
                </p>
            </form>
        </div>
    );
}

export default SignupPage;
