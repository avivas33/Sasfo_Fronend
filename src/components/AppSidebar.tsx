import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Layout,
  Grid,
  Share2,
  Settings,
  ChevronDown,
  ChevronRight,
  Boxes,
  Network,
  Shield,
  PanelLeftClose,
  PanelLeft,
  LogOut,
  User,
  ChevronUp
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { ScrollArea } from "@radix-ui/themes";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface MenuItemProps {
  title: string;
  icon: any;
  url?: string;
  children?: { title: string; url: string }[];
  isCollapsed: boolean;
}

interface MenuGroupProps {
  title: string;
  icon: any;
  items: { title: string; url: string }[];
  isCollapsed: boolean;
}

const MenuItem = ({ title, icon: Icon, url, children, isCollapsed }: MenuItemProps) => {
  const [isOpen, setIsOpen] = useState(true);

  if (children && children.length > 0) {
    if (isCollapsed) {
      return (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="w-full flex items-center justify-center px-3 py-2 rounded-lg transition-colors hover:bg-gray-100"
                style={{ color: "var(--gray-11)" }}
              >
                <Icon className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex flex-col gap-1 p-2">
              <span className="font-medium text-sm">{title}</span>
              <div className="flex flex-col gap-1">
                {children.map((child) => (
                  <NavLink
                    key={child.title}
                    to={child.url}
                    className="text-xs hover:text-green-600 py-1"
                  >
                    {child.title}
                  </NavLink>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <button
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors hover:bg-gray-100"
            style={{ color: "var(--gray-11)" }}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{title}</span>
            </div>
            <ChevronDown
              className={cn("w-4 h-4 transition-transform", isOpen && "transform rotate-180")}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-6 mt-1 space-y-1">
          {children.map((child) => (
            <NavLink
              key={child.title}
              to={child.url}
              className="block px-3 py-2 rounded-lg text-sm transition-colors hover:bg-gray-50"
            >
              {({ isActive }) => (
                <span
                  className="text-sm"
                  style={{
                    color: isActive ? "var(--green-11)" : "var(--gray-11)",
                    fontWeight: isActive ? "500" : "400"
                  }}
                >
                  {child.title}
                </span>
              )}
            </NavLink>
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <NavLink
              to={url || "/"}
              className="flex items-center justify-center px-3 py-2 rounded-lg transition-colors hover:bg-gray-100"
            >
              {({ isActive }) => (
                <Icon
                  className="w-5 h-5"
                  style={{ color: isActive ? "var(--green-11)" : "var(--gray-11)" }}
                />
              )}
            </NavLink>
          </TooltipTrigger>
          <TooltipContent side="right">
            {title}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <NavLink
      to={url || "/"}
      className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-gray-100"
    >
      {({ isActive }) => (
        <div className="flex items-center gap-3 w-full">
          <Icon
            className="w-4 h-4"
            style={{ color: isActive ? "var(--green-11)" : "var(--gray-11)" }}
          />
          <span
            className="text-sm"
            style={{
              color: isActive ? "var(--green-11)" : "var(--gray-11)",
              fontWeight: isActive ? "500" : "400"
            }}
          >
            {title}
          </span>
        </div>
      )}
    </NavLink>
  );
};

const MenuGroup = ({ title, icon: Icon, items, isCollapsed }: MenuGroupProps) => {
  const [isOpen, setIsOpen] = useState(true);

  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="w-full flex items-center justify-center px-3 py-2 rounded-lg transition-colors hover:bg-gray-100"
              style={{ color: "var(--gray-11)" }}
            >
              <Icon className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="flex flex-col gap-1 p-2">
            <span className="font-medium text-sm">{title}</span>
            <div className="flex flex-col gap-1">
              {items.map((item) => (
                <NavLink
                  key={item.title}
                  to={item.url}
                  className="text-xs hover:text-green-600 py-1"
                >
                  {item.title}
                </NavLink>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors hover:bg-gray-100"
          style={{ color: "var(--gray-11)" }}
        >
          <div className="flex items-center gap-3">
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{title}</span>
          </div>
          <ChevronDown
            className={cn("w-4 h-4 transition-transform", isOpen && "transform rotate-180")}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-6 mt-1 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className="block px-3 py-2 rounded-lg text-sm transition-colors hover:bg-gray-50"
          >
            {({ isActive }) => (
              <span
                className="text-sm"
                style={{
                  color: isActive ? "var(--green-11)" : "var(--gray-11)",
                  fontWeight: isActive ? "500" : "400"
                }}
              >
                {item.title}
              </span>
            )}
          </NavLink>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout, permissions, hasPermission } = useAuth();
  const navigate = useNavigate();

  // Si es Admin, tiene acceso a todo
  const isAdmin = permissions?.EsAdmin ?? false;

  // Función para verificar si se debe mostrar un elemento del menú
  const canShow = (menuName: string): boolean => {
    if (isAdmin) return true;
    return hasPermission(menuName);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Sesión cerrada exitosamente");
      navigate("/login");
    } catch (error) {
      toast.error("Error al cerrar sesión");
    }
  };

  return (
    <div
      className={cn(
        "bg-white border-r h-screen flex flex-col transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
      style={{ borderColor: "var(--gray-6)" }}
    >
      {/* Logo Header */}
      <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: "var(--gray-6)" }}>
        {!isCollapsed && (
          <img
            src="/panama-pacifico-logo-1.svg"
            alt="Panamá Pacífico"
            className="h-10 object-contain"
          />
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "p-2 rounded-lg hover:bg-gray-100 transition-colors",
            isCollapsed && "mx-auto"
          )}
          style={{ color: "var(--gray-11)" }}
          title={isCollapsed ? "Expandir menú" : "Colapsar menú"}
        >
          {isCollapsed ? (
            <PanelLeft className="w-5 h-5" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Menu Items */}
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="py-4 px-2 space-y-1">
          {/* Gestión de P2P */}
          {(() => {
            const items = [
              { title: "Viabilidades P2P", url: "/viabilidades/p2p" },
              { title: "Postes/Camaras", url: "/viabilidades/p2p-postes" },
            ].filter(item => canShow(item.title));
            return items.length > 0 && (
              <MenuItem
                title="Gestión de P2P"
                icon={Layout}
                isCollapsed={isCollapsed}
                children={items}
              />
            );
          })()}

          {/* Gestión de Viabilidades */}
          {(() => {
            const items = [
              { title: "Viabilidades", url: "/viabilidades" },
              { title: "Ordenes de Servicios", url: "/viabilidades/ordenes" },
            ].filter(item => canShow(item.title));
            return items.length > 0 && (
              <MenuItem
                title="Gestión de Viabilidades"
                icon={Layout}
                isCollapsed={isCollapsed}
                children={items}
              />
            );
          })()}

          {/* Gestión de Servicios */}
          {(() => {
            const items = [
              { title: "Fibra Optica Oscura", url: "/servicios/fibra-optica" },
              { title: "Contabilizar Servicios", url: "/servicios/contabilizar" },
              { title: "Otros Servicios MRC", url: "/servicios/otros-servicios-mrc" },
              { title: "Circuitos Vetro", url: "/servicios/circuitos-vetro" },
              { title: "Consulta ODF Internos", url: "/servicios/odf-internos" },
              { title: "Cotización Especial", url: "/servicios/cotizacion-especial" },
              { title: "Facturación Hansa", url: "/servicios/facturacion-hansa" },
            ].filter(item => canShow(item.title));
            return items.length > 0 && (
              <MenuItem
                title="Gestión de Servicios"
                icon={Grid}
                isCollapsed={isCollapsed}
                children={items}
              />
            );
          })()}

          {/* Gestión de Catálogos */}
          <CatalogosMenu isCollapsed={isCollapsed} canShow={canShow} />

          {/* Configuración */}
          <ConfiguracionMenu isCollapsed={isCollapsed} canShow={canShow} />
        </div>
      </ScrollArea>

      {/* User Section */}
      {user && (
        <div className="border-t p-2" style={{ borderColor: "var(--gray-6)" }}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-gray-100",
                  isCollapsed && "justify-center"
                )}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
                {!isCollapsed && (
                  <>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "var(--gray-12)" }}>
                        {user.Nombre || user.Username}
                      </p>
                      <p className="text-xs truncate" style={{ color: "var(--gray-11)" }}>
                        {user.RolNombre || "Usuario"}
                      </p>
                    </div>
                    <ChevronUp className="w-4 h-4 flex-shrink-0" style={{ color: "var(--gray-11)" }} />
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user.Nombre || user.Username}</p>
                <p className="text-xs text-gray-500">{user.Email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}

const CatalogosMenu = ({ isCollapsed, canShow }: { isCollapsed: boolean; canShow: (menuName: string) => boolean }) => {
  const [isOpen, setIsOpen] = useState(true);

  // Filtrar items de Catálogos Comunes
  const comunesItems = [
    { title: "Empresas", url: "/catalogos/comunes/empresas" },
    { title: "Contactos", url: "/catalogos/comunes/contactos" },
    { title: "Areas de Desarrollo", url: "/catalogos/comunes/areas-desarrollo" },
    { title: "Contratistas", url: "/catalogos/comunes/contratistas" },
  ].filter(item => canShow(item.title));

  // Filtrar items de Catálogos Viabilidad
  const viabilidadItems = [
    { title: "Modulos", url: "/catalogos/viabilidad/modulos" },
    { title: "Compañia de Enlaces", url: "/catalogos/viabilidad/compania-enlaces" },
    { title: "Lista de Ubicaciones", url: "/catalogos/viabilidad/ubicaciones" },
    { title: "ODF", url: "/catalogos/viabilidad/odf" },
    { title: "Tipos de Conexión", url: "/catalogos/viabilidad/tipos-conexion" },
    { title: "Tipos de Enlaces", url: "/catalogos/viabilidad/tipos-enlaces" },
    { title: "Tecnicos", url: "/catalogos/viabilidad/tecnicos" },
    { title: "Servicios", url: "/catalogos/viabilidad/servicios" },
    { title: "Otros Servicios", url: "/catalogos/viabilidad/otros-servicios" },
  ].filter(item => canShow(item.title));

  // Si no hay items visibles, no mostrar el menú
  if (comunesItems.length === 0 && viabilidadItems.length === 0) {
    return null;
  }

  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="w-full flex items-center justify-center px-3 py-2 rounded-lg transition-colors hover:bg-gray-100"
              style={{ color: "var(--gray-11)" }}
            >
              <Share2 className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="flex flex-col gap-2 p-3 max-w-xs">
            <span className="font-medium text-sm">Gestión de Catálogos</span>
            <div className="space-y-2">
              {comunesItems.length > 0 && (
                <div>
                  <span className="text-xs font-medium text-gray-500">Comunes</span>
                  <div className="flex flex-col gap-1 mt-1">
                    {comunesItems.map(item => (
                      <NavLink key={item.title} to={item.url} className="text-xs hover:text-green-600">{item.title}</NavLink>
                    ))}
                  </div>
                </div>
              )}
              {viabilidadItems.length > 0 && (
                <div>
                  <span className="text-xs font-medium text-gray-500">Viabilidad</span>
                  <div className="flex flex-col gap-1 mt-1">
                    {viabilidadItems.map(item => (
                      <NavLink key={item.title} to={item.url} className="text-xs hover:text-green-600">{item.title}</NavLink>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors hover:bg-gray-100"
          style={{ color: "var(--gray-11)" }}
        >
          <div className="flex items-center gap-3">
            <Share2 className="w-4 h-4" />
            <span className="text-sm font-medium">Gestión de Catálogos</span>
          </div>
          <ChevronDown
            className={cn("w-4 h-4 transition-transform", isOpen && "transform rotate-180")}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-6 mt-1 space-y-1">
        {/* Comunes */}
        {comunesItems.length > 0 && (
          <MenuGroup
            title="Comunes"
            icon={Boxes}
            isCollapsed={false}
            items={comunesItems}
          />
        )}

        {/* Viabilidad */}
        {viabilidadItems.length > 0 && (
          <MenuGroup
            title="Viabilidad"
            icon={Network}
            isCollapsed={false}
            items={viabilidadItems}
          />
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

const ConfiguracionMenu = ({ isCollapsed, canShow }: { isCollapsed: boolean; canShow: (menuName: string) => boolean }) => {
  const [isOpen, setIsOpen] = useState(true);

  // Filtrar items de Seguridad
  const seguridadItems = [
    { title: "Roles", url: "/configuracion/seguridad/roles" },
    { title: "Usuarios", url: "/configuracion/seguridad/usuarios" },
  ].filter(item => canShow(item.title));

  // Verificar Interface de Propietario
  const showInterfacePropietario = canShow("Interface de Propietario");

  // Si no hay items visibles, no mostrar el menú
  if (seguridadItems.length === 0 && !showInterfacePropietario) {
    return null;
  }

  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="w-full flex items-center justify-center px-3 py-2 rounded-lg transition-colors hover:bg-gray-100"
              style={{ color: "var(--gray-11)" }}
            >
              <Settings className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="flex flex-col gap-2 p-3">
            <span className="font-medium text-sm">Configuración</span>
            <div className="space-y-2">
              {seguridadItems.length > 0 && (
                <div>
                  <span className="text-xs font-medium text-gray-500">Seguridad</span>
                  <div className="flex flex-col gap-1 mt-1">
                    {seguridadItems.map(item => (
                      <NavLink key={item.title} to={item.url} className="text-xs hover:text-green-600">{item.title}</NavLink>
                    ))}
                  </div>
                </div>
              )}
              {showInterfacePropietario && (
                <NavLink to="/configuracion/interface-propietario" className="text-xs hover:text-green-600">Interface de Propietario</NavLink>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors hover:bg-gray-100"
          style={{ color: "var(--gray-11)" }}
        >
          <div className="flex items-center gap-3">
            <Settings className="w-4 h-4" />
            <span className="text-sm font-medium">Configuración</span>
          </div>
          <ChevronDown
            className={cn("w-4 h-4 transition-transform", isOpen && "transform rotate-180")}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-6 mt-1 space-y-1">
        {/* Seguridad */}
        {seguridadItems.length > 0 && (
          <MenuGroup
            title="Seguridad"
            icon={Shield}
            isCollapsed={false}
            items={seguridadItems}
          />
        )}

        {/* Interface de Propietario */}
        {showInterfacePropietario && (
          <NavLink
            to="/configuracion/interface-propietario"
            className="block px-3 py-2 rounded-lg text-sm transition-colors hover:bg-gray-50"
          >
            {({ isActive }) => (
              <span
                className="text-sm"
                style={{
                  color: isActive ? "var(--green-11)" : "var(--gray-11)",
                  fontWeight: isActive ? "500" : "400"
                }}
              >
                Interface de Propietario
              </span>
            )}
          </NavLink>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};
