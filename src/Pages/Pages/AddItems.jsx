import React, { useState, useEffect } from 'react';
import CardWithDropdown from '../../Components/CardWithDropdown/CardWithDropdown';
import Button from '../../Components/Button/Button';
import AddMainItemModal from '../../Components/modals/AddMainItemModal/AddMainItemModal';
import DOMAIN_NAME from '../../Config/Config';

function AddItems() {
  const [show, setShow] = useState(false);
  const [laundryItems, setLaundryItems] = useState([]);
  const [categories, setCategories] = useState({});
  const [laundryTypesMap, setLaundryTypesMap] = useState({});

  const handleAddMain = () => {
    setShow(true);
  };

  const onUpdateItem = async (updatedItem) => {
    const formdata = new FormData();
    formdata.append("_id", updatedItem.id);
    formdata.append("item_name", updatedItem.title);
    formdata.append("item_image", updatedItem.imageUrl);  // Assuming this is a URL, change this if you have a file input
    formdata.append("category_id", Object.keys(categories).find(key => categories[key] === updatedItem.category));
    formdata.append("item_weight", updatedItem.weight);
    formdata.append("id_laundrytype", JSON.stringify(updatedItem.laundryTypes));

    const requestOptions = {
      method: "PUT",
      body: formdata,
      redirect: "follow"
    };

    try {
      const response = await fetch(`${DOMAIN_NAME}api/updateitem`, requestOptions);
      const result = await response.json();
      console.log("Update success:", result);
      
      // Optionally refresh items or update the state directly to reflect changes
      window.location.reload();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const requestOptions = {
          method: "GET",
          redirect: "follow"
        };

        const response = await fetch(`${DOMAIN_NAME}api/viewcategory`, requestOptions);
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
  
  const refreshPage = () => {
    // This function could trigger a re-fetch of data or simply reload the page
    window.location.reload(); // Reloads the entire page
    // or
    // fetchItems(); // Re-fetch the items from the API
  };

  // Fetch laundry types from API
  useEffect(() => {
    const fetchLaundryTypes = async () => {
      try {
        const requestOptions = {
          method: "GET",
          redirect: "follow"
        };

        const response = await fetch(`${DOMAIN_NAME}api/viewlaundrytype`, requestOptions);
        const result = await response.json();

        const laundryTypesMap = result.laundrytypes.reduce((acc, type) => {
          acc[type._id] = type.Laundrytype_name;
          return acc;
        }, {});

        setLaundryTypesMap(laundryTypesMap);
      } catch (error) {
        console.error("Error fetching laundry types:", error);
      }
    };

    fetchLaundryTypes();
  }, []);

  // Fetch items from API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const requestOptions = {
          method: "POST",
          redirect: "follow"
        };

        const response = await fetch(`${DOMAIN_NAME}api/viewitem`, requestOptions);
        const result = await response.json();

        // Transform the fetched data to match the expected structure
        const transformedItems = result.item.map(item => ({
          id: item._id,
          imageUrl: item.item_image,
          dressName: item.item_name,
          categories: categories[item.category_id], // Use category name from categories state
          weight: item.item_weight,
          laundryTypes: item.id_laundrytype
        }));

        setLaundryItems(transformedItems);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    if (Object.keys(categories).length > 0) {
      fetchItems();
    }
  }, [categories]);

  // Refresh the page after closing the modal
  const handleModalClose = () => {
    setShow(false);
    window.location.reload(); // Refresh the page
  };

  return (
    <div style={styles.mainConatainer}>
      <div style={styles.buttonSec}>
        <h2 style={styles.header}>Items</h2>
        <Button onAdd={handleAddMain} Title="Add New Item" />
      </div>
      {show && <AddMainItemModal show={show} onClose={handleModalClose} />}
      
      {/* Header row */}
      <div style={styles.headerRow}>
        <div style={styles.headerItem}>Items</div>
        <div style={styles.headerItemCategory}>Category</div>
        <div style={styles.headerItemWeight}>Weight</div>
      
      </div>
      
      <div style={styles.scrollableContainer}>
        {laundryItems.map(item => (
          <CardWithDropdown
            key={item.id}
            id={item.id}
            imageUrl={item.imageUrl}
            dressName={item.dressName}
            categories={item.categories}
            weight={item.weight}
            laundryTypes={item.laundryTypes}
            laundryTypesMap={laundryTypesMap}
            onUpdateItem={onUpdateItem}  // Pass the update function as a prop
            refreshPage={refreshPage}
          />
        ))}
      </div>
    </div>
  );
}

const styles = {
  mainConatainer:{
    backgroundColor:"#fff",
    padding:"20px"
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

  headerRow: {
    width:"100%",
    display: 'flex',
    padding: '10px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color:"#595959"
  },
  headerItem:{
    marginLeft:"2%",
  },
  headerItemCategory: {
   marginLeft:"36%",
  },
  headerItemWeight:{
    marginLeft:"24%",
  },
  scrollableContainer: {
    height: '100vh',
    overflowY: 'scroll',
    paddingRight: '10px',
    paddingBottom: "200px"
  },
};

export default AddItems;
