// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useAuth } from "../contexts/AuthContext";
//
// interface Session {
//   sessionId: string;
//   sessionDate: string;
//   startTime: string;  // 문자열 "HH:mm:ss"
//   endTime: string;    // 문자열 "HH:mm:ss"
//   seatCount: number;
//   seatPrice: number;
// }
//
// function ShowSessionsPage() {
//   const { accessToken } = useAuth();
//   const { showId } = useParams();
//   const [sessions, setSessions] = useState<Session[]>([]);
//   const navigate = useNavigate();
//
//   useEffect(() => {
//     const fetchSessions = async () => {
//       try {
//         const res = await axios.get(`http://localhost:8080/api/shows/${showId}/sessions`, {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });
//         setSessions(res.data.result);
//       } catch (err) {
//         console.error("세션 불러오기 실패", err);
//       }
//     };
//
//     fetchSessions();
//   }, [accessToken, showId]);
//
//   const formatTime = (timeStr?: string) => {
//     if (!timeStr) return "??:??";
//     const [hour, minute] = timeStr.split(":");
//     return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
//   };
//
//   return (
//     <div className="min-h-screen bg-white px-4 py-8">
//       <h1 className="text-2xl font-bold text-center mb-6">세션을 선택하세요</h1>
//       <div className="max-w-3xl mx-auto grid gap-4">
//         {sessions.map((s) => (
//           <div
//             key={s.sessionId}
//             className="border p-4 rounded shadow hover:bg-gray-50 cursor-pointer"
//             onClick={() => navigate(`/shows/${showId}/seats?sessionId=${s.sessionId}`)}
//           >
//             <p className="text-lg font-semibold">{s.sessionDate}</p>
//             <p className="text-gray-600">
//               {formatTime(s.startTime)} ~ {formatTime(s.endTime)} | 💺 좌석: {s.seatCount} | 💰 {s.seatPrice.toLocaleString()}원
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
//
// export default ShowSessionsPage;
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

interface Session {
  sessionId: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  seatCount: number;
  seatPrice: number;
}

function ShowSessionsPage() {
  const { accessToken } = useAuth();
  const { showId } = useParams();
  const [sessions, setSessions] = useState<Session[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!showId || !accessToken) return;
    axios
        .get(`http://localhost:8080/api/shows/${showId}/sessions`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => setSessions(res.data.result))
        .catch((err) => console.error("세션 불러오기 실패", err));
  }, [showId, accessToken]);

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return "??:??";
    const [hour, minute] = timeStr.split(":");
    return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
  };

  const handleSessionClick = (session: Session) => {
    const searchParams = new URLSearchParams({
      sessionId: session.sessionId,
      seatPrice: session.seatPrice.toString(),
    });
    navigate(`/shows/${showId}/seats?${searchParams.toString()}`);
  };

  return (
      <div className="min-h-screen bg-white px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-6">세션을 선택하세요</h1>
        <div className="max-w-3xl mx-auto grid gap-4">
          {sessions.map((s) => (
              <div
                  key={s.sessionId}
                  className="border p-4 rounded shadow hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSessionClick(s)}
              >
                <p className="text-lg font-semibold">{s.sessionDate}</p>
                <p className="text-gray-600">
                  {formatTime(s.startTime)} ~ {formatTime(s.endTime)} | 💺 좌석:{" "}
                  {s.seatCount} | 💰 {s.seatPrice.toLocaleString()}원
                </p>
              </div>
          ))}
        </div>
      </div>
  );
}

export default ShowSessionsPage;
