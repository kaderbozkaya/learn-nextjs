import { updatePost } from "@/actions/posts";
import BlogForm from "@/components/BlogForm";
import { getCollection } from "@/lib/db";
import getAuthUser from "@/lib/getAuthUser";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import React from "react";

export default async function Edit({ params }) {
  const { id } = await params;
  const user = await getAuthUser(); //çerezlerden kimliği doğrulanmış kullanıcıyı al
  const postsCollection = await getCollection("posts");
  //sunucu bileşeninden istemci bileşenine yalnızca düz(plain object) nesneler geçebilir bu yüzden blog formumuz client comp edit sayfamız server comp ve gönderiyi doğrudan bu istemci bileşenine geçiremeyiz bu yüzden bunu bir jsona ve sonra tekrar bir nesneye dönüştüreceğiz
  let post;
  if (id.length === 24 && postsCollection) {
    post = await postsCollection.findOne({
      _id: ObjectId.createFromHexString(id),
    });
    post = JSON.parse(JSON.stringify(post));
    //seçilen post giriş yapan kullanıcıya ait değilse edit yapamasın diye.eğer kullanıcı idsi postun kullanıcı idsiyle aynı değilse
    if (user.userId !== post.userId) return redirect("/");
  } else {
    post = null;
  }
  return (
    <div className="container w-1/2">
      <h1 className="title">Edit your post</h1>
      {post ? (
        <BlogForm handler={updatePost} post={post} />
      ) : (
        <p>Failed to fetch the data</p>
      )}
    </div>
  );
}
