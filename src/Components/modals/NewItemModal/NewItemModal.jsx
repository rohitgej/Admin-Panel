import React, { useState, useEffect } from "react";
import "../NewItemModal/NewItemModal.css";
import Button from "../../Button/Button";
import DOMAIN_NAME from "../../../Config/Config";

function AddMainItemModal({ show, onClose, onDelete, id, refreshPage }) {
  const [laundryTypes, setLaundryTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [itemData, setItemData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [savedLaundryTypes, setSavedLaundryTypes] = useState([]);
  const [selectedLaundryType, setSelectedLaundryType] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [laundryTypeMap, setLaundryTypeMap] = useState({});
  const [itemName, setItemName] = useState("");
  const [itemWeight, setItemWeight] = useState("");
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    const fetchLaundryTypes = async () => {
      try {
        const response = await fetch(`${DOMAIN_NAME}api/viewlaundrytype`);
        const data = await response.json();
        setLaundryTypes(data.laundrytypes);

        const map = {};
        data.laundrytypes.forEach((type) => {
          map[type._id] = type.Laundrytype_name;
        });
        setLaundryTypeMap(map);
      } catch (error) {
        console.error("Error fetching laundry types:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(`${DOMAIN_NAME}api/viewcategory`);
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchItemData = async () => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({ _id: id }),
        redirect: "follow",
      };

      try {
        const response = await fetch(`${DOMAIN_NAME}api/viewitem`, requestOptions);
        const data = await response.json();
        setItemData(data);
        setItemName(data.item.item_name);
        setItemWeight(data.item.item_weight);
        setCategoryId(data.item.category_id);
        setSavedLaundryTypes(data.item.id_laundrytype);
      } catch (error) {
        console.error("Error fetching item data:", error);
      }
    };

    if (id) {
      fetchLaundryTypes();
      fetchCategories();
      fetchItemData();
    }
  }, [id]);

  if (!show) {
    return null;
  }

  const handleDelete = () => {
    onDelete();
    onClose();
    refreshPage();
  };

  const handleLaundryDelete = (laundryId) => {
    setSavedLaundryTypes((prevLaundryTypes) =>
      prevLaundryTypes.filter((laundry) => laundry._id !== laundryId)
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setItemData((prevData) => ({
        ...prevData,
        item: {
          ...prevData.item,
          item_image: imageURL,
        },
      }));
    }
  };

  const handleAddLaundryType = () => {
    if (selectedLaundryType && selectedPrice) {
      const newLaundryType = {
        id: selectedLaundryType,
        price: selectedPrice,
      };

      const isAlreadyAdded = savedLaundryTypes.some(
        (laundry) => laundry._id === selectedLaundryType
      );

      if (!isAlreadyAdded) {
        setSavedLaundryTypes((prevLaundryTypes) => [...prevLaundryTypes, newLaundryType]);
      } else {
        alert("Laundry type already added.");
      }

      setSelectedLaundryType("");
      setSelectedPrice("");
    }
  };

  const handleSave = async () => {
    // Create headers with authorization token
    const myHeaders = new Headers();
    const token= localStorage.getItem('token')
    myHeaders.append("Authorization", `Bearer ${token}`);
  
    // Prepare form data
    const formdata = new FormData();
    formdata.append("_id", id);
    formdata.append("item_name", itemName);
    if (selectedImage) {
      formdata.append("item_image", selectedImage);
    }
    formdata.append("category_id", categoryId);
    formdata.append("item_weight", itemWeight);
    formdata.append("id_laundrytype", JSON.stringify(savedLaundryTypes));
  
    // Set request options
    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };
  
    try {
      const response = await fetch(`${DOMAIN_NAME}api/updateitem`, requestOptions);
      const result = await response.json();
      alert(result.message);
      onClose(); // Close modal after saving
      refreshPage();
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <div className="nmodal-overlay">
      <div className="nmodal-content">
        <div className="ntitleSec">
          <h2>Add New Item</h2>
        </div>

        <div className="nbodySec">
          <div className="nSec1">
            <div className="nSecDiv1">
              <img
                className="nproduct-img"
                alt="product img"
                src={itemData ? itemData.item.item_image : "https://placehold.co/100x100"}
              />
              <input
                type="file"
                accept="image/*"
                style={{ marginTop: "10px" }}
                onChange={handleFileChange}
              />
            </div>

            <div className="nSecDiv2">
              <label>
                Title:
                <input
                  required
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
              </label>
              <div className="nWeightSec">
                <div>Weight (in grams):</div>
                <div>
                  <input
                    required
                    className="nWeightSecInput"
                    type="number"
                    value={itemWeight}
                    onChange={(e) => setItemWeight(e.target.value)}
                  />
                </div>
              </div>
              <label>
                Category:
                <br />
                <select
                  className="nSelectSec"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.category_name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <hr />
          <div className="nform-group">
            <label>
              Laundry Type:
              <br />
              <select
                className="nSelectSec"
                value={selectedLaundryType}
                onChange={(e) => setSelectedLaundryType(e.target.value)}
              >
                <option value="">Select Laundry</option>
                {laundryTypes.map((type) => (
                  <option key={type._id} value={type._id}>
                    {type.Laundrytype_name}
                  </option>
                ))}
              </select>
            </label>

            <div className="nPriceSec">
              <div>Price:</div>
              <input
                className="npriceInput"
                type="number"
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
              />
            </div>
            <div className="laundrySave">
              <Button Title="Add Laundry Type" onAdd={handleAddLaundryType} />
            </div>
          </div>
          <hr />
          <div className="saved-items-section">
            <h3>Saved Laundry Types</h3>
            <ul>
              {savedLaundryTypes.map((laundry) => (
                <li key={laundry._id}>
                  <div className="nitemsSec">
                    <p>{laundryTypeMap[laundry.id] || "Unknown Laundry Type"}</p>
                    <p>Price: ${laundry.price}</p>
                    <Button onAdd={() => handleLaundryDelete(laundry._id)} Title="Delete" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="nmodal-actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={handleDelete}>Delete</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default AddMainItemModal;
