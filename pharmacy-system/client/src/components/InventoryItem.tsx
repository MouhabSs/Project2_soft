import React from 'react';
import axios from 'axios';

interface Medication {
  _id: string;
  name: string; // Assuming Medication has a name field for display
  // Add other relevant Medication fields if needed
}

interface InventoryItemProps {
  item: {
    _id: string;
    medication: Medication; // Populated Medication object
    quantity: number;
    expiryDate?: string;
    batchNumber?: string;
  };
  onRemoveSuccess: () => void; // Callback to refresh the list
}

const InventoryItem: React.FC<InventoryItemProps> = ({ item, onRemoveSuccess }) => {
  const handleRemove = async () => {
    if (window.confirm('Are you sure you want to remove this inventory item?')) {
      try {
        await axios.delete(`http://localhost:5001/api/inventory/${item._id}`);
        console.log('Inventory item removed successfully');
        onRemoveSuccess(); // Refresh list after removal
      } catch (error) {
        console.error('Failed to remove inventory item:', error);
        alert('Failed to remove inventory item. Please try again.');
      }
    }
  };

  // Format expiry date if it exists
  const formattedExpiryDate = item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'N/A';

  return (
    <tr>
      <td>{item.medication?.name || item.medication?._id || 'N/A'}</td>{/* Display medication name, or ID if name missing, or N/A */}
      <td>{item.quantity}</td>
      <td>{formattedExpiryDate}</td>
      <td>{item.batchNumber || 'N/A'}</td>
      <td>
        <button onClick={handleRemove}>Remove</button>
      </td>
    </tr>
  );
};

export default InventoryItem; 