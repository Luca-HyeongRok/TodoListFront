import { TodoDispatchContext } from "../pages/Home";
import "./TodoItem.css";
import { memo, useContext, useState } from "react";
import DeleteModal from "./DeleteModal";
import GetDataModal from "./GetDataModal"; // GetDataModal 임포트

const TodoItem = ({ listId, done, content, priority, startDate, endDate }) => {
  const { onChange, onDelete, onEdit } = useContext(TodoDispatchContext);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // 새로 추가된 모달 상태
  const [selectedTodoId, setSelectedTodoId] = useState(null); // 삭제할 Todo ID 상태

  // 체크박스 상태 변경
  const onChangeCheckBox = () => {
    if (listId === undefined) {
      console.error("Invalid listId:", listId);
      return;
    }
    console.log("Clicked Todo id:", listId);
    console.log("isDone value before update:", done);
    onChange(listId, !done); // 기존의 isDone 값을 반전시켜서 업데이트
  };

  // 삭제 모달 열기
  const openDeleteModal = (id) => {
    setSelectedTodoId(id); // 선택된 Todo ID 저장
    setIsDeleteModalOpen(true); // 모달 열기
  };

  // 삭제 모달 닫기
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false); // 모달 닫기
  };

  // 삭제 확인
  const onConfirmDelete = () => {
    if (selectedTodoId) {
      // selectedTodoId가 유효한지 확인
      onDelete(selectedTodoId); // 삭제할 Todo ID 전달
      closeDeleteModal(); // 모달 닫기
    } else {
      console.error("삭제할 Todo ID가 유효하지 않습니다: ", selectedTodoId); // 디버깅용 에러 로그
    }
  };

  // 편집 모달 열기
  const openEditModal = () => {
    setIsEditModalOpen(true); // 편집 모달 열기
  };

  // 편집 모달 닫기
  const closeEditModal = () => {
    setIsEditModalOpen(false); // 편집 모달 닫기
  };

  // 할 일 수정
  const onEditConfirm = (newContent, newPriority, newStartDate, newEndDate) => {
    // 할 일 수정: 새로운 내용과 중요도, 날짜를 업데이트
    onEdit(listId, newContent, newPriority, newStartDate, newEndDate); // onChange가가 수정된 값들을 처리하도록 해야 함
    setIsEditModalOpen(false); // 모달 닫기
  };

  // 날짜 포맷팅 (년도.월.일 오전/오후 시:분 형식)
  const formatDate = (date) => {
    const options = {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // 오전/오후 형식
    };
    console.log(
      "--------------------------",
      new Date(date).toLocaleString("ko-KR", options).replaceAll(". ", ".")
    );
    return new Date(date)
      .toLocaleString("ko-KR", options)
      .replaceAll(". ", "."); // 한국식 날짜/시간 형식
  };

  return (
    <div className="TodoItem">
      <input
        onChange={onChangeCheckBox}
        checked={done} // 체크 상태를 isDone 값에 따라 결정
        type="checkbox"
        data-priority={priority} // 중요도에 맞는 색상 적용을 위해 data-priority 추가
      />
      <div className={`content ${done ? "done" : ""}`}>{content}</div>

      {/* 날짜 출력 (년도.월.일 오전/오후 시:분 형식) */}
      <div className="dates">
        시작 : {formatDate(startDate)} <br />
        종료 : {formatDate(endDate)}
      </div>

      <button onClick={() => openDeleteModal(listId)}>삭제</button>
      <button onClick={openEditModal}>편집</button>

      {/* 삭제 모달 */}
      {isDeleteModalOpen && (
        <DeleteModal
          message={`${content}을(를) 삭제하시겠습니까?`}
          onConfirm={onConfirmDelete} // 삭제 확인 시 onConfirmDelete 호출
          onCancel={closeDeleteModal} // 모달 취소 시 closeDeleteModal 호출
        />
      )}

      {/* 편집 모달 */}
      {isEditModalOpen && (
        <GetDataModal
          initialContent={content} // 기존 할 일 내용
          initialPriority={priority} // 기존 중요도
          initialStartDate={startDate ? new Date(startDate) : null} // 기존 시작 날짜
          initialEndDate={endDate ? new Date(endDate) : null} // 기존 종료 날짜
          onConfirm={onEditConfirm} // 수정된 데이터 처리 함수
          onCancel={closeEditModal} // 모달 닫기
        />
      )}
    </div>
  );
};

export default memo(TodoItem);
