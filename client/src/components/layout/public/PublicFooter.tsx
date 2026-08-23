
import { Link } from "react-router-dom";

import {
  Building2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <Building2 className="h-5 w-5" />
              </div>

              <span className="text-xl font-bold">
                Estate<span className="text-secondary">Hub</span>
              </span>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-primary-foreground/65">
              A modern property platform built to make finding,
              exploring, and connecting with properties in Ethiopia
              simpler and more transparent.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary-foreground/10 bg-primary-foreground/5 px-4 py-2 text-xs text-primary-foreground/70">
              <MapPin className="h-3.5 w-3.5 text-secondary" />
              Addis Ababa, Ethiopia
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-semibold">
              Explore
            </h3>

            <div className="mt-4 space-y-3 text-sm text-primary-foreground/65">
              <Link
                to="/"
                className="block transition hover:text-primary-foreground"
              >
                Home
              </Link>

              <Link
                to="/properties"
                className="block transition hover:text-primary-foreground"
              >
                Properties
              </Link>

              <Link
                to="/login"
                className="block transition hover:text-primary-foreground"
              >
                Sign in
              </Link>

              <Link
                to="/register"
                className="block transition hover:text-primary-foreground"
              >
                Create account
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold">
              Contact
            </h3>

            <div className="mt-4 space-y-4 text-sm text-primary-foreground/65">

              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                <span>
                  Addis Ababa,
                  <br />
                  Ethiopia
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-secondary" />
               <span>Contact us for support</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-secondary" />
                <span>support@estatehub.et</span>
              </div>

            </div>
          </div>
        </div>

         
        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-7 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">

          <p>
            © {new Date().getFullYear()} EstateHub. All rights reserved.
          </p>

          <p>
            Made for the Ethiopian market.
          </p>

        </div>

        </div>
    </footer>
  );
}
