"use client"; //bir istemci(client) bileşeninde çalışan bir tepki hooku kullanmaya çallışıyoruz ancak bir sunucu bileşenindeyiz bu yüzden bunu ekliyoruz
import { register } from "@/app/actions/auth";
import Link from "next/link";
import React, { useActionState } from "react";

export default function Register() {
  //form gönderimlerini işlemek için useaction stateini kullandık.bu hook iki arguman istiyor birincisi formu işleyecek eylem ikincisi state yani durumdur başlangıç durumu için şimdilik undefined
  const [state, action, isPending] = useActionState(register, undefined);
  // console.log(isPending); //register butonuna basıldığında bir süre true olur ama onun dışında false olur.yani form işlenirken bu beklemededir
  return (
    <div className="container w-1/2">
      <h1 className="title">Register</h1>
      <form action={action} className="space-y-4">
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" defaultValue={state?.email} />{" "}
          {/*state email varsa default olarak alıyor ve register formunda kalıyor eğer şifreler hatalıysa mail kalıyor  */}
          {state?.errors?.email && (
            <p className="error">{state.errors.email}</p>
          )}
        </div>
        <div>
          <label htmlFor="password">password</label>
          <input type="password" name="password" />
          {state?.errors?.password && (
            <div className="error">
              <p>Password must:</p>
              <ul className="list-disc list-inside ml-4">
                {state.errors.password.map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm password</label>
          <input type="password" name="confirmPassword" />
          {state?.errors?.confirmPassword && (
            <p className="error">{state.errors.confirmPassword}</p>
          )}
        </div>
        <div className="flex items-end gap-4">
          <button disabled={isPending} className="btn-primary">
            {isPending ? "loading..." : "Register"}
          </button>
          <Link href="" className="text-link">
            or login here
          </Link>
        </div>
      </form>
    </div>
  );
}
