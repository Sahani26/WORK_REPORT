import React, { useState } from 'react';
import api from '../utils/api';
import '../styles/task-item.css';

const TaskItem = ({ task, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(task);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const save = async () => {
    setLoading(true);
    try {
      const res = await api.put(`/tasks/${task._id}`, form);
      onUpdate(res.data);
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert('Failed to update');
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    if (!window.confirm('Delete this task?')) return;
    setLoading(true);
    try {
      await api.delete(`/tasks/${task._id}`);
      onDelete(task._id);
    } catch (err) {
      console.error(err);
      alert('Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-item">
      {editing ? (
        <>
          <input name="title" value={form.title} onChange={handleChange} />
          <input name="assignedBy" value={form.assignedBy} onChange={handleChange} />
          <textarea name="description" value={form.description} onChange={handleChange} />
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="in-progress">In-progress</option>
            <option value="completed">Completed</option>
          </select>
          <input name="remarks" value={form.remarks} onChange={handleChange} />
          <div className="task-actions">
            <button onClick={save} disabled={loading}>Save</button>
            <button onClick={() => setEditing(false)} disabled={loading}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          <h3>{task.title}</h3>
          <p><strong>Assigned by:</strong> {task.assignedBy || '-'}</p>
          <p>
            <strong>Status: </strong>
            <span className={`status-badge ${task.status}`}>{task.status}</span>
          </p>
          <p>{task.description}</p>
          <p><em>{task.remarks}</em></p>
          <div className="task-actions">
            <button onClick={() => setEditing(true)}>Edit</button>
            <button onClick={remove} disabled={loading}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskItem;
