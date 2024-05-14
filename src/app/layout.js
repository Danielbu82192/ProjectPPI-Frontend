import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/component/sidebar/sidebarDocente";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "T&T / Gestión del PPI",
  description: "La web de Gestión Documental y Seguimiento Académico de Proyectos Pedagógicos Integradores (PPI) del Politécnico Colombiano JIC proporciona un conjunto de endpoints diseñados para facilitar la administración y seguimiento de los PPIs en el contexto de la Técnica y Tecnología en Sistematización de Datos.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Sidebar>
          {children}
        </Sidebar>
      </body>
    </html>
  );
}
