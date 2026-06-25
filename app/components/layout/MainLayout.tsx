import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="navbar">
        <Link to="/" className="brand">
          Realtime Notes
        </Link>

        <div className="navbar-right">
          <span>{user?.name}</span>
          <button className="btn btn-secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main className="main-content">{children}</main>
    </div>
  );
};

export default MainLayout;
