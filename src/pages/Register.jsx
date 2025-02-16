import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";
import "./Form.css";

const Register = () => {
  const [userId, setId] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!userId.trim() || !password.trim() || !username.trim()) {
      alert("모든 필드를 입력해주세요!");
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, password, username }),
      });
      const data = await response.json();

      if (data.message === "회원가입 성공") {
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/");
      } else {
        alert(data.message || "이미 존재하는 아이디입니다.");
      }
    } catch (error) {
      console.error("회원가입 중 오류 발생", error);
      alert("서버와의 통신 중 문제가 발생했습니다.");
    }
  };

  return (
    <div className="form-container register-container">
      <h2>회원가입</h2>
      <input
        type="text"
        placeholder="아이디"
        value={userId}
        onChange={(e) => setId(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="text"
        placeholder="이름"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleRegister}>회원가입</button>
      <Link to="/" className="link back-link">
        이전으로
      </Link>
    </div>
  );
};

export default Register;
