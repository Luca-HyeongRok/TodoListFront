import "./DeleteModal.css";

const DeleteModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content delete">
        <h2>{message}</h2>
        <div className="delete-modal-actions">
          <button onClick={onConfirm}>확인</button>
          <button onClick={onCancel}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
