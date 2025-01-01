//ara yazılım kullanarak belirli rotaları korumak.dosya ismi middleware olmak zorunda

import { NextResponse } from "next/server"
import getAuthUser from "./lib/getAuthUser"

const protectedRoutes=["/dashboard", "/posts/create"]
const publicRoutes=["/login", "/register"]
export default async function middleware(req) {
//kullanıcının nereye gittmeye çalıştığını bulmak için
const path=req.nextUrl.pathname //isteğin urlindeki yol alınır
const isProtected=
protectedRoutes.includes(path) || path.startsWith("/posts/edit/")
const isPublic=publicRoutes.includes(path) //gelen yol isprotected içinde yer alıyorsa yada /posts/edit/ ile başlıyorsa bu rota korumalıdır. isPublic gelen yol publicroutes içinde yer alıyorsa bu rota genel erişime açıktır.

const user=await getAuthUser()
const userId=user?.userId //kullanıcı oturum açmaışsa userId değeri und olacak

//korunan rotaya erişim kontrolü
if(isProtected && !userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl)) //rota isProtected ise ve kullanıcı oturum açmamışsa kullanıcı logine yönlendirilir

}
if(isPublic && userId) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl)) //isPublic true ise ve kullanıcı oturum açmışsa /dashboarda yöndendirilir.
}
//yukarıdaki koşulların hiçbiri sağlamamışsa
return NextResponse.next() //kullanıcı mevcut rotaya erişebilir ve işlem devam eder

}

export const config = {
    matcher: [
      "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
  };
//matcher middlewarein hangi yollar için çalışacağını tanımlar.  yollar hariç tutuluyor: api: API rotaları._next/static ve _next/image: Next.js'in statik dosyaları ve görüntü servisleri.favicon.ico, sitemap.xml, robots.txt: Genel erişime açık olan belirli dosyalar.