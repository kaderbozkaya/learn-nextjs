"use client";

import { login } from "@/actions/auth";
import Link from "next/link";
import { useActionState } from "react";

export default function Login() {
  const [state, action, isPending] = useActionState(login, undefined); //useactionstate bir react hooku bir acction fonk ile bağlantı kurar yani login ile. state login fonknun mevcut durumunu içerir. action form gönderimi için kullanılır.işlem ederken ispending true'dur

  return (
    <div className="container w-1/2">
      <h1 className="title">Login</h1>
      <form action={action} className="space-y-4">
        <div>
          <label htmlFor="email">Email</label>
          <input type="text" name="email" defaultValue={state?.email} />
          {state?.errors?.email && (
            <p className="error">{state.errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" />
          {state?.errors?.password && (
            <p className="error">{state.errors.password}</p>
          )}
        </div>

        <div className="flex items-end gap-4">
          <button disabled={isPending} className="btn-primary">
            {isPending ? "Loading..." : "Login"}
          </button>

          <Link href="/register" className="text-link">
            or register here
          </Link>
        </div>
      </form>
    </div>
  );
}
