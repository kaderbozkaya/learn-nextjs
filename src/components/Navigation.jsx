import React from "react";
import NavLink from "./NavLink";
import getAuthUser from "@/lib/getAuthUser";
import { logout } from "@/actions/auth";

export default async function Navigation() {
  const authUser = await getAuthUser();
  return (
    <nav>
      <NavLink label="Home" href="/" />

      {authUser ? (
        <div className="flex items-center">
          <NavLink label="Dashboard" href="/dashboard" />
          {/*oturumu silerek çıkış yapıyoruz. bu da kullanıcının oturumu kapattığı anlamına gelir.*/}
          <form action={logout}>
            <button className=",nav-link">Logout</button>
          </form>
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
