import React, { useState, useEffect } from "react";
import "./CardWithDropdown.css";
import { MdExpandMore, MdExpandLess } from "react-icons/md";

import NewItemModal from "../modals/NewItemModal/NewItemModal";
import DOMAIN_NAME from "../../Config/Config";
import { MdEdit} from 'react-icons/md';

function CardWithDropdown({
  id,
  imageUrl,
  dressName,
  categories,
  weight,
  laundryTypes = [],
  laundryTypesMap, // Receive laundryTypesMap as a prop
  onDeleteCard,
  refreshPage 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState({
    imageUrl,
    title: dressName,
    weight,
  });

  const laundryTypeState=(laundryTypes);
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    // Fetch categories from the API
    fetch(`${DOMAIN_NAME}api/viewcategory`)
      .then((response) => response.json())
      .then((result) => {
        if (result && result.categories) {
          setCategoryList(result.categories);
        }
      })
      .catch((error) => console.error(error));
  }, []);

  const refresh=()=>{
    refreshPage();
  }


  const handleDelete = () => {
    // Retrieve the token from local storage
    const isConfirmed = window.confirm("Are you sure you want to delete this item?");

    if(isConfirmed){
    const token = localStorage.getItem('token'); // Adjust based on your storage method
  
    // Create headers with authorization token
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    if (token) {
      myHeaders.append("Authorization", `Bearer ${token}`);
    }
  
    // Prepare the request body
    const raw = JSON.stringify({ _id: id });
  
    // Set request options
    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
  
    // Perform the fetch request
    fetch(`${DOMAIN_NAME}api/deleteitem`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        // Optionally, you can add logic to update the UI or notify the user
        onDeleteCard(); // Call the onDeleteCard function passed as a prop
      })
      .catch((error) => console.error(error));
    }
  };
  

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSave = (updatedItem) => {
    setSelectedItem(updatedItem);
    console.log(updatedItem);

    setIsModalOpen(false);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="card-container">
      <div className="card-content">
        <div className="card-info">
          <img
            src={selectedItem.imageUrl}
            alt={selectedItem.title}
            className="card-image"
          />
          <h3 className="dress-name">{selectedItem.title}</h3>
        </div>
        <p className="categories">{categories}</p>
        <div className="details">{selectedItem.weight} grm</div>
        <div className="button-sec">
          <MdEdit className="icon" onClick={() => setIsModalOpen(true)} title="Edit" />
          <div className="dropdown-arrow" onClick={toggleExpand}>
            {isExpanded ? <MdExpandLess /> : <MdExpandMore />}
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="dropdown-content">
          {laundryTypeState.map((type, index) => (
            <div className="listSec" key={index}>
              <div className="laundry-typeSec">
                <h4>{laundryTypesMap[type.id] || type.id}</h4>
              </div>
              <div className="laundry-priceSec">
                <h4>{type.price}</h4>
              </div>
            </div>
          ))}
        </div>
      )}

      <NewItemModal
        id={id}
        show={isModalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        onDelete={handleDelete}
        initialData={selectedItem}
        categories={categoryList.map((category) => category.category_name)} // Example categories
        refreshPage={refresh} // Example function to refresh the page or fetch new data when a save is made in the modal. This is just a placeholder. You can replace it with your own logic.
      />
    </div>
  );
}

export default CardWithDropdown;
