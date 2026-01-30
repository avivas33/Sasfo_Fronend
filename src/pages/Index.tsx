import { Navigate } from "react-router-dom";

const Index = () => {
  // Redirigir a la página de usuarios por defecto
  return <Navigate to="/configuracion/seguridad/usuarios" replace />;
};

export default Index;
