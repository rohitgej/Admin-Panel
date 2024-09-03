import React from 'react';
import { MdEdit, MdDelete } from 'react-icons/md';
import './ListCard.css'; // Assuming you saved the CSS in ListCard.css

const ListCard = ({ imageUrl, title, onEdit, onDelete }) => {
  return (
    <div className="Lcard">  
      <img src={imageUrl} alt={title} className="image" />
        <h2 className="title">{title}</h2>
      <div className="buttons-container">
          <MdEdit className="icon" onClick={onEdit} title="Edit" />
          <MdDelete className="icon delete-icon" onClick={onDelete} title="Delete" />
        </div>
    </div>
  );
};

export default ListCard;
