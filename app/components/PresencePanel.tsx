"use client";

import type { ActivityLog, UserSummary } from "@/app/types";

export default function PresencePanel({
  users,
  activities,
}: {
  users: UserSummary[];
  activities: ActivityLog[];
}) {
  return (
    <>
      <div className="panel">
        <h3>Online</h3>

        {users.length === 0 ? (
          <p className="muted">Belum ada user online.</p>
        ) : (
          <div className="presence-items">
            {users.map((user) => (
              <div className="presence-item" key={user._id}>
                <span className="avatar">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span>{user.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="panel">
        <h3>Activity</h3>

        {activities.length === 0 ? (
          <p className="muted">Belum ada aktivitas.</p>
        ) : (
          <div className="activity-list">
            {activities.map((activity) => (
              <div className="activity-item" key={activity._id}>
                <p>{activity.message}</p>
                <span>
                  {new Date(activity.createdAt).toLocaleString("id-ID")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
