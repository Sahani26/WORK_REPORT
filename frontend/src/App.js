import React, { useEffect, useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import api from './utils/api';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const addTask = (task) => setTasks(prev => [task, ...prev]);
  const updateTask = (updated) => setTasks(prev => prev.map(t => t._id === updated._id ? updated : t));
  const removeTask = (id) => setTasks(prev => prev.filter(t => t._id !== id));

  return (
    <div className="container">
      <h1>MERN Task Manager</h1>
      <TaskForm onAdd={addTask} />
      {loading ? <p>Loading tasks...</p> : <TaskList tasks={tasks} onUpdate={updateTask} onDelete={removeTask} />}
    </div>
  );
}

export default App;
