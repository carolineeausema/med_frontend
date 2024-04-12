import Head from 'next/head';
import styles from '../styles/Home.module.css';
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

export default function EmployeeHome() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editedItem, setEditedItem] = useState(null);
  const [newItem, setNewItem] = useState({ name: '', title: '', home_dept: '' });
  const [reloadAttempts, setReloadAttempts] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/employee`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditedItem(item);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/employee/${editedItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editedItem.name, title: editedItem.title, home_dept: editedItem.home_dept }),
      });
      if (!response.ok) {
        throw new Error('Failed to save data');
      }
      setEditedItem(null);
      fetchData();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAdd = async () => {
    try {
      const response = await fetch(`/api/employee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newItem.name, title: newItem.title, home_dept: newItem.home_dept }),
      });
      if (!response.ok) {
        throw new Error('Failed to add data');
      }
      setNewItem({ name: '', title: '', home_dept: '' });
      fetchData();
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const handleDelete = async (id) => {
      try {
          const response = await fetch(`/api/employee/${id}`, {
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
    <div className={styles.container}>
      <Layout />
      <h1>Employee Table</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Title</th>
            <th>Department ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td> {/* ID field is not editable */}
              <td>
                {editedItem && editedItem.id === item.id ? (
                  <input
                    value={editedItem.name}
                    onChange={(e) =>
                      setEditedItem({ ...editedItem, name: e.target.value })
                    }
                  />
                ) : (
                  item.name
                )}
              </td>
              <td>
                {editedItem && editedItem.id === item.id ? (
                  <input
                    value={editedItem.title}
                    onChange={(e) =>
                      setEditedItem({ ...editedItem, title: e.target.value })
                    }
                  />
                ) : (
                  item.title
                )}
              </td>
              <td>
                {editedItem && editedItem.id === item.id ? (
                  <input
                    value={editedItem.home_dept}
                    onChange={(e) =>
                      setEditedItem({ ...editedItem, home_dept: e.target.value })
                    }
                  />
                ) : (
                  item.home_dept
                )}
              </td>
              <td>
                {editedItem && editedItem.id === item.id ? (
                  <>
                    <button onClick={handleSave}>Save</button>
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
            <td>
              <input
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              />
            </td>
            <td>
              <input
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              />
            </td>
            <td>
              <input
                value={newItem.home_dept}
                onChange={(e) => setNewItem({ ...newItem, home_dept: e.target.value })}
              />
            </td>
            <td>
              <button onClick={handleAdd}>Add</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
