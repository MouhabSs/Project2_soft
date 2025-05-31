import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InventoryItem from '../components/InventoryItem';
import '../styles/Inventory.css'; // Import the CSS file

interface Medication {
  _id: string;
  name: string;
  fhirId?: string;
}

interface InventoryItem {
  _id: string;
  medication: Medication;
  quantity: number;
  expiryDate?: string;
  batchNumber?: string;
}

const InventoryPage: React.FC = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false); // State to toggle form visibility
  const [newInventoryItem, setNewInventoryItem] = useState({
    medicationId: '',
    quantity: '',
    expiryDate: '',
    batchNumber: '',
  });
  const [medications, setMedications] = useState<Medication[]>([]); // State to store medications for the dropdown

  useEffect(() => {
    fetchInventoryItems();
    fetchMedications(); // Fetch medications when the component mounts
  }, []);

  const fetchInventoryItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get<InventoryItem[]>('http://localhost:5001/api/inventory');
      setInventoryItems(response.data);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching inventory:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchMedications = async () => {
    try {
      const response = await axios.get<Medication[]>('http://localhost:5001/api/medications');
      setMedications(response.data);
    } catch (err) {
      console.error('Error fetching medications:', err);
      // Handle error fetching medications (e.g., show a message)
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setNewInventoryItem({ ...newInventoryItem, [name]: value });
  };

  const handleAddStock = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/inventory/add-stock', newInventoryItem);
      alert('Stock added successfully!');
      setShowAddForm(false);
      setNewInventoryItem({
        medicationId: '',
        quantity: '',
        expiryDate: '',
        batchNumber: '',
      });
      fetchInventoryItems(); // Refresh the inventory list
    } catch (error) {
      console.error('Failed to add stock:', error);
      alert('Failed to add stock. Please try again.');
    }
  };

  // Filter inventory items based on search term
  const filteredItems = inventoryItems.filter(item =>
    (item.medication?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    (item.batchNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
  );

  if (loading) {
    return <div>Loading inventory...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="inventory-page">
      <h2>Pharmacy Inventory</h2>

      {/* Add to Stock Button */}
      <button onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? 'Hide Add Form' : 'Add to Stock'}
      </button>

      {/* Add to Stock Form */}
      {showAddForm && (
        <form onSubmit={handleAddStock} className="add-stock-form">
          <h3>Add New Stock</h3>
          <label>
            Medication:
            <select name="medicationId" value={newInventoryItem.medicationId} onChange={handleInputChange} required>
              <option value="">Select a Medication</option>
              {medications.map(med => (
                <option key={med._id} value={med._id}>{med.name || med.fhirId || med._id}</option>
              ))}
            </select>
          </label>
          <label>
            Quantity:
            <input type="number" name="quantity" value={newInventoryItem.quantity} onChange={handleInputChange} required min="1" />
          </label>
          <label>
            Expiry Date:
            <input type="date" name="expiryDate" value={newInventoryItem.expiryDate} onChange={handleInputChange} />
          </label>
          <label>
            Batch Number:
            <input type="text" name="batchNumber" value={newInventoryItem.batchNumber} onChange={handleInputChange} />
          </label>
          <button type="submit">Add Stock</button>
        </form>
      )}

      {/* Search Input */}
      <div className="inventory-filter">
        <label htmlFor="search">Search:</label>
        <input
          type="text"
          id="search"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search medication or batch"
        />
      </div>

      {filteredItems.length === 0 ? (
        <p>{searchTerm ? 'No matching inventory items found.' : 'No inventory items found.'}</p>
      ) : (
        <div className="inventory-table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Medication</th>
                <th>Quantity</th>
                <th>Expiry Date</th>
                <th>Batch Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <InventoryItem key={item._id} item={item} onRemoveSuccess={fetchInventoryItems} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InventoryPage; 