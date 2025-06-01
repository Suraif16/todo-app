import React from 'react';
import TaskItem from './TaskItem';

/**
 * Task list component
 * Displays the list of tasks
 */
const TaskList = ({ tasks, onTaskCompleted, onTaskDeleted }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <h3>No tasks yet</h3>
        <p>Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onCompleted={onTaskCompleted}
          onDeleted={onTaskDeleted}
        />
      ))}
    </div>
  );
};

export default TaskList;
