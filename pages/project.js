import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editedItem, setEditedItem] = useState(null);
  const [newItem, setNewItem] = useState({ name: '', startDate: '', endDate: '', budget: '', sponsor: '' }); // Removed id from newItem
  const [reloadAttempts, setReloadAttempts] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/project`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditedItem(item);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/project/${editedItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editedItem.name,
          startDate: editedItem.startDate,
          endDate: editedItem.endDate,
          budget: editedItem.budget,
          sponsor: editedItem.sponsor
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to save data');
      }
      setEditedItem(null);
      fetchData();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAdd = async () => {
    try {
      const response = await fetch(`/api/project`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newItem.name,
          startDate: newItem.startDate,
          endDate: newItem.endDate,
          budget: newItem.budget,
          sponsor: newItem.sponsor
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to add data');
      }
      setNewItem({ name: '', startDate: '', endDate: '', budget: '', sponsor: '' });
      fetchData();
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const handleDelete = async (id) => {
      try {
          const response = await fetch(`/api/project/${id}`, {
              method: 'DELETE',
          });
          if (!response.ok) {
              throw new Error('Failed to delete data');
          }
          fetchData(); // Assuming fetchData function is defined elsewhere to refetch data after deletion
      } catch (error) {
          console.error('Error:', error);
      }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
      if (reloadAttempts < 5) {
          // Attempt to reload the page
          setTimeout(() => {
              window.location.reload();
              setReloadAttempts(reloadAttempts + 1);
          }, 1000); // Adjust the timeout value as needed
          return <div>Error: Reloading page... Retry attempt {reloadAttempts + 1}</div>;
      } else {
          return <div>Error: Unable to load data after multiple attempts.</div>;
      }
  }

  return (
    <div>
      <Layout />
      <h1>Project Table</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Budget</th>
            <th>Sponsor</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td> {/* ID field is not editable */}
              <td>{editedItem && editedItem.id === item.id ? <input value={editedItem.name} onChange={e => setEditedItem({...editedItem, name: e.target.value})}/> : item.name}</td>
              <td>{editedItem && editedItem.id === item.id ? <input type="date" value={editedItem.startDate} onChange={e => setEditedItem({...editedItem, startDate: e.target.value})}/> : item.startDate}</td>
              <td>{editedItem && editedItem.id === item.id ? <input type="date" value={editedItem.endDate} onChange={e => setEditedItem({...editedItem, endDate: e.target.value})}/> : item.endDate}</td>
              <td>{editedItem && editedItem.id === item.id ? <input value={editedItem.budget} onChange={e => setEditedItem({...editedItem, budget: e.target.value})}/> : item.budget}</td>
              <td>{editedItem && editedItem.id === item.id ? <input value={editedItem.sponsor} onChange={e => setEditedItem({...editedItem, sponsor: e.target.value})}/> : item.sponsor}</td>
              <td>
                {editedItem && editedItem.id === item.id ? (
                  <>
                    <button onClick={() => handleSave()}>Save</button>
                    <button onClick={() => setEditedItem(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(item)}>Edit</button>
                    <button onClick={() => handleDelete(item.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
          <tr>
            <td>Auto-generated</td> {/* ID field for new item */}
            <td><input value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})}/></td>
            <td><input type="date" value={newItem.startDate} onChange={e => setNewItem({...newItem, startDate: e.target.value})}/></td>
            <td><input type="date" value={newItem.endDate} onChange={e => setNewItem({...newItem, endDate: e.target.value})}/></td>
            <td><input value={newItem.budget} onChange={e => setNewItem({...newItem, budget: e.target.value})}/></td>
            <td><input value={newItem.sponsor} onChange={e => setNewItem({...newItem, sponsor: e.target.value})}/></td>
            <td>
              <button onClick={() => handleAdd()}>Add</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
