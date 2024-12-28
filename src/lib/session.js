import "server-only"
import { jwtVerify, SignJWT } from "jose"
import { cookies } from "next/headers"
//gizli anahtarların ayarlanması
const secretKey = process.env.SESSION_SECRET
const encodedKey=new TextEncoder().encode(secretKey) //jwt ile gelen şifreleme ve doğrulama işlemleri için kullanılan gizli bir anahtar olan secretkey
//encodedkey=gizli anahtarın utf-8 formatında bir uint8arraye dönüştürülmesi,bu jose kütüphanesinin kullandığı standart bir format

//JWT Şifreleme(encrypt)
export async function encrypt(payload) {
    return new SignJWT(payload)
    .setProtectedHeader({alg:"HS256"}) //tokenin içine yerleştirilecek veriyi belirtir
    //token için kullanınlan algoritmayı(hs256) setprotectheader belirtir.
    .setIssuedAt() //token oluşturulma zamanını ekler
    .setExpirationTime("7d") //tokenin 7 gün boyunca geçerli olmasını sağlar.
    .sign(encodedKey) //tokenin belirtilen gizli anahtarla şifreler.

}
//JWT Çözme ve doğrulama(decrypt).Gelen bir jwtnin geçerli olup olmadığını kontrol eder ve içeriğini çözer
export async function decrypt(session) {
    try {
        const {payload}=await jwtVerify(session,encodedKey, {
            algorithms:["HS256"],
        }) //şifrelemek için kullanılan algoritma hs256.
        return payload //doğrulama başrılıysa içindeki veriyi (payload) döndrür
        
    }catch(error) {
        console.log("failed to verify session")
    } //token geçersizse veya süresi dolmuşsa hata loglanır
    
}

//kullanıcı oturumu oluşturma(createSession).kullanıcı kimliğine dayalı bir oturum oluşturulur ve bunu bir çerez olarak saklar
export async function createSession(userId) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); //oturumun sona ereceği zamanı belirler(şu anki tarihten 7 gün sonrası)
    const session=await encrypt({userId,expiresAt}) //kullanıcının kimliğini otrumun bitiş tarihini içeren bir jwt oluşturur
    const cookieStore=await cookies() //tarayıcıdaki çerezleri yönetmek için
    cookieStore.set("session",session, {
        httpOnly:true,
        secure:true,
        expires:expiresAt,
        sameSite:"lax",
        path:"/"
    }) //session adında bir çerez oluşturulur ve jwtyi bu çereze kaydeder httponly çerez sadece sunucu tarafından okunabilir.secure çerez yalnızca https üzerinden gönderilir.expirez çerez 7 gün sonra silinir. samesite lax çerez yalnızca aynı site içinde erişilebilir
    
}