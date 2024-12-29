import { createPost } from "@/actions/posts";
import BlogForm from "@/components/BlogForm";
import React from "react";

export default function create() {
  return (
    <div className="container w-1/2">
      <h1 className="title">Create a new post</h1>
      <BlogForm handler={createPost} />
      {/*handler değerimiz actionsta oluşturduğumuz createpost değeri oluyor*/}
    </div>
  );
}
