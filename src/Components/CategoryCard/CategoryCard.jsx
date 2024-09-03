import React from 'react';
import { MdEdit, MdDelete } from 'react-icons/md';
import './CategoryCard.css'; // Assuming you saved the CSS in ListCard.css

const CategoryCard = ({ title, onEdit, onDelete }) => {
  return (
    <div className="Ccard">
        <h2 className="title">{title}</h2>
      <div className="buttons-container">
          <MdEdit className="icon" onClick={onEdit} title="Edit" />
          <MdDelete className="icon delete-icon" onClick={onDelete} title="Delete" />
        </div>
    </div>
  );
};

export default CategoryCard;
