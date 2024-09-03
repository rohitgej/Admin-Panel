import React, { useState, useEffect } from 'react';
import Button from '../../Button/Button';

const AssignDeliveryPartnerModal = ({ show, onClose, onAssign, order, assignType, selectedRunnerId }) => {
  const [selectedPartner, setSelectedPartner] = useState('');
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  
  console.log(selectedRunnerId);

  useEffect(() => {
    if (show) {
      const fetchDeliveryPartners = async () => {
        try {
          const response = await fetch("http://localhost:3000/api/view-runners", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: "",
            redirect: "follow",
          });
          const result = await response.json();
          setDeliveryPartners(result.runners);

          // Set the default selected partner based on selectedRunnerId
          if (selectedRunnerId) {
            setSelectedPartner(selectedRunnerId);
          }
        } catch (error) {
          console.error('Error fetching delivery partners:', error);
        }
      };
      fetchDeliveryPartners();
    }
  }, [show, selectedRunnerId]);

  const handleAssign = async () => {
    if (selectedPartner && order) {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from local storage

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`); // Use the token from local storage

        const selectedPartnerDetails = deliveryPartners.find(partner => partner.runner_id === selectedPartner);

        const raw = JSON.stringify({
          "order_id": order, 
          "runner_id": selectedPartner,
          "runner_mobile_no": selectedPartnerDetails?.runner_mobile_no,
          "delivery_type": assignType
        });

        console.log(order._id, selectedPartner, selectedPartnerDetails?.runner_mobile_no, assignType);
        
        const requestOptions = {
          method: "PUT",
          headers: myHeaders,
          body: raw,
          redirect: "follow"
        };

        const response = await fetch("http://localhost:3000/api/assignRunner", requestOptions);
        const result = await response.json();
        console.log(result);

        onAssign(selectedRunnerId); // Callback to parent component
        onClose();
      } catch (error) {
        console.error('Error assigning delivery partner:', error);
      }
    }
  };

  if (!show) return null;

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContainer}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Assign {assignType === 'pickup' ? 'Pickup' : 'Delivery'} Partner</h2>
          <button style={styles.closeButton} onClick={onClose}>&times;</button>
        </div>
        <div style={styles.modalBody}>
          <select
            style={styles.select}
            value={selectedPartner}
            onChange={(e) => setSelectedPartner(e.target.value)}
          >
            <option value="">Select a partner</option>
            {deliveryPartners.map((partner) => (
              <option key={partner._id} value={partner.runner_id}>
                {partner.runner_id} - {partner.runner_mobile_no}
              </option>
            ))}
          </select>
        </div>
        <div style={styles.modalFooter}>
          <Button onAdd={handleAssign} disabled={!selectedPartner} Title={"Assign"} />
          <button style={styles.button} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
// CSS-in-JS styles for the modal
const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    width: '400px',
    maxWidth: '80%',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    flexDirection: 'column',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
  },
  modalTitle: {
    margin: 0,
  },
  closeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
  },
  modalBody: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  modalFooter: {
    padding: '10px',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginLeft: '10px',
    padding: '10px 20px',
    backgroundColor: "#d1d1d1",
    color: 'black',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  select: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
};

export default AssignDeliveryPartnerModal;
