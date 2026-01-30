import { Theme } from "@radix-ui/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Empresas from "./pages/Empresas";
import AreasDesarrollo from "./pages/AreasDesarrollo";
import Contactos from "./pages/Contactos";
import Contratistas from "./pages/Contratistas";
import Viabilidades from "./pages/Viabilidades";
import NuevaSolicitudViabilidad from "./pages/NuevaSolicitudViabilidad";
import Modulos from "./pages/Modulos";
import CO from "./pages/CO";
import ListaUbicaciones from "./pages/ListaUbicaciones";
import ODF from "./pages/ODF";
import TipoConexion from "./pages/TipoConexion";
import TipoEnlace from "./pages/TipoEnlace";
import Servicios from "./pages/Servicios";
import OtrosServicios from "./pages/OtrosServicios";
import Circuitos from "./pages/Circuitos";
import Enlaces from "./pages/Enlaces";
import Usuarios from "./pages/Usuarios";
import Roles from "./pages/Roles";
import InterfacePropietario from "./pages/InterfacePropietario";
import Ordenes from "./pages/Ordenes";
import OrdenEditar from "./pages/OrdenEditar";
import P2P from "./pages/P2P";
import NuevoP2P from "./pages/NuevoP2P";
import PostesCamaras from "./pages/PostesCamaras";
import NuevoPosteCamara from "./pages/NuevoPosteCamara";
import ContabilizarServicios from "./pages/ContabilizarServicios";
import OtrosServiciosMRC from "./pages/OtrosServiciosMRC";
import CircuitosVetro from "./pages/CircuitosVetro";
import ODFInternos from "./pages/ODFInternos";
import CotizacionEspecial from "./pages/CotizacionEspecial";
import Tecnicos from "./pages/Tecnicos";
import FacturacionHansa from "./pages/FacturacionHansa";
import NotFound from "./pages/NotFound";
import "./styles/theme-override.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <Theme accentColor="green" grayColor="slate" radius="medium" scaling="100%">
        <BrowserRouter>
          <Routes>
            {/* Ruta pública */}
            <Route path="/login" element={<Login />} />

            {/* Rutas protegidas */}
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/catalogos/comunes/empresas" element={<ProtectedRoute><Empresas /></ProtectedRoute>} />
            <Route path="/catalogos/comunes/areas-desarrollo" element={<ProtectedRoute><AreasDesarrollo /></ProtectedRoute>} />
            <Route path="/catalogos/comunes/contactos" element={<ProtectedRoute><Contactos /></ProtectedRoute>} />
            <Route path="/catalogos/comunes/contratistas" element={<ProtectedRoute><Contratistas /></ProtectedRoute>} />
            <Route path="/viabilidades" element={<ProtectedRoute><Viabilidades /></ProtectedRoute>} />
            <Route path="/viabilidades/nueva-solicitud" element={<ProtectedRoute><NuevaSolicitudViabilidad /></ProtectedRoute>} />
            <Route path="/viabilidades/ordenes" element={<ProtectedRoute><Ordenes /></ProtectedRoute>} />
            <Route path="/viabilidades/ordenes/editar" element={<ProtectedRoute><OrdenEditar /></ProtectedRoute>} />
            <Route path="/viabilidades/p2p" element={<ProtectedRoute><P2P /></ProtectedRoute>} />
            <Route path="/viabilidades/p2p/nuevo" element={<ProtectedRoute><NuevoP2P /></ProtectedRoute>} />
            <Route path="/viabilidades/p2p-postes" element={<ProtectedRoute><PostesCamaras /></ProtectedRoute>} />
            <Route path="/viabilidades/p2p-postes/nuevo" element={<ProtectedRoute><NuevoPosteCamara /></ProtectedRoute>} />
            <Route path="/catalogos/viabilidad/modulos" element={<ProtectedRoute><Modulos /></ProtectedRoute>} />
            <Route path="/catalogos/viabilidad/compania-enlaces" element={<ProtectedRoute><CO /></ProtectedRoute>} />
            <Route path="/catalogos/viabilidad/ubicaciones" element={<ProtectedRoute><ListaUbicaciones /></ProtectedRoute>} />
            <Route path="/catalogos/viabilidad/odf" element={<ProtectedRoute><ODF /></ProtectedRoute>} />
            <Route path="/catalogos/viabilidad/tipos-conexion" element={<ProtectedRoute><TipoConexion /></ProtectedRoute>} />
            <Route path="/catalogos/viabilidad/tipos-enlaces" element={<ProtectedRoute><TipoEnlace /></ProtectedRoute>} />
            <Route path="/catalogos/viabilidad/servicios" element={<ProtectedRoute><Servicios /></ProtectedRoute>} />
            <Route path="/catalogos/viabilidad/otros-servicios" element={<ProtectedRoute><OtrosServicios /></ProtectedRoute>} />
            <Route path="/catalogos/viabilidad/circuitos" element={<ProtectedRoute><Circuitos /></ProtectedRoute>} />
            <Route path="/servicios/fibra-optica" element={<ProtectedRoute><Enlaces /></ProtectedRoute>} />
            <Route path="/servicios/contabilizar" element={<ProtectedRoute><ContabilizarServicios /></ProtectedRoute>} />
            <Route path="/servicios/otros-servicios-mrc" element={<ProtectedRoute><OtrosServiciosMRC /></ProtectedRoute>} />
            <Route path="/servicios/circuitos-vetro" element={<ProtectedRoute><CircuitosVetro /></ProtectedRoute>} />
            <Route path="/servicios/odf-internos" element={<ProtectedRoute><ODFInternos /></ProtectedRoute>} />
            <Route path="/servicios/cotizacion-especial" element={<ProtectedRoute><CotizacionEspecial /></ProtectedRoute>} />
            <Route path="/servicios/facturacion-hansa" element={<ProtectedRoute><FacturacionHansa /></ProtectedRoute>} />
            <Route path="/configuracion/seguridad/usuarios" element={<ProtectedRoute><Usuarios /></ProtectedRoute>} />
            <Route path="/configuracion/seguridad/roles" element={<ProtectedRoute><Roles /></ProtectedRoute>} />
            <Route path="/configuracion/interface-propietario" element={<ProtectedRoute><InterfacePropietario /></ProtectedRoute>} />
            <Route path="/configuracion/tecnicos" element={<ProtectedRoute><Tecnicos /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="bottom-right" richColors />
      </Theme>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
