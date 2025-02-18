import { TodoDispatchContext } from "../context/TodoContext";
import "./TodoItem.css";
import { memo, useContext, useState } from "react";
import DeleteModal from "./DeleteModal";
import GetDataModal from "./GetDataModal"; // GetDataModal 임포트

const TodoItem = ({ listId, done, content, priority, startDate, endDate }) => {
  const dispatch = useContext(TodoDispatchContext);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState(null);

  // 체크박스 상태 변경
  const onChangeCheckBox = () => {
    if (!dispatch) {
      console.error("dispatch가 존재하지 않습니다!");
      return;
    }
    console.log(" Clicked Todo id:", listId);
    console.log(" isDone value before update:", done);

    dispatch({ type: "UPDATE", targetId: listId, newIsDone: !done });
  };

  //  삭제 모달 열기
  const openDeleteModal = (id) => {
    setSelectedTodoId(id);
    setIsDeleteModalOpen(true);
  };

  //  삭제 확인
  const onConfirmDelete = () => {
    if (!dispatch) {
      console.error("dispatch가 존재하지 않습니다!");
      return;
    }
    if (selectedTodoId) {
      dispatch({ type: "DELETE", targetId: selectedTodoId });
      setIsDeleteModalOpen(false);
    } else {
      console.error("삭제할 Todo ID가 유효하지 않습니다!");
    }
  };

  // 편집 모달 열기
  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  //  할 일 수정
  const onEditConfirm = (newContent, newPriority, newStartDate, newEndDate) => {
    if (!dispatch) {
      console.error("dispatch가 존재하지 않습니다!");
      return;
    }
    dispatch({
      type: "EDIT",
      targetId: listId,
      newContent,
      newPriority,
      newStartDate,
      newEndDate,
    });
    setIsEditModalOpen(false);
  };

  //  날짜 포맷팅
  const formatDate = (date) => {
    const options = {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Date(date)
      .toLocaleString("ko-KR", options)
      .replaceAll(". ", ".");
  };

  return (
    <div className="TodoItem">
      <input
        onChange={onChangeCheckBox}
        checked={done}
        type="checkbox"
        data-priority={priority}
      />
      <div className={`content ${done ? "done" : ""}`}>{content}</div>

      <div className="dates">
        시작 : {formatDate(startDate)} <br />
        종료 : {formatDate(endDate)}
      </div>

      <button onClick={() => openDeleteModal(listId)}>삭제</button>
      <button onClick={openEditModal}>편집</button>

      {isDeleteModalOpen && (
        <DeleteModal
          message={`${content}을(를) 삭제하시겠습니까?`}
          onConfirm={onConfirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}

      {isEditModalOpen && (
        <GetDataModal
          initialContent={content}
          initialPriority={priority}
          initialStartDate={startDate ? new Date(startDate) : null}
          initialEndDate={endDate ? new Date(endDate) : null}
          onConfirm={onEditConfirm}
          onCancel={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};

export default memo(TodoItem);
