import Link from "next/link";
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
          <nav>
            <Link className="nav-link" href="/">
              Home
            </Link>
            <div>
              <Link className="nav-link" href="/dashboard">
                Dashboard
              </Link>
              <Link className="nav-link" href="/register">
                Register
              </Link>
            </div>
          </nav>
        </header>
        <main>{children}</main>
        <footer>footer</footer>
      </body>
    </html>
  );
}
