"use server"; //fonksiyonun sunucu tarafında çalışacağını belirtir 

import bcrypt from "bcrypt"; //Şifrelerin güvenli bir şekilde hashlenmesi için kullanılan bir kütüphane

import { redirect } from "next/navigation";
import { getCollection } from "../lib/db";
import { RegisterFormSchema } from "../lib/rules";

//Kayıt Fonksiyonu Tanımlanması
export async function register(state, formData) {

// Form Verilerinin Doğrulanması
//Form verilerinin şemaya uygun olup olmadığını kontrol eder.
  const validatedFields = RegisterFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });


  if (!validatedFields.success) { //eğer doğrulama başarısızsa
    return {
      errors: validatedFields.error.flatten().fieldErrors, //doğrulama hataları döner
      email: formData.get("email"), //kullanıcı eposta adresini tekrar gösterir formda doldurulmuş şekilde kalması için
    };
  }

//Doğrulanan Verilerin Ayrıştırılması
  const { email, password } = validatedFields.data; //doğrulamadan geçen email ve password değişkenleri elde edilir.

//Kullanıcı Koleksiyonuna Erişim
  const userCollection = await getCollection("users"); //kullanıcıların bulunduğu veri tabanına erişim
  if (!userCollection) return { errors: { email: "Server error!" } };

// E-Posta Kontrolü
  const existingUser = await userCollection.findOne({ email });
  if (existingUser) { //findone:veritabanında belirtilen epostta adresine sahip bir kullanıcı olup olmadığını kontrol eder.
    return {
      errors: {
        email: "Email already exists in our database!", //eğer eposta zaten kayıtşıysa hata mesajı döner
      },
    };
  }

//Şifre Hashleme
  const hashedPassword = await bcrypt.hash(password, 10); //10 salt round değeridir şifre hashleme işlemine eklenen güvenlik katmanı

//kullanıcı verisini veri tabanına ekleme
  const results = await userCollection.insertOne({ //insertone yeni bir kullanıcıyı email ve haslanmis password ile veritabanına ekler
    email,
    password: hashedPassword,
  }); //hashedpass kullanmamızın sebebi düz metin password kullanmak istemiyorzu bu yüzden


  redirect("/dashboard");
}