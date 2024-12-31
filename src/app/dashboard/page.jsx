import { deletePost } from "@/actions/posts";
import { getCollection } from "@/lib/db";
import getAuthUser from "@/lib/getAuthUser";
import { ObjectId } from "mongodb";
import Link from "next/link";

export default async function Dashboard() {
  const user = await getAuthUser(); //oturum açmış kullanıcı bilgileri alınıyor
  const postsCollection = await getCollection("posts"); //dbdeki postları alıyoruz
  const userPosts = await postsCollection
    ?.find({ userId: ObjectId.createFromHexString(user.userId) })
    .sort({ $natural: -1 })
    .toArray(); //find ile kullanıcının gönderilerini filtreliyoruz kullanıcının gönderileri user.userid ile eşleşen belgelerdir. string ifadeyi objeye dönüştürüyoruz mongodb objectid ile.sıralama ile son eklenen en üstte olacak şekilde sıralıyoruz.sonuçları diziye dönüştürüyoruz.
  if (!userPosts) return <p>Failed to fetch data!</p>;
  if (userPosts.length === 0) return <p>You don't have any posts.</p>;
  return (
    <div>
      <h1 className="title">Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th className="w-3/6">Title</th>
            <th className="w-1/6 sr-only">View</th>
            <th className="w-1/6 sr-only">Edit</th>
            <th className="w-1/6 sr-only">Delete</th>
          </tr>
        </thead>
        <tbody>
          {userPosts.map((post) => (
            <tr key={post._id.toString()}>
              <td className="w-3/6">{post.title}</td>
              <td className="w-1/6 text-blue-500">
                <Link href={`/posts/show/${post._id.toString()}`}>View</Link>
              </td>
              <td className="w-1/6 text-green-800">
                <Link href={`/posts/edit/${post._id.toString()}`}>Edit</Link>
              </td>
              <td className="w-1/6 text-red-500">
                <form action={deletePost}>
                  {/*fomdaki verileri ve formumuzdaki gizli bir giriş alanını kullanarak bu kaynağın kimliğini sunucumuza gönderebilmek için bir gönderi yapıyooruz. bunun için tabloya input gizli tipte bir giriş alanı oluşturuyoruz  */}
                  <input
                    type="hidden"
                    name="postId"
                    defaultValue={post._id.toString()}
                  ></input>
                  <button type="submit">Delete</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
