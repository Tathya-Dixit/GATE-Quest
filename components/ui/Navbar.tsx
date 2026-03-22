"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="navbar">
      <div className="navbar-left">
        {/* Placeholder for optional mobile sidebar toggle */}
      </div>

      <div className="navbar-right">
        <ThemeToggle />
        {session?.user && (
          <div className="user-profile">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt="Profile"
                width={36}
                height={36}
                className="avatar"
              />
            ) : (
              <div className="avatar fallback">
                {session.user.name?.charAt(0) || "U"}
              </div>
            )}
            <span className="user-name">{session.user.name}</span>
          </div>
        )}
      </div>

      <style jsx>{`
        .navbar {
          height: 70px;
          background-color: var(--bg-primary);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 20px;
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
        }

        .avatar {
          border-radius: 50%;
          border: 2px solid var(--border-color);
          background-color: var(--brand-primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1rem;
          width: 36px;
          height: 36px;
        }

        .user-name {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-primary);
          margin-right: 0.5rem;
        }
      `}</style>
    </header>
  );
}
