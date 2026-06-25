import type { ActivityLog } from "../../types/note";

const ActivityLogPanel = ({ activities }: { activities: ActivityLog[] }) => {
  return (
    <div className="activity-panel">
      <h3>Activity</h3>

      {activities.length === 0 ? (
        <p className="muted">Belum ada aktivitas.</p>
      ) : (
        <div className="activity-list">
          {activities.map((activity) => (
            <div className="activity-item" key={activity._id}>
              <p>{activity.message}</p>
              <span>{new Date(activity.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityLogPanel;
