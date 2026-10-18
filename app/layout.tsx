import type { Metadata } from "next";
import "./globals.css";
import PwaRegister from "@/components/pwa-register";
export const metadata:Metadata={title:"Asesor Financiero",description:"Tu panorama financiero, claro y bajo control.",applicationName:"Asesor Financiero",manifest:"/manifest.webmanifest",appleWebApp:{capable:true,statusBarStyle:"default",title:"Finanzas"},icons:{icon:"/icon.svg",apple:"/apple-touch-icon.png"}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body><PwaRegister/>{children}</body></html>}
