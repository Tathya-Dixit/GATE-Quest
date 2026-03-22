import { Sidebar } from "@/components/ui/Sidebar";
import { Navbar } from "@/components/ui/Navbar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="layout-wrapper">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <main className="page-container">{children}</main>
      </div>

      
    </div>
  );
}
