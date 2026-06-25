import { useEffect, useState } from "react";
import { noteService } from "../../services/noteService";
import { userService } from "../../services/userService";
import type { Note, Role, UserSummary } from "../../types/note";

const CollaboratorModal = ({
  note,
  onClose,
  onUpdated,
}: {
  note: Note;
  onClose: () => void;
  onUpdated: (note: Note) => void;
}) => {
  const [keyword, setKeyword] = useState("");
  const [role, setRole] = useState<Role>("viewer");
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      if (keyword.trim().length < 2) {
        setUsers([]);
        return;
      }

      const result = await userService.searchUsers(keyword);
      setUsers(result);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [keyword]);

  const addCollaborator = async (userId: string) => {
    setLoading(true);

    try {
      const updatedNote = await noteService.addCollaborator(note._id, {
        userId,
        role,
      });
      onUpdated(updatedNote);
      setKeyword("");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const removeCollaborator = async (userId: string) => {
    setLoading(true);

    try {
      const updatedNote = await noteService.removeCollaborator(
        note._id,
        userId,
      );
      onUpdated(updatedNote);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2>Share Note</h2>
          <button className="icon-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="form-group">
          <label>Cari user</label>
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Cari nama atau email"
          />
        </div>

        <div className="form-group">
          <label>Role</label>
          <select
            value={role}
            onChange={(event) => setRole(event.target.value as Role)}
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
          </select>
        </div>

        <div className="search-result">
          {users.map((user) => (
            <div className="search-user" key={user._id}>
              <div>
                <strong>{user.name}</strong>
                <span>{user.email}</span>
              </div>
              <button
                className="btn btn-primary"
                disabled={loading}
                onClick={() => addCollaborator(user._id)}
              >
                Tambah
              </button>
            </div>
          ))}
        </div>

        <h3>Collaborators</h3>

        <div className="collaborator-list">
          {note.collaborators.map((item) => (
            <div className="collaborator-item" key={item.user._id}>
              <div>
                <strong>{item.user.name}</strong>
                <span>{item.user.email}</span>
              </div>
              <div className="collaborator-actions">
                <span className="badge">{item.role}</span>
                {item.role !== "owner" && (
                  <button
                    className="btn btn-danger"
                    disabled={loading}
                    onClick={() => removeCollaborator(item.user._id)}
                  >
                    Hapus
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollaboratorModal;
