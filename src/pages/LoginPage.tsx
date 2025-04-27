
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../apis/axiosInstance";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // /auth/login/v2 호출
      const res = await axiosInstance.post("/auth/login/v2", { email, password });

      // 응답 헤더에서 토큰 추출
      const token = res.headers["authorization"]?.replace("Bearer ", "");

      // 응답 body(result)에서 userId 추출
      const userId = res.data.result.userId;

      if (!token || !userId) {
        throw new Error("로그인 응답에 필요한 정보가 없습니다.");
      }

      // 토큰과 유저ID를 localStorage에 저장
      localStorage.setItem("accessToken", token);
      localStorage.setItem("userId", userId);

      // 로그인 성공하면 메인페이지로 이동
      alert("로그인 성공!");
      navigate("/main");

    } catch (err) {
      console.error("로그인 실패", err);
      setError("로그인에 실패했습니다. 이메일 또는 비밀번호를 다시 확인해주세요.");
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center">로그인</h1>

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
            로그인
          </button>

          <p className="text-sm text-center mt-4">
            아직 회원이 아니신가요?{" "}
            <span
                className="text-blue-600 hover:underline cursor-pointer"
                onClick={() => navigate("/signup")}
            >
            회원가입
          </span>
          </p>
        </form>
      </div>
  );
}

export default LoginPage;
