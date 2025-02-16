import { useState, useContext } from "react";
import GetDataModal from "./GetDataModal";
import { TodoDispatchContext } from "../pages/Home";
import "./Editor.css";

const Editor = () => {
  const { onCreate } = useContext(TodoDispatchContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState(""); // 할 일 내용

  const openModal = () => {
    setIsModalOpen(true); // 모달 열기
  };

  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  const onConfirmAdd = (content, priority, startDate, endDate) => {
    // 할 일 생성 시 priority 값 전달
    onCreate(content, priority, startDate, endDate);
    setContent(""); // 입력 필드 초기화
    setIsModalOpen(false); // 모달 닫기
  };

  return (
    <div className="Editor">
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)} // 입력 필드 업데이트
        placeholder="해야할 일을 추가해주세요"
      />
      <button onClick={openModal}>추가</button>

      {isModalOpen && (
        <GetDataModal
          initialContent={content} // 기존 할 일 내용
          initialPriority={2} // 기본 중요도 2 전달
          onConfirm={onConfirmAdd} // 확인 시 데이터 처리
          onCancel={closeModal}
        />
      )}
    </div>
  );
};

export default Editor;
