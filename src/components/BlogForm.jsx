"use client";
import React, { useActionState } from "react";

export default function BlogForm({ handler }) {
  //bu ocmponenti tekrar kullanacağımız için buradan direkt post oluşturma yapmıyoruz.handler adında bir props kabul ediyoruz bu da form için bir eylem bu nedenle bu handler özelliğine hangi eylemi geçirirsek geçirelim bu formu eylemi olacak
  const [state, action, isPending] = useActionState(handler, undefined); //formda kullandığım action handlera denk geliyor
  return (
    <form action={action} className=" space-y-4">
      <div>
        <label htmlFor="title">Title</label>
        <input type="text" name="title" defaultValue={state?.title} />
        {state?.errors?.title && <p className="error">{state.errors.title}</p>}
      </div>
      <div>
        <label htmlFor="content">Content</label>
        <textarea
          name="content"
          rows="6"
          defaultValue={state?.content}
        ></textarea>
        {state?.errors?.content && (
          <p className="error">{state.errors.content}</p>
        )}
      </div>
      <button className="btn-primary" disabled={isPending}>
        {isPending ? "Loading..." : "Submit"}
      </button>
    </form>
  );
}
