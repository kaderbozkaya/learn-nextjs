import React from "react";
import NavLink from "./NavLink";
import getAuthUser from "@/lib/getAuthUser";

export default async function Navigation() {
  const authUser = await getAuthUser();
  return (
    <nav>
      <NavLink label="Home" href="/" />

      {authUser ? (
        <div className="flex items-center">
          <NavLink label="Dashboard" href="/dashboard" />
        </div>
      ) : (
        <div>
          <NavLink label="Register" href="/register" />
          <NavLink label="Login" href="/login" />
        </div>
      )}
    </nav>
  );
}
