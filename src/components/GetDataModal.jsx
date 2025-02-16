import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./GetDataModal.css";

const GetDataModal = ({
  initialContent,
  initialPriority,
  initialStartDate,
  initialEndDate,
  onConfirm,
  onCancel,
}) => {
  const [content, setContent] = useState(initialContent || "");
  const [priority, setPriority] = useState(initialPriority || 3);

  // 선택한 날짜의 00:00:00으로 설정
  const [startDate, setStartDate] = useState(
    initialStartDate
      ? new Date(new Date(initialStartDate).setHours(0, 0, 0, 0))
      : new Date(new Date().setHours(0, 0, 0, 0))
  );

  const [endDate, setEndDate] = useState(
    initialEndDate ? new Date(initialEndDate) : null
  );

  const handleEndDateChange = (date) => {
    if (date <= startDate) {
      alert("종료일은 시작일보다 이후여야 합니다!");
      return;
    }
    setEndDate(date);
  };

  const handleConfirm = () => {
    if (!content || !startDate || !endDate) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    onConfirm(
      content,
      priority,
      startDate.toISOString(),
      endDate.toISOString()
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>할 일 세부사항을 입력하세요</h2>
        <div className="form-group">
          <label>할 일</label>
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="할 일 이름"
          />
        </div>
        <div className="form-group">
          <label>중요도</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value={1}>1 (가장 중요)</option>
            <option value={2}>2 (보통)</option>
            <option value={3}>3 (상관 없음)</option>
          </select>
        </div>

        {/* 시작 날짜 선택 */}
        <div className="form-group">
          <label>시작 날짜</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            showTimeSelect
            timeIntervals={30}
            dateFormat="Pp"
            className="datepicker"
          />
        </div>

        {/* 종료 날짜 선택 */}
        <div className="form-group">
          <label>종료 날짜</label>
          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            showTimeSelect
            timeIntervals={10}
            dateFormat="Pp"
            className="datepicker"
          />
        </div>

        <div className="modal-actions">
          <button onClick={handleConfirm}>확인</button>
          <button onClick={onCancel}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default GetDataModal;
