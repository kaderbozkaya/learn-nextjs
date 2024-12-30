"use server"

import { getCollection } from "@/lib/db"
import getAuthUser from "@/lib/getAuthUser"
import { BlogPostSchema } from "@/lib/rules"
import { ObjectId } from "mongodb"
import { redirect } from "next/navigation"


//formlarla çalışacağımız için iki parametre geçtik

export async function createPost(state,formData) {
    //kullanıcı oturum açıp açmadıpını kontrol etme.eğer açmamışsa veri tabanına hiçbir şey göndermek istemiyoruz.çerezleri okur jwtnin geçerli olupp olmadığını kontrol eder eğer kullanıcı geçerli değilse tanımsız(undefined) veya boş döner(null) 
    const user=await getAuthUser()
    if(!user) return redirect("/") //eğer null ise anasayfaya yönlendiriyoruz

    //form doğrulama alanları
    const title=formData.get("title")
    const content=formData.get("content")

    const validatedFields=BlogPostSchema.safeParse({
        title,
        content
    })
//doğrulanmış alanların başarılı olup olmadığını kontrol etmek için 
if(!validatedFields.success) {
    return{
        errors:validatedFields.error.flatten().fieldErrors,
        //formu gönderdiğimizde hata varsa form tamamen temizlenmesin istersek title ve contentide ekleriz bir hata olsa bile bu veriler formda durur
        title,
        content
    }
}
//hata yoksa veri tabanına kaydederiz
try {
    const postCollection=await getCollection('posts') //kimlik doğrulamalarıyla kullanıcı koleksiyonumuzu oluşturmuştuk ve şimdi buna posts adını veren yeni bir koleksiyon oluşturuyoruz. bu gönderiler adlı koleksiyonu alır ya da yoksa ueni bir tane oluşturur
const post= {
    title:validatedFields.data.title, //doğrulanmış başlık
    content:validatedFields.data.content, //doğrulanmış content
    //gönderiyi kimin oluşturduğunu göstermek için userId. bunu mongodbnin nesne kimliğine dönüştrüyoruz. bir nesne kimliği oluşturmak için hexa dizesinden oluştururz bu 24 karakrerlik bir dize demek. bu 24 karakterlik dizemiz olan bu kullanıcı kimliğini kullanmaj istediğimiz yerdir
    userId:ObjectId.createFromHexString(user.userId)
}
await postCollection.insertOne(post) //nesne arayan insertone yöntemini kullanıyoruz 
} catch (error) {
    return {

        errors:{title:error.message}
    }
    
}
redirect("/dashboard")

    
}

//for update post
export async function updatePost(state,formData) {
    //kullanıcı giriş yaptı mı
const user=await getAuthUser()
if(!user) return redirect("/")
const title=formData.get("title")
const content=formData.get("content")
const postId=formData.get("postId") //düzenlemeye çalıştığımız gönderinin kimliğini almak için bir değişkene kaydediyoruz
const validatedFields=BlogPostSchema.safeParse({
            title,
            content
        })
        if(!validatedFields.success) {
            return {
                errors:validatedFields.error.flatten().fieldErrors,
                title,
                content
            }
        }
         
        //postu bulmak için
        const postsCollection=await getCollection("posts")
        const post=await postsCollection.findOne({
            _id:ObjectId.createFromHexString(postId)
        }) //güncellemeye çalışan kullanıcı için öncelikle findone metodu kullanılıyor idye göre arannıyor bu id formdan aldığımız bir stringdir bu yüzden bunu bir objeye geri döndürmek istiyoruz

        //kullanıcının bu posta sahip olup olmadığını kontrol etmek için. datadan gelen veri string olmadığı için ve eşitlemeye çalıştığımız şey string olduğu için data verisini stringe çeviriyoruz
if(user.userId !==post.userId.toString()) return redirect("/")
//datada veriyi güncellemek için
postsCollection.findOneAndUpdate({
    _id:post._id},
    {
        $set: {
            title:validatedFields.data.title,
            content:validatedFields.data.content
        },
    })//iki argüman alıyor ilki filtreler veya kriterler.hangi postu güncellemek istiyoruz ve kriterimiz ne. ikinci argüman güncellenen belge ve alanlar. özel mongodb değişkenlerinden olan $seti kullanıyoruz.
    redirect("/dashboard")

}