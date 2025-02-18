import { useState, useContext } from "react";
import GetDataModal from "./GetDataModal";
import { TodoDispatchContext } from "../context/TodoContext";
import { createTodo } from "../utils/api";
import "./Editor.css";

const Editor = ({ selectedDate }) => {
  const dispatch = useContext(TodoDispatchContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState(""); // 할 일 내용

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onConfirmAdd = async (content, priority, startDate, endDate) => {
    if (!content.trim()) {
      alert("할 일을 입력하세요!");
      return;
    }

    const newTodo = {
      content,
      priority,
      startDate,
      endDate,
    };

    try {
      const createdTodo = await createTodo(newTodo); // API 호출
      if (!createdTodo) {
        alert("TODO 추가 실패!");
        return;
      }

      // 상태 업데이트 (TodoContext에 추가)
      dispatch({ type: "CREATE", data: createdTodo });

      setContent("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("할 일 추가 중 오류:", error);
    }
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
          onConfirm={onConfirmAdd} // API를 호출하여 TODO 추가
          onCancel={closeModal}
        />
      )}
    </div>
  );
};

export default Editor;
