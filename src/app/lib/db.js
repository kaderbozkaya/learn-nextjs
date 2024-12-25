import { MongoClient, ServerApiVersion }  from "mongodb"

if(!process.env.DB_URI){
    throw new Error("mongo uri not found!")
}
const client =new MongoClient(process.env.DB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
})
//veri tabanına bağlanmak istiyoruz ve bu kodu yeniden kullanılabilir hale getirmek istiyoruz bu yüzden bir asyn fonk oluşturucaz
async function getDB(dbName) {
    try{
        await client.connect()
        console.log(">>>>connected to db<<<<<") //istemciyi beklemek ve bağlanıp bağlanmayacağını görmek istiyoruz.eğer bağlanırsa konsola yazdırıyoruz
        return client.db(dbName) //bağlantı başarılı olursa kullanmak istediğimiz veritabanı döndürmek istiyoruz
    } catch(err) {
        console.log(err)
    }
    
}
//koleksiyonu verecek başka bir fonk yarat bu temelde bir tablodur,bu sadece mongobnin tabloları koleksiyon olaarak adlandırma şeklidir ve her satırı bir belge olarak adlandırırlar bu yüzden bu fonksiyonu uygulamamda başka yerlerde kullanmak için dışarıya aktarıyoruz.veri tabanı adımızı bu fonsiyona dize olarak geçiyoruz(next_blog_db)
export async function getCollection(collectionName) {
    const db=await getDB("next_blog_db");
   if(db) return db.collection(collectionName) //eğer varsa veritabanından belirli koleksiyonu döndüreceğim bu db veya veritabanında koleksiyon fonknunu kullanabiliriz
   return null //eğer veritabanı herhangibir sebepten dolayı null dönerse bu fonk null dönücek
    
}