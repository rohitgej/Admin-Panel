import React, { useState } from 'react';
import './EditModal.css';
import { FiInfo } from "react-icons/fi";
import DOMAIN_NAME from '../../../Config/Config';

function EditModal({ show, onClose, onSave, initialData }) {
  const [imageUrl, setImageUrl] = useState(initialData.imageUrl);
  const [title, setTitle] = useState(initialData.title);
  const [imageFile, setImageFile] = useState(null); // To store the selected file
  const [showTooltip, setShowTooltip] = useState(false); // State for tooltip visibility

  if (!show) {
    return null;
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Store the file for uploading
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result); // Preview image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("laundrytype_id", initialData.id);
    formData.append("Laundrytype_image", imageFile);  // Assuming imageFile is set correctly
    formData.append("Laundrytype_name", title);
  
    const myHeaders = new Headers();
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    if (token) {
      myHeaders.append("Authorization", `Bearer ${token}`);
    }
  
    try {
      const response = await fetch(`${DOMAIN_NAME}api/updatelaundrytype`, {
        method: "PUT",
        headers: myHeaders,
        body: formData,
        redirect: "follow"
      });
  
      const result = await response.json();
      alert(result.message)
  
      // Notify parent of successful update
      onSave({ imageUrl: imageUrl, title: title }); 
      onClose();
    } catch (error) {
      console.error("Error updating laundry item:", error);
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
          <h2>Edit Laundry Item</h2>
          <FiInfo
            title='Use 100X100'
            onClick={toggleTooltip}
            style={{ cursor: 'pointer', marginLeft: '10px' }}
          />
        </div>
        <label>
          Image:
          <div>
            {imageUrl && <img src={imageUrl} alt="Preview" className="image-preview" />}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>
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

export default EditModal;
