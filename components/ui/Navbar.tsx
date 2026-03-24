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
          height: 80px;
          background: var(--glass-bg);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--glass-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          position: sticky;
          top: 0;
          z-index: 90;
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.5rem 1rem;
          padding-left: 0.5rem;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
          transition: all 0.2s ease;
        }

        .user-profile:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-1px);
        }

        .avatar {
          border-radius: 50%;
          border: 3px solid var(--glass-border);
          background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary));
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.1rem;
          width: 40px;
          height: 40px;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .user-name {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-right: 0.25rem;
        }
      `}</style>
    </header>
  );
}
