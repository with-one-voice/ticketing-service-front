// /api/users/login에서 userId를 넘겨주지 않아서 localStorage에 저장 불가능 -> api/users/{userId} 조회 불가능 : Undefined

import { useState } from "react";
import axiosInstance from "../apis/axiosInstance";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      //  토큰 추출
      const token = response.headers["authorization"]?.replace("Bearer ", "");
      if (!token) throw new Error("토큰 없음");

      console.log("로그인 응답 데이터:", response.data);
      // 응답 body에서 userId 추출
      const userId = response.data.userId; // 또는 response.data.data.userId 구조일 수도 있어

      // 저장
      localStorage.setItem("accessToken", token);
      localStorage.setItem("userId", userId);


      navigate("/main"); // 로그인 성공 시 MainPage로 이동
    } catch (err) {
      setError("로그인 실패! 이메일 또는 비밀번호를 확인해주세요.");
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-full max-w-md">
          <h2 className="text-xl font-bold text-center mb-4">로그인</h2>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded mb-3"
              required
          />
          <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              required
          />
          <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            로그인
          </button>
        </form>
      </div>
  );
}

export default LoginPage;
