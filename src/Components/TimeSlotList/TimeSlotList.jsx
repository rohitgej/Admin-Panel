import React from 'react';
import "../TimeSlotList/TimeSlotList.css"
const TimeSlotList = ({ timeSlots, onEditClick, onDeleteClick }) => {
    return (
        <div>
            {timeSlots.length === 0 ? (
                <p>No time slots available</p>
            ) : (
                <ul className='lists'>
                    {timeSlots.map((timeSlot) => (
                        <li key={timeSlot._id} className='list'>
                            <strong className='listItem'>{timeSlot.Timeslot_name}:</strong> 
                            <div className='listItem'>{timeSlot.Timeslot}</div>
                            <button onClick={() => onEditClick(timeSlot)}>Edit</button>
                            <button onClick={() => onDeleteClick(timeSlot._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};



export default TimeSlotList;
