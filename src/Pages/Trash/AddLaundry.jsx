import React, { useState, useEffect } from 'react';
import ListCard from '../../Components/card/ListCard';
import Button from '../../Components/button/Button';
import EditModal from '../../Components/modals/EditModal/EditModal';
import AddLaundryModal from '../../Components/modals/AddLaundryModal/AddLaundryModal';
import DOMAIN_NAME from '../../Config/Config';

function AddLaundry() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [laundryItems, setLaundryItems] = useState([]);

  useEffect(() => {
    const fetchLaundryTypes = async () => {
      try {
        const response = await fetch(`${DOMAIN_NAME}api/viewlaundrytype`);
        const result = await response.json();
        if (result.laundrytypes) {
          setLaundryItems(result.laundrytypes.map((type) => ({
            id: type._id,
            imageUrl: type.Laundrytype_image,
            title: type.Laundrytype_name,
          })));
        }
      } catch (error) {
        console.error("Error fetching laundry types:", error);
      }
    };
    fetchLaundryTypes();
  }, []);

  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${DOMAIN_NAME}api/deletelaundrytype`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "_id": id })
      });

      if (response.ok) {
        setLaundryItems(laundryItems.filter(item => item.id !== id));
      } else {
        console.error("Error deleting laundry type:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting laundry type:", error);
    }
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setShowAddModal(true);
  };

  const handleSave = (newItem) => {
    if (selectedItem) {
      // Update existing item
      setLaundryItems(laundryItems.map(item =>
        item.id === selectedItem.id ? { ...item, ...newItem } : item
      ));
    } else {
      // Add new item
      setLaundryItems([...laundryItems, newItem]);
    }
    setShowEditModal(false);
    setShowAddModal(false);
  };
  

  return (
    <div style={styles.container}>
      <div style={styles.buttonSec}>
        <Button onAdd={handleAdd} Title="Add Laundry" />
      </div>
      {showAddModal && (
        <AddLaundryModal
          show={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleSave}
        />
      )}
      {laundryItems.map(item => (
        <ListCard
          key={item.id}
          imageUrl={item.imageUrl}
          title={item.title}
          onEdit={() => handleEdit(item)}
          onDelete={() => handleDelete(item.id)}
        />
      ))}
      {showEditModal && selectedItem && (
        <EditModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleSave}
          initialData={selectedItem}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    overflowY: 'auto',
    padding: '20px',
    paddingBottom: '80px'
  },
  buttonSec: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '20px',
  },
};

export default AddLaundry;
