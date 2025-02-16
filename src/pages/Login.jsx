import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";
import "./Form.css";

const Login = () => {
  const [userId, setUserId] = useState(""); //
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  //  로그인 요청
  const handleLogin = async () => {
    try {
      const response = await fetch(`${BASE_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 세션 쿠키를 포함하여 요청
        body: JSON.stringify({ userId, password }),
      });

      if (!response.ok) {
        alert("아이디 또는 비밀번호가 올바르지 않습니다.");
        return;
      }
      // 로그인 후 세션 정보 확인
      const sessionResponse = await fetch(`${BASE_URL}/users/session`, {
        method: "GET",
        credentials: "include",
      });

      if (!sessionResponse.ok) {
        console.error("세션 확인 실패");
        return;
      }
      const userData = await sessionResponse.json();
      localStorage.setItem("user", JSON.stringify(userData)); //세션 데이터 저장
      navigate("/home");
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
      alert("서버와의 통신 중 문제가 발생했습니다.");
    }
  };

  return (
    <div className="form-container login-container">
      <h2>로그인</h2>
      <input
        type="text"
        placeholder="아이디"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>로그인</button>
      <p>
        계정이 없으신가요?{" "}
        <Link to="/register" className="link signup-link">
          회원가입
        </Link>
      </p>
    </div>
  );
};

export default Login;
