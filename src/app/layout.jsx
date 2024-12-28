import Footer from "../components/Footer";
import Navigation from "../components/Navigation";
import "./globals.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins", //tailwind css örneği
  weight: ["200", "400", "700"],
});
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans`}>
        {" "}
        {/*sınıf adı değişken olucak $ ile.yedek fontları font-sans içerecek*/}
        <header>
          <Navigation />
        </header>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
