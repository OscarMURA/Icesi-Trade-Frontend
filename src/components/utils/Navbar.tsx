import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, User, LogOut, MessageSquare, Plus, LogIn, UserPlus } from "lucide-react";

import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback} from "../../components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "../../components/ui/dropdown-menu";

import useAuth from "../../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/g1/losbandalos/Icesi-Trade/login");
  };
  
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(" ").map(word => word[0]).join("").toUpperCase().substring(0, 2);
  };

  const isActive = (path: string) => {
    return location.pathname.includes(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#B5D8E6] shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/g1/losbandalos/Icesi-Trade" className="flex items-center gap-2">
          <ShoppingBag className="h-6 w-6 text-blue-800" />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-800 to-blue-900 bg-clip-text text-transparent">
            Icesi Trade
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/g1/losbandalos/Icesi-Trade" 
            className={`text-sm font-medium transition-colors hover:text-blue-800 ${
              location.pathname === "/g1/losbandalos/Icesi-Trade" ? "text-blue-800" : "text-gray-700"
            }`}
          >
            Inicio
          </Link>
          {user && (
            <>
              <Link 
                to="/g1/losbandalos/Icesi-Trade/products" 
                className={`text-sm font-medium transition-colors hover:text-blue-800 ${
                  isActive("/products") ? "text-blue-800" : "text-gray-700"
                }`}
              >
                Productos
              </Link>
              <Link 
                to="/g1/losbandalos/Icesi-Trade/create-product" 
                className={`text-sm font-medium transition-colors hover:text-blue-800 ${
                  isActive("/create-product") ? "text-blue-800" : "text-gray-700"
                }`}
              >
                Crear Producto
              </Link>
              <Link 
                to="/g1/losbandalos/Icesi-Trade/chat" 
                className={`text-sm font-medium transition-colors hover:text-blue-800 ${
                  isActive("/chat") ? "text-blue-800" : "text-gray-700"
                }`}
              >
                Chat
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full h-10 w-10 p-0">
                  <Avatar className="h-9 w-9 border-2 border-blue-100">
                    <AvatarFallback className="bg-blue-100 text-blue-800">
                      {getInitials(user.name || "Usuario")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[#B5D8E6] border-blue-200 rounded-xl shadow-lg">
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none text-black">{user.name || "Usuario"}</p>
                </div>
                <DropdownMenuSeparator className="bg-blue-200" />
                <DropdownMenuItem asChild>
                  <Link to="/g1/losbandalos/Icesi-Trade/profile" className="cursor-pointer flex items-center text-blue-800 hover:text-blue-900 hover:bg-blue-100">
                    <User className="mr-2 h-4 w-4" />
                    <span>Mi perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/g1/losbandalos/Icesi-Trade/products" className="cursor-pointer flex items-center text-blue-800 hover:text-blue-900 hover:bg-blue-100">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    <span>Productos</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/g1/losbandalos/Icesi-Trade/create-product" className="cursor-pointer flex items-center text-blue-800 hover:text-blue-900 hover:bg-blue-100 md:hidden">
                    <Plus className="mr-2 h-4 w-4" />
                    <span>Crear producto</span>
                  </Link>
                </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                  <Link to="/g1/losbandalos/Icesi-Trade/my-products" className="cursor-pointer flex items-center md:hidden">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    <span>Mis productos</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/g1/losbandalos/Icesi-Trade/chat" className="cursor-pointer flex items-center text-blue-800 hover:text-blue-900 hover:bg-blue-100 md:hidden">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Chat</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-blue-200" />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="cursor-pointer flex items-center text-blue-800 hover:text-blue-900 hover:bg-blue-100"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link to="/g1/losbandalos/Icesi-Trade/login" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">Iniciar sesión</span>
                </Link>
              </Button>
              
              <Button variant="default" className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link to="/g1/losbandalos/Icesi-Trade/register" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  <span className="hidden sm:inline">Registrarse</span>
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}