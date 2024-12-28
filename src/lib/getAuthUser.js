//sessionda yer alan decrypt fonksiyonu kullanmak istediğimiz fonksiyondur

import { cookies } from "next/headers";
import { decrypt } from "./session";

//ilk adım çerezi okuyoruz 
//oturum bilgisini çözüp kulanıcı bilgilerini döndürür

export default async function getAuthUser(){
    const cookieStore=await cookies()
    const session=cookieStore.get("session")?.value //cookie içinde session adlı çerezi bulmaya çalışır eğer mevcutsa değerini(value) alır 
    if(session) {
        const user=await decrypt(session) //decrypt çağrılarak session çerezindeki şirfeli bilgi çözülür ve kullanıcı bilgisi alınır
        return user
    }

}