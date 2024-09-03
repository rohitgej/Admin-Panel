import React, { useState, useEffect } from 'react';
import Button from '../../Components/Button/Button';
import EditCategoryModal from '../../Components/modals/EditCategoryModal/EditCategoryModal';
import CategoryCard from '../../Components/CategoryCard/CategoryCard';
import DOMAIN_NAME from '../../Config/Config';
import AddCategoriesModal from '../../Components/modals/AddCategoriesModal/AddCategoriesModal';


function AddCategories() {
  const [showModal, setShowModal] = useState(false);
  const [AddshowModal, setAddShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [CategoryItem, setCategoryItems] = useState([]);

  const token = localStorage.getItem('token');
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${DOMAIN_NAME}api/viewcategory`);
        const result = await response.json();
        if (result.categories) {
          setCategoryItems(result.categories.map((type) => ({
            id: type._id,
            title: type.category_name,
          })));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleDelete = async (id) => {

    const isConfirmed = window.confirm("Are you sure you want to delete this categories type?");

    if(isConfirmed){
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`); // Add Authorization header

      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        body: JSON.stringify({ "_id": id }),
        redirect: "follow"
      };

      const response = await fetch(`${DOMAIN_NAME}api/deletecategory`, requestOptions);
      if (response.ok) {
        setCategoryItems(CategoryItem.filter(item => item.id !== id));
        console.log("Category deleted successfully");
      } else {
        console.error("Error deleting category:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  }
  };

  const handleAdd = () => {
    setSelectedItem(null); // Ensure selectedItem is cleared for adding new items
    setAddShowModal(true);
  };

  const handleSave = (newItem) => {
    if (selectedItem) {
      // Update existing item
      setCategoryItems(CategoryItem.map(item =>
        item.id === selectedItem.id ? { ...item, ...newItem } : item
      ));
    } else {
      // Add new item
      setCategoryItems([...CategoryItem, newItem]);
    }

    setSelectedItem(null);
    setAddShowModal(false);
    setShowModal(false); // Close any open modals
  };

  return (
    <div style={styles.mainContainer}>
      <div style={styles.buttonSec}>
        <h2 style={styles.header}>Categories</h2>
        <Button onAdd={handleAdd} Title="Add Categories" />
      </div>
      {AddshowModal && (
        <AddCategoriesModal
          show={AddshowModal}
          onClose={() => setAddShowModal(false)}
          onSave={handleSave}
        />
      )}
      {CategoryItem.map(item => (
        <CategoryCard
          key={item.id}
          title={item.title}
          onEdit={() => handleEdit(item)}
          onDelete={() => handleDelete(item.id)}
        />
      ))}
      {showModal && (
        <EditCategoryModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          initialData={selectedItem}
        />
      )}
    </div>
  );
}

const styles = {
  mainContainer: {
    height: '100vh',
    overflowY: 'auto',
    padding: '20px',
    paddingBottom: '80px',
    background:"#fff"
  },
  buttonSec: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItem:"center",
    marginBottom: '20px',
  },
  header:{
    textDecoration: "underline"
  },
};

export default AddCategories;
