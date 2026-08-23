import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { PublicFooter } from "./PublicFooter";

export function PublicLayout() {
  return (
   <div className="flex min-h-screen flex-col bg-background text-foreground">
      

      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <PublicFooter />

    </div>
  );
}