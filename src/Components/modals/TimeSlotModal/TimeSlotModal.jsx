import React, { useState, useEffect } from 'react';

const TimeSlotModal = ({ timeSlot, onSave, onClose }) => {
    const [Timeslot_name, setTimeslot_name] = useState('');
    const [Timeslot, setTimeslot] = useState('');

    useEffect(() => {
        if (timeSlot) {
            setTimeslot_name(timeSlot.Timeslot_name);
            setTimeslot(timeSlot.Timeslot);
        } else {
            setTimeslot_name('');
            setTimeslot('');
        }
    }, [timeSlot]);

    const handleSaveClick = () => {
        const updatedTimeSlot = {
            ...timeSlot,
            Timeslot_name,
            Timeslot,
        };
        onSave(updatedTimeSlot);
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>{timeSlot ? 'Edit Time Slot' : 'Add Time Slot'}</h2>
                <input
                    type="text"
                    value={Timeslot_name}
                    onChange={(e) => setTimeslot_name(e.target.value)}
                    placeholder="Timeslot Name"
                />
                <input
                    type="text"
                    value={Timeslot}
                    onChange={(e) => setTimeslot(e.target.value)}
                    placeholder="Timeslot Range"
                />
                <button style={styles.button} onClick={handleSaveClick}>Save</button>
              
            </div>
        </div>
    );
};

const styles={
    button: {
        backgroundColor: '#585ce4',
        color: 'white',
        padding: '10px 20px',
        margin: '8px 0',
        borderRadius: '4px',
        cursor: 'pointer',
        width: '100%',
    },
}
export default TimeSlotModal;
