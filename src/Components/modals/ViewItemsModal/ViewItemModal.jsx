import React, { useEffect, useState } from "react";
import "../ViewItemsModal/ViewItemModal.css";
import { IoIosCloseCircleOutline } from "react-icons/io";

const ViewItemModal = ({ isOpen, onClose, items, orders }) => {
  const [laundryTypes, setLaundryTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [itemDetails, setItemDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLaundryTypes = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/viewlaundrytype"
        );
        const result = await response.json();
        setLaundryTypes(result.laundrytypes);
      } catch (error) {
        console.error("Error fetching laundry types:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/viewcategory", {
          method: "GET",
        });
        const result = await response.json();
        setCategories(result.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchItemDetails = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/viewitem", {
          method: "POST",
        });
        const result = await response.json();
        const itemDetailsMap = result.item.reduce((map, item) => {
          map[item._id] = item.item_name;
          return map;
        }, {});
        setItemDetails(itemDetailsMap);
      } catch (error) {
        console.error("Error fetching item details:", error);
      }
    };

    fetchLaundryTypes();
    fetchCategories();
    fetchItemDetails();
    setLoading(false);
  }, []);

  const getLaundryTypeName = (id) => {
    const laundryType = laundryTypes.find((type) => type._id === id);
    return laundryType ? laundryType.Laundrytype_name : "Unknown";
  };

  const getCategoryName = (id) => {
    const category = categories.find((cat) => cat._id === id);
    return category ? category.category_name : "Unknown";
  };

  const getItemName = (id) => {
    return itemDetails[id] || "Unknown";
  };

  if (!isOpen || !items || loading) return null;

  return (
    <div className="modal-overlay">
      <div className="imodal-content invoice-style">
       
        <IoIosCloseCircleOutline className="modal-close" style={{cursor: "pointer"}}  onClick={onClose} />
      
       
        <h2>Item Details</h2>
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Category</th>
              <th>Laundry Types</th>
              <th>Quantity</th>
              <th>Weight</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{getItemName(item.item_id)}</td>
                <td>{getCategoryName(item.category_id)}</td>
                <td>{getLaundryTypeName(item.id_laundrytype)}</td>
                <td>{item.quantity} pcs</td>
                <td>{item.weight}grm</td>
                <td>{item.price}</td>
              </tr>
            ))}
          </tbody>
          <div className="modal-footer">
          <h4>Total Price: {orders.total}</h4>
  
      </div>
        </table>
      
    </div>
    </div>
  );
};

export default ViewItemModal;
