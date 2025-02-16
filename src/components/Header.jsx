import "./Header.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // 스타일링을 위한 CSS

const Header = ({ selectedDate, setSelectedDate, moveDate }) => {
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

  // 로그아웃 함수
  const handleLogout = () => {
    const confirmLogout = window.confirm("로그아웃하시겠습니까?");
    if (confirmLogout) {
      localStorage.removeItem("user"); // 사용자 정보 삭제
      alert("로그아웃 되었습니다.");
      navigate("/"); // 로그인 페이지로 이동
    }
  };

  // 날짜 선택 시 업데이트 (DatePicker에서 선택한 날짜 반영)
  const handleDateChange = (date) => {
    setSelectedDate(date);
    moveDate(0, date); //선택한 날짜로 리스트 필터링 (Home.jsx에서 처리)
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
