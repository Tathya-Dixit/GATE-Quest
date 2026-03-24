"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "📊" },
  { label: "Subjects", href: "/subjects", icon: "📚" },
  { label: "Badges", href: "/badges", icon: "🏅" },
  { label: "Leaderboard", href: "/leaderboard", icon: "🏆" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link href="/dashboard" className="logo">
          <span className="logo-icon">🎯</span>
          <span className="logo-text">GATE Quest</span>
        </Link>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.href} className="nav-item">
                <Link
                  href={item.href}
                  className={`nav-link ${isActive ? "active" : ""}`}
                >
                  <div className="nav-icon-wrapper">
                    <span className="nav-icon">{item.icon}</span>
                  </div>
                  <span className="nav-label">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="nav-link logout-btn" onClick={() => signOut()}>
          <div className="nav-icon-wrapper">
            <span className="nav-icon">🚪</span>
          </div>
          <span className="nav-label">Sign Out</span>
        </button>
      </div>

      <style jsx>{`
        .sidebar {
          width: 280px;
          height: 100vh;
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          flex-shrink: 0;
          z-index: 100;
          padding: 1rem 0;
        }

        .sidebar-header {
          height: 80px;
          display: flex;
          align-items: center;
          padding: 0 2rem;
          margin-bottom: 2rem;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-weight: 900;
          font-size: 1.5rem;
          background: linear-gradient(135deg, var(--text-primary), var(--brand-primary));
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.5px;
        }

        .logo-icon {
          font-size: 1.75rem;
          filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.3));
        }

        .sidebar-nav {
          flex: 1;
          padding: 0 1rem;
        }

        .nav-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-item {
          position: relative;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.875rem 1rem;
          border-radius: 12px;
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          width: 100%;
          border: 1px solid transparent;
          background: transparent;
        }

        .nav-link:hover {
          background: hsla(243, 75%, 59%, 0.05);
          color: var(--brand-primary);
          transform: translateY(-1px);
        }

        .nav-link.active {
          background: hsla(243, 75%, 59%, 0.1);
          color: var(--brand-primary);
          box-shadow: inset 0 0 0 1px hsla(243, 75%, 59%, 0.1);
        }

        .nav-link.active::before {
          content: "";
          position: absolute;
          left: -4px;
          top: 20%;
          bottom: 20%;
          width: 4px;
          background: var(--brand-primary);
          border-radius: 0 4px 4px 0;
          box-shadow: 2px 0 10px var(--brand-primary);
        }

        .nav-icon-wrapper {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: var(--bg-tertiary);
          font-size: 1.1rem;
          transition: all 0.2s ease;
          border: 1px solid var(--border-color);
        }

        .nav-link:hover .nav-icon-wrapper,
        .nav-link.active .nav-icon-wrapper {
          background: var(--brand-primary);
          color: white;
          border-color: var(--brand-primary);
          box-shadow: 0 4px 10px hsla(243, 75%, 59%, 0.3);
          transform: scale(1.1);
        }

        .nav-label {
          flex: 1;
        }

        .sidebar-footer {
          padding: 1rem;
          margin-top: auto;
        }

        .logout-btn {
          color: var(--text-secondary);
          opacity: 0.7;
        }

        .logout-btn:hover {
          background: hsla(0, 72%, 51%, 0.1);
          color: var(--danger);
          opacity: 1;
        }
      `}</style>
    </aside>
  );
}
