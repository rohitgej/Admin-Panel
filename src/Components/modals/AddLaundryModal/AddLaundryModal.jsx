import React, { useState } from 'react';
import '../AddCategoriesModal/AddCategoriesModal.css';
import { FiInfo } from 'react-icons/fi';
import DOMAIN_NAME from '../../../Config/Config';

function AddLaundryModal({ show, onSave, onClose }) {
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  if (!show) {
    return null};

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImageUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!title || !imageFile) {
      alert("Title and image are required");
      return;
    }
  
    // Retrieve the token from local storage
    const token = localStorage.getItem("token");
  
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`); // Use the token from local storage
  
    const formData = new FormData();
    formData.append("Laundrytype_name", title);
    formData.append("Laundrytype_image", imageFile); // Assuming imageFile is your selected file object
  
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    };
  
    try {
      const response = await fetch(`${DOMAIN_NAME}api/addlaundrytype`, requestOptions);
      const result = await response.json(); // Assuming the response returns the new laundry item with its ID
      if (response.ok) {
        const newItem = {
          id: result._id, // Assuming this comes back from the API
          imageUrl: result.Laundrytype_image,
          title: result.Laundrytype_name,
        };
        alert(result.message)
        onSave(newItem); // Pass the new item back to the parent
        onClose(); // Close the modal after saving
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert(error);
    }
  };
  
  

  const toggleTooltip = () => setShowTooltip(!showTooltip);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
      <div className='Modalinfo'>
      {showTooltip && <div className="tooltip">Use 100x100 image</div>}
      </div>
        <div className='editModalHead'>
          <h2>Add New Laundry Item</h2>
          <FiInfo
            title='Use 100x100'
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

export default AddLaundryModal;
