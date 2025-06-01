import React, { useState } from 'react';

/**
 * Individual task item component
 */
const TaskItem = ({ task, onCompleted, onDeleted }) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await onCompleted(task.id);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDeleted(task.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="task-item">
      <div className="task-content">
        <h4 className="task-title">{task.title}</h4>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
        <div className="task-meta">
          <span className="task-date">
            Created: {formatDate(task.createdAt)}
          </span>
        </div>
      </div>
      
      <div className="task-actions">
        <button
          onClick={handleComplete}
          className={`btn btn-success ${isCompleting ? 'loading' : ''}`}
          disabled={isCompleting || isDeleting}
          title="Mark as completed"
        >
          {isCompleting ? '⏳' : '✅'} Done
        </button>
        <button
          onClick={handleDelete}
          className={`btn btn-danger ${isDeleting ? 'loading' : ''}`}
          disabled={isCompleting || isDeleting}
          title="Delete task"
        >
          {isDeleting ? '⏳' : '🗑️'} Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
