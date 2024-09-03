import React, { useState } from 'react';
import './EditCategoryModal.css';
import { FiInfo } from "react-icons/fi";
import DOMAIN_NAME from '../../../Config/Config';

function EditCategoryModal({ show, onClose, onSave, initialData }) {
  const [title, setTitle] = useState(initialData.title);
  const [showTooltip, setShowTooltip] = useState(false); // State for tooltip visibility

  if (!show) {
    return null;
  }
  const token = localStorage.getItem('token');
  const handleSave = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);
    const raw = JSON.stringify({
      _id: initialData.id,
      category_name: title,
    });

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    try {
      const response = await fetch(`${DOMAIN_NAME}api/updatecategory`, requestOptions);
      const result = await response.json();
      alert(result.message);
      onSave({ title: title }); // Notify parent of successful update
      onClose();
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className='Modalinfo'>
          {showTooltip && <div className="tooltip">Use 100x100 image</div>}
        </div>
        <div className='editModalHead'>
          <h2>Edit Category</h2>
          <FiInfo
            title='Use 100X100'
            onClick={toggleTooltip}
            style={{ cursor: 'pointer', marginLeft: '10px' }}
          />
        </div>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <div className="Edit-modal-actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default EditCategoryModal;
  