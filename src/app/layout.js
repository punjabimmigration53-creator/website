import "./globals.css";
import "./redesign.css";
import "./inner.css";
import "./home.css";
import "./pages.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsappFloat from "@/components/WhatsappFloat";
import Effects from "@/components/Effects";
import Loader from "@/components/Loader";
import CustomCursor from "@/components/CustomCursor";
import Script from "next/script";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, SITE_NAME, OG_IMAGE, localBusinessLd } from "@/lib/site";

const TITLE = "Punjab Immigration | Study, Work & PR Visa Consultants in Amritsar";
const DESCRIPTION = "Trusted visa consultants in Amritsar for Study, Work, PR and Visitor visas to Canada, UK, Australia, USA and Europe. Book your free assessment today.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: `%s | ${SITE_NAME}` },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE, description: DESCRIPTION, url: "/", siteName: SITE_NAME, type: "website", locale: "en_IN",
    images: [{ url: OG_IMAGE }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [OG_IMAGE] },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
};

export const viewport = {
  themeColor: "#06122e",
};

// Runs before paint: enables reveal animations and skips the intro on repeat visits.
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('pi-intro')==='1')d.classList.add('pi-no-intro')}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=Instrument+Serif:ital@1&family=JetBrains+Mono:wght@500&family=Manrope:wght@400;500;600;700;800&family=Poppins:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body>
        <Script id="pi-boot" strategy="beforeInteractive">{bootScript}</Script>
        <JsonLd data={localBusinessLd} />
        <Loader />
        <Navbar />
        {children}
        <WhatsappFloat />
        <Footer />
        <Effects />
        <CustomCursor />
      </body>
    </html>
  );
}
