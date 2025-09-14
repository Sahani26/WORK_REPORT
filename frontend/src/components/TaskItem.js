// import React from 'react';
import '../styles/task-item.css';

const TaskItem = ({ task, onUpdate, onDelete, actionsEnabled }) => {
  return (
    <div className='task-item-master'>
    <div className="task-item">
      <h3>{task.title}</h3>
      <p><strong>Assigned by:</strong> {task.assignedBy}</p>
      <p><strong>Status:</strong> 
        <span className={`status-badge ${task.status}`}>
          {task.status}
        </span>
      </p>
      <p>{task.description}</p>
      <p><em>{task.remarks}</em></p>

      {/* Show buttons only when enabled */}
      {actionsEnabled && (
        <div className="task-actions">
          <button onClick={() => onUpdate(task)}>Edit</button>
          <button onClick={() => onDelete(task._id)}>Delete</button>
        </div>
      )}
    </div>
    </div>
  );
};

export default TaskItem;
