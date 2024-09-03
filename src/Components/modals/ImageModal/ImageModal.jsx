// ImageModal.js
import React from 'react';
import Modal from 'react-modal';
import { IoIosCloseCircleOutline } from "react-icons/io";


// Custom styles for the modal
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    borderRadius: '10px',
  },
imageGallery: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '10px',    
}
};


const ImageModal = ({ isOpen, onRequestClose, images }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Image Gallery"
    >   

    <IoIosCloseCircleOutline style={{cursor: "pointer"}} onClick={onRequestClose} />
      
      <div style={customStyles.imageGallery}>
        {images.map((image, index) => (
          <img key={index} src={image} alt={`image ${index + 1}`} />
        ))}
      </div>
    </Modal>
  );
};

export default ImageModal;
