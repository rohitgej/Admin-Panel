import React, { useState, useEffect } from 'react';
import TimeSlotModal from '../../Components/modals/TimeSlotModal/TimeSlotModal';
import TimeSlotList from '../../Components/TimeSlotList/TimeSlotList';
import Button from '../../Components/Button/Button'; // Assuming you have a Button component
import DOMAIN_NAME from '../../Config/Config';


const TimeSlot = () => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [editTimeSlot, setEditTimeSlot] = useState(null);

  useEffect(() => {
      fetchTimeSlots();
  }, []);

  const fetchTimeSlots = async () => {
      try {
          const response = await fetch(`${DOMAIN_NAME}api/getTimeslot`, {
              method: "GET",
              redirect: "follow"
          });
          if (response.ok) {
              const data = await response.json();
              setTimeSlots(data);
          } else {
              console.error("Failed to fetch time slots:", response.statusText);
          }
      } catch (error) {
          console.error("Error fetching time slots:", error);
      }
  };

  const handleAddClick = () => {
      setEditTimeSlot(null);
      setIsModalOpen(true);
  };

  const handleEditClick = (timeSlot) => {
      setEditTimeSlot(timeSlot);
      setIsModalOpen(true);
  };

  const handleModalSave = (timeSlot) => {
      if (timeSlot._id) {
          handleUpdateTimeSlot(timeSlot);
      } else {
          handleAddTimeSlot(timeSlot);
      }
     
  };

  const handleUpdateTimeSlot = async (timeSlot) => {
    // Retrieve the token from local storage
    const token = localStorage.getItem('token'); // Adjust the key based on how you store the token

    const requestOptions = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Include the token in the Authorization header
        },
        body: JSON.stringify(timeSlot),
        redirect: "follow",
    };

    try {
        const response = await fetch(`${DOMAIN_NAME}api/updateTimeslot`, requestOptions);
        const result = await response.text();
        console.log("Update response:", result);
        fetchTimeSlots(); // Refresh the list of time slots after update
    } catch (error) {
        console.error("Error updating time slot:", error);
    }
};


const handleAddTimeSlot = async (timeSlot) => {
    // Retrieve the token from local storage
    const token = localStorage.getItem('token'); // Adjust the key based on how you store the token

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Include the token in the Authorization header
        },
        body: JSON.stringify(timeSlot),
        redirect: "follow",
    };

    try {
        const response = await fetch(`${DOMAIN_NAME}api/addTimeslot`, requestOptions);
        const result = await response.text();
        console.log("Add response:", result);
        fetchTimeSlots(); // Refresh the list of time slots after adding
    } catch (error) {
        console.error("Error adding time slot:", error);
    }
};

  const handleDeleteTimeSlot = async (timeSlotId) => {
    // Retrieve the token from local storage
    const token = localStorage.getItem('token'); // Adjust the key based on how you store the token

    const requestOptions = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Include the token in the Authorization header
        },
        body: JSON.stringify({ _id: timeSlotId }),
        redirect: "follow",
    };

    try {
        const response = await fetch(`${DOMAIN_NAME}api/deletetimeslot`, requestOptions);
        const result = await response.text();
        console.log("Delete response:", result);
        fetchTimeSlots(); // Refresh the list of time slots after deletion
    } catch (error) {
        console.error("Error deleting time slot:", error);
    }
};


  const handleDeleteClick = (timeSlotId) => {
      handleDeleteTimeSlot(timeSlotId);
  };

  return (
      <div style={styles.mainConatin}>
          <h1>Time Slot Management</h1>
          <Button onAdd={handleAddClick} Title={"Add Time Slot"}/>
          <div style={styles.container}>
          <div style={styles.sec2}>
          {isModalOpen && (
              <TimeSlotModal 
                  timeSlot={editTimeSlot} 
                  onSave={handleModalSave} 
                  onClose={() => setIsModalOpen(true)} 
              />
          )}
          </div>
            <div style={styles.sec1}>
          <TimeSlotList 
              timeSlots={timeSlots} 
              onEditClick={handleEditClick} 
              onDeleteClick={handleDeleteClick}   
          /></div>
        
          </div>
      </div>
  );
};

const styles={
    mainConatin:{
backgroundColor:"#fff",
padding:"20px"
    },
  container: {
    width: "100%",
    
    margin: "0 auto",
    justifyContent: "center",
    alignItems: "center",
    display:"flex",
    padding: 20,
    
  },
  sec1:{
    padding: 20,
    width: "50%",
    height:"50vh",
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 20,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)"

  },
  sec2:{
    padding: 20,
    width: "50%",
    height:"50vh",
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 20,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)"
  }
}

export default TimeSlot;
