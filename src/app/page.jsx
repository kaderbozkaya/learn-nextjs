import PostCard from "@/components/PostCard";
import { getCollection } from "@/lib/db";

export default async function Home() {
  //veri tabanından blogları okumak için koleksiyon oluşturuyoruz
  const postCollection = await getCollection("posts");
  //tüm postları almak için bir find yöntemi kullanıyoruz.nesneler üzerinde dönmesi için array olarak alıyoruz
  const posts = await postCollection?.find().sort({ $natural: -1 }).toArray(); //mongodbye ait olan natural ile son eklenen ilk başa geliyor.yani tersine sıralanıyor
  if (posts) {
    return (
      <div className="grid grid-cols-2 gap-6">
        {posts.map((post) => (
          <div key={post._id}>
            <PostCard post={post} />
          </div>
        ))}
      </div>
    );
  } else {
    return <p>Failed to fetch the data from database.</p>;
  }
}
