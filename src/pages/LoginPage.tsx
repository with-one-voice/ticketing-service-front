import { useState } from "react";
import axios from "axios";
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
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });

      const token = response.headers["authorization"]?.replace("Bearer ", "");
      if (!token) throw new Error("토큰 없음");

      localStorage.setItem("accessToken", token);

      // 🔥 여기 핵심!
      navigate("/"); // 로그인 성공 시 MainPage로 이동
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
