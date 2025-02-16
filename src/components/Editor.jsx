import { useState, useContext } from "react";
import GetDataModal from "./GetDataModal";
import { TodoDispatchContext } from "../pages/Home";
import "./Editor.css";

const Editor = ({ selectedDate }) => {
  // 선택한 날짜를 `props`로 받음
  const { onCreate } = useContext(TodoDispatchContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState(""); // 할 일 내용

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onConfirmAdd = (content, priority, startDate, endDate) => {
    onCreate(content, priority, startDate, endDate);
    setContent("");
    setIsModalOpen(false);
  };

  return (
    <div className="Editor">
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="해야할 일을 추가해주세요"
      />
      <button onClick={openModal}>추가</button>

      {isModalOpen && (
        <GetDataModal
          initialContent={content}
          initialPriority={2}
          initialStartDate={selectedDate} // 선택한 날짜를 넘겨줌
          onConfirm={onConfirmAdd}
          onCancel={closeModal}
        />
      )}
    </div>
  );
};

export default Editor;
