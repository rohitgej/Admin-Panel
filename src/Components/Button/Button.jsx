
import React from 'react'


function Button({Title, onAdd}) {
  return (
    <div>
      <button   style={styles.button} onClick={onAdd}>{Title}</button>
    </div>
  )
}

const styles={
    button:{
      backgroundColor: "#585ce4",
      color: "#fff",
      fontSize: "14px", 
      borderStyle:"none",
      padding: "10px 20px",
      borderRadius: "5px",
      cursor: "pointer",
    }
}

export default Button
