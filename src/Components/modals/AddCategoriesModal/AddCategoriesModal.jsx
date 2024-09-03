import React, { useState } from 'react';
import '../AddLaundryModal/AddLaundryModal.css';
import { FiInfo } from 'react-icons/fi';
import DOMAIN_NAME from '../../../Config/Config';

function AddCategoriesModal({ show, onSave, onClose }) {
  const [title, setTitle] = useState('');
  const token=localStorage.getItem('token')

  const [showTooltip, setShowTooltip] = useState(false);

  if (!show) {
    return null;
  }

  const handleSave = async () => {
    if (!title) {
      alert("Title is required");
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`); 
    const raw = JSON.stringify({
      "category_name": title
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    try {
      const response = await fetch(`${DOMAIN_NAME}api/addcategory`, requestOptions);
      const result = await response.json(); // Assuming the response returns the new category with its ID
      alert(result.message)
      const newItem = {
        id: result._id, // Assuming this comes back from the API
        title: result.category_name,
      };

      onSave(newItem); // Pass the new item back to the parent
      onClose(); // Close the modal after saving
    } catch (error) {
      alert('Error adding category:', error);
     
    }
  };

  const toggleTooltip = () => setShowTooltip(!showTooltip);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className='Modalinfo'>
          {showTooltip && <div className="tooltip">Add new Category</div>}
        </div>
        <div className='editModalHead'>
          <h2>Add New Category</h2>
          <FiInfo
            title='Use 100x100'
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

export default AddCategoriesModal;
