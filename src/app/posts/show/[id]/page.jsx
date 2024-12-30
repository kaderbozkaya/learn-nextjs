import PostCard from "@/components/PostCard";
import { getCollection } from "@/lib/db";
import { ObjectId } from "mongodb";
import React from "react";

export default async function Show({ params }) {
  //istediğimiz parametre yalnızca id olduğu için id olarak giriyoruz parametreyi.bu idye göre veritabanımızı sorgulayıp doğru sonuçları göstereceğiz
  const { id } = await params;
  const postsCollection = await getCollection("posts");
  //findone yöntemini kullanarak buluyoruz ve bu bir nesne olacak
  //mongodbde id özelliğinin altçizgiyle başladığını biliyoruz. bu yüzden kimliği _id ile buradaki kimlik(id) olmasını istiyoruz yani _id:id
  const post =
    id.length === 24
      ? await postsCollection?.findOne({
          _id: ObjectId.createFromHexString(id),
        })
      : null; //_id bir obje id bir string bu yüzden bunu objectid ile objeye dönüştürüyoruz.id 24 karakterli olmalı değilse null döner.postscollection?=veritabanı bağlantısı başarılıysa gönderiyi bul deriz
  return (
    <div className="container w-1/2">
      {post ? <PostCard post={post} /> : <p>Failed to fetch the data</p>}
    </div>
  );
}
