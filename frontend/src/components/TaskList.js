import React, { useState } from 'react';
import TaskItem from './TaskItem';
import '../styles/task-list.css';

const TaskList = ({ tasks, onUpdate, onDelete }) => {
  const [quickFilter, setQuickFilter] = useState('all'); // all, today, yesterday, custom
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Helper dates
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  // Filter tasks based on quickFilter & custom dates
  const filteredTasks = tasks.filter(task => {
    if (!task.createdAt) return true;

    const taskDate = new Date(task.createdAt);

    if (quickFilter === 'today') {
      return taskDate.toDateString() === today.toDateString();
    } else if (quickFilter === 'yesterday') {
      return taskDate.toDateString() === yesterday.toDateString();
    } else if (quickFilter === 'custom') {
      if (startDate && taskDate < new Date(startDate)) return false;
      if (endDate && taskDate > new Date(endDate + 'T23:59:59')) return false;
      return true;
    }

    return true; // all
  });

  // Count summary
  const total = filteredTasks.length;
  const pending = filteredTasks.filter(t => t.status === 'pending').length;
  const inProgress = filteredTasks.filter(t => t.status === 'in-progress').length;
  const completed = filteredTasks.filter(t => t.status === 'completed').length;

  return (
    <div className="task-list">
      <h2 className="task-list-header">📋 Task List</h2>

      {/* Quick Filter Buttons */}
      <div className="quick-filter">
        <button onClick={() => setQuickFilter('today')}>Today</button>
        <button onClick={() => setQuickFilter('yesterday')}>Yesterday</button>
        <button onClick={() => setQuickFilter('custom')}>Custom</button>
        <button onClick={() => { setQuickFilter('all'); setStartDate(''); setEndDate(''); }}>All</button>
      </div>

      {/* Custom Date Picker */}
      {quickFilter === 'custom' && (
        <div className="date-picker">
          <label>Start Date: </label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
          <label>End Date: </label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>
      )}

      <p className="task-summary">
        Total: <strong>{total}</strong> | 
        Pending: <strong>{pending}</strong> | 
        In-progress: <strong>{inProgress}</strong> | 
        Completed: <strong>{completed}</strong>
      </p>

      {filteredTasks.map(task => (
        <TaskItem
          key={task._id}
          task={task}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TaskList;
