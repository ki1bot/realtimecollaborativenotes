import type { UserSummary } from "../../types/note";

const PresenceList = ({ users }: { users: UserSummary[] }) => {
  return (
    <div className="presence-list">
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
  );
};

export default PresenceList;
