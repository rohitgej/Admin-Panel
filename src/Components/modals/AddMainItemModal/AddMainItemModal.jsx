import React, { useState, useEffect } from "react";
import "../AddMainItemModal/AddMainItemModal.css";
import Button from "../../Button/Button";
import DOMAIN_NAME from "../../../Config/Config";

function AddMainItemModal({ show, onClose, onSave, initialData }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null); // To store the selected file
  const [title, setTitle] = useState("");
  const [weight, setWeight] = useState("");
  const [price, setPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); // Category ID from the API
  const [selectedLaundry, setSelectedLaundry] = useState(""); // Laundry Type ID from the API
  const [categories, setCategories] = useState([]); // State to store categories from the API
  const [laundryTypes, setLaundryTypes] = useState([]); // State to store laundry types from the API
  const [savedItems, setSavedItems] = useState([]); // State to store saved laundry types with prices

  const [selectedLaundryName, setSelectedLaundryName] = useState(null);

  useEffect(() => {
    // Fetch categories from the API
    fetch(`${DOMAIN_NAME}api/viewcategory`)
      .then((response) => response.json())
      .then((data) => setCategories(data.categories))
      .catch((error) => console.error("Error fetching categories:", error));

    // Fetch laundry types from the API
    fetch(`${DOMAIN_NAME}api/viewlaundrytype`)
      .then((response) => response.json())
      .then((data) => setLaundryTypes(data.laundrytypes))
      .catch((error) => console.error("Error fetching laundry types:", error));
  }, []); // Empty dependency array to run only on component mount

  if (!show) {
    return null;
  }

  const handleChange = (e) => {
    const selectedKey = e.target.value;
    setSelectedCategory(selectedKey); // Update the selected category state
  };

  const handleChangeLaundry = (e) => {
    const selectedKey = e.target.value;
    const selectedValue = e.target.options[e.target.selectedIndex].text;
    setSelectedLaundryName(selectedValue);
    setSelectedLaundry(selectedKey); // Update the selected laundry state
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Store the file for later use in form submission
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result); // Base64 URL of the image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    // Validation checks
    if (!title || !weight || !selectedCategory || savedItems.length === 0 || !imageFile) {
      alert("Please fill all the fields and add at least one laundry type before saving.");
      return;
    }
  
    const formdata = new FormData();
    formdata.append("item_name", title);
    if (imageFile) {
      formdata.append("item_image", imageFile); // Ensure imageFile is a File object
    }
    formdata.append("category_id", selectedCategory); // Pass the selected category ID
    formdata.append("item_weight", weight);
  
    // Convert savedItems to the format needed for the backend
    const laundryTypePrices = savedItems.map((item) => ({
      id: item.laundryTypeId, // Pass the laundry type ID
      price: item.price,
    }));
  
    formdata.append("id_laundrytype", JSON.stringify(laundryTypePrices));
  
    // Create headers including Authorization
    const myHeaders = new Headers();
    const token = localStorage.getItem('token')
    myHeaders.append("Authorization", `Bearer ${token}`);
  
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow"
    };
  
    try {
      const response = await fetch(`${DOMAIN_NAME}api/additem`, requestOptions);
      const result = await response.json();
      alert(result.message);
      onClose(); // Call onClose or handle UI changes as needed
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };
  

  const handleAddLaundryType = () => {
    if (!selectedLaundry || !price) {
      alert("Please select a laundry type and enter a price.");
      return;
    }
    
    const newItem = {
      laundryTypeId: selectedLaundry, // Store the selected laundry type ID
      laundryTypeName: selectedLaundryName, // Store the selected laundry type name
      price: parseFloat(price),
    };
    setSavedItems([...savedItems, newItem]);
    setSelectedLaundry("");
    setSelectedLaundryName(""); // Clear the selected laundry name
    setPrice("");
  };

  const handleDelete = (index) => {
    const updatedItems = savedItems.filter((_, i) => i !== index);
    setSavedItems(updatedItems); // Update the savedItems array
  };

  return (
    <div className="amodal-overlay">
      <div className="amodal-content">
        <div className="atitleSec">
          <h2>Add New Item</h2>
        </div>

        <div className="abodySec">
          <div className="aSec1">
            <div className="aSecDiv1">
              <img
                className="aproduct-img"
                alt="product img"
                src={imageUrl || "https://placehold.co/100x100"} // Show a default image if no image is selected
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ marginTop: "10px" }}
              />
            </div>

            <div className="aSecDiv2">
              <label>
                Title:
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>
              <div className="aWeightSec">
                <div>Weight (in grams):</div>
                <div>
                  <input
                    required
                    className="aWeightSecInput"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
              </div>
              <label>
                Category:
                <br />
                <select
                  className="aSelectSec"
                  value={selectedCategory}
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category._id}>
                      {category.category_name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <hr />
          <div className="aform-group">
            <label>
              Laundry Type:
              <br />
              <select
                className="aSelectSec"
                value={selectedLaundry}
                onChange={handleChangeLaundry}
              >
                <option value="">Select Laundry</option>
                {laundryTypes.map((laundryType) => (
                  <option key={laundryType.id} value={laundryType._id}>
                    {laundryType.Laundrytype_name}
                  </option>
                ))}
              </select>
            </label>

            <div className="aPriceSec">
              <div>Price:</div>
              <input
                className="apriceInput"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)} // Correctly bind price state
              />
            </div>
            <div className="laundrySave">
              <Button Title="Add Laundry Type" onAdd={handleAddLaundryType} />
            </div>
          </div>
          <hr />
          <div className="saved-items-section">
            {savedItems.length > 0 && (
              <div>
                <h3>Saved Laundry Types</h3>
                <ul>
                  {savedItems.map((item, index) => (
                    <li key={index}>
                      <div className="aitemsSec">
                        <p>{item.laundryTypeName}</p> {/* Display the name */}
                        <p>Price: ${item.price.toFixed(2)}</p>
                        <Button
                          Title="Delete"
                          onAdd={() => handleDelete(index)} // Pass the index to the delete function
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="amodal-actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default AddMainItemModal;
