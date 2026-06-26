"use client";

import { KeyRound, LogOut, UserCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/app/components/AuthProvider";
import ChangePasswordModal from "@/app/components/ChangePasswordModal";

export default function ProfileMenu({ onLogout }: { onLogout: () => void }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const initial = user?.name?.charAt(0).toUpperCase() || "U";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="profile-wrapper" ref={wrapperRef}>
        <button
          type="button"
          className="profile-button"
          onClick={() => setOpen((current) => !current)}
        >
          <span className="profile-avatar">{initial}</span>
          <span className="profile-name">{user?.name || "Profile"}</span>
        </button>

        {open && (
          <div className="profile-dropdown">
            <div className="profile-header">
              <div className="profile-header-avatar">{initial}</div>

              <div>
                <strong>{user?.name}</strong>
                <span>{user?.email}</span>
              </div>
            </div>

            <button type="button" className="profile-item">
              <UserCircle size={18} />
              <span>Profile</span>
            </button>

            <button
              type="button"
              className="profile-item"
              onClick={() => {
                setOpen(false);
                setShowChangePassword(true);
              }}
            >
              <KeyRound size={18} />
              <span>Ubah Password</span>
            </button>

            <button
              type="button"
              className="profile-item profile-item-danger"
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      {showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}
    </>
  );
}
