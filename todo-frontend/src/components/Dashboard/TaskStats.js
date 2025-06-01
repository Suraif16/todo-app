import React from 'react';

/**
 * Task statistics component
 * Shows overview of user's tasks
 */
const TaskStats = ({ stats }) => {
  return (
    <div className="stats-container">
      <div className="stat-card">
        <div className="stat-number">{stats.total}</div>
        <div className="stat-label">Total Tasks</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{stats.completed}</div>
        <div className="stat-label">Completed</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{stats.incomplete}</div>
        <div className="stat-label">Pending</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">
          {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
        </div>
        <div className="stat-label">Completion Rate</div>
      </div>
    </div>
  );
};

export default TaskStats;