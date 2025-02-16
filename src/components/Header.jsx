import "./Header.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // 스타일링을 위한 CSS

const Header = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [userName, setUserName] = useState(""); // 로그인한 유저의 이름 저장
  const navigate = useNavigate();

  // 로그인한 사용자 정보 가져오기
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user?.username) {
          setUserName(user.username);
          console.log("로그인된 사용자:", user.username);
        } else {
          console.warn("사용자 정보에 name이 없음:", user);
        }
      } catch (error) {
        console.error("localStorage 파싱 오류:", error);
      }
    } else {
      console.warn("localStorage에 사용자 정보 없음");
    }
  }, []);

  // 로그아웃 함수 (확인 창 추가)
  const handleLogout = () => {
    const confirmLogout = window.confirm("로그아웃하시겠습니까?");
    if (confirmLogout) {
      localStorage.removeItem("user"); // 사용자 정보 삭제
      alert("로그아웃 되었습니다.");
      navigate("/"); // 로그인 페이지로 이동
    }
  };

  // 날짜 변경 함수
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // 날짜 이동 (하루 전, 하루 후)
  const moveDate = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + direction);
    setSelectedDate(newDate);
  };

  return (
    <div className="Header">
      <button onClick={() => moveDate(-1)}>{"<"}</button>
      <div>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
          className="date-picker-input"
        />
      </div>
      <button onClick={() => moveDate(1)}>{">"}</button>

      {/* 로그인한 사용자 정보 표시 */}
      <div className="user-info">
        {userName ? (
          <span>
            {userName}님 |{" "}
            <span className="logout-link" onClick={handleLogout}>
              로그아웃
            </span>
          </span>
        ) : (
          <span>로그인 필요</span>
        )}
      </div>
    </div>
  );
};

export default Header;
