import React, { useState, useEffect } from 'react';
import CardWithDropdown from '../../Components/CardWithDropdown/CardWithDropdown';
import Button from '../../Components/button/Button';
import AddMainItemModal from '../../Components/modals/AddMainItemModal/AddMainItemModal';

function AddItems() {
  const [show, setShow] = useState(false);
  const [laundryItems, setLaundryItems] = useState([]);
  const [categories, setCategories] = useState({});

  const handleAddMain = () => {
    setShow(true);
  };

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const requestOptions = {
          method: "GET",
          redirect: "follow"
        };

        const response = await fetch("http://localhost:3000/api/viewcategory", requestOptions);
        const result = await response.json();

        // Transform the fetched data into a key-value pair object
        const categoriesMap = result.categories.reduce((acc, category) => {
          acc[category._id] = category.category_name; // Assuming category_name is the name of the category
          return acc;
        }, {});

        setCategories(categoriesMap);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch items from API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const requestOptions = {
          method: "GET",
          redirect: "follow"
        };

        const response = await fetch("http://localhost:3000/api/viewitem", requestOptions);
        const result = await response.json();

        // Transform the fetched data to match the expected structure
        const transformedItems = result.item.map(item => ({
          id: item._id,
          imageUrl: item.item_image,
          dressName: item.item_name,
          categories: categories[item.category_id], // Use category name from categories state
          weight: item.item_weight,
          laundryTypes: item.id_laundrytype.map(type => ({
            id: type.id,
            price: `$${type.price}`
          }))
        }));

        setLaundryItems(transformedItems);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    if (Object.keys(categories).length > 0) {
      fetchItems(); // Fetch items only after categories have been fetched
    }
  }, [categories]); // Re-fetch items when categories are updated

  return (
    <div>
      <div style={styles.buttonSec}>
        <Button onAdd={handleAddMain} Title="Add New Item" />
      </div>
      {show && <AddMainItemModal show={show} onClose={() => setShow(false)} />}
      
      <div style={styles.scrollableContainer}> 
        {laundryItems.map(item => (
          <CardWithDropdown
            key={item.id}
            imageUrl={item.imageUrl}
            dressName={item.dressName}
            categories={item.categories}
            weight={item.weight}
            laundryTypes={item.id_laundrytype}
          />
        ))}
      </div>
    </div>
  );
}

const styles = {
  buttonSec: {
    display: 'flex',  
    justifyContent: 'flex-end',
    marginBottom: '20px',
  },
  scrollableContainer: {
    height: '100vh', // Set a fixed height
    overflowY: 'scroll', // Enable vertical scrolling
    paddingRight: '10px', // Optional: Add some padding to avoid cutting off the scrollbar
    paddingBottom:"50px"
  },
};

export default AddItems;
