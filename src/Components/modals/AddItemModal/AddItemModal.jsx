import React, { useState } from "react";
import "./AdditemModal.css";

function AddItemModal({
  show,
  onClose,
  onSave,
  onDelete,
  initialData,
  categories,
}) {
  const [imageUrl, setImageUrl] = useState(initialData.imageUrl);
  const [title, setTitle] = useState(initialData.title);
  const [weight, setWeight] = useState(initialData.weight);
  const [selectedCategory, setSelectedCategory] = useState(
    initialData.category || ""
  );

  if (!show) {
    return null;
  }

  const handleSave = () => {
    onSave({ imageUrl, title, weight, category: selectedCategory });
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="titleSec">
          <h2>Edit Item</h2>
        </div>

        <div className="bodySec">
          <img
            className="product-img"
            alt="product img"
            src={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />

          <div className="form-group">
            <label>
              Title:
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <label>
              Category:
              <br />
              <select
                className="SelectSec"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <div className="WeightSec">
              <div>Weight(in grams):</div>

              <div>
                <input
                  className="WeightSecInput"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="modal-actions"> 
          <button onClick={handleSave}>Save</button>
          <button onClick={handleDelete}>Delete</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default AddItemModal;
