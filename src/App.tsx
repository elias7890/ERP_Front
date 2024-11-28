import Home from "./pages/home/Home";
import Users from "./pages/users/Users";
import Documentos from "./pages/documentos/Documentos";
import {createBrowserRouter, RouterProvider, Outlet} from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Menu from "./components/menu/Menu"
import Login from "./pages/login/Login";
import "./styles/global.scss";
import Empresas from "./pages/empresas/Empresas";
import Funcionarios from "./pages/funcionarios/Funcionarios";
import Registro from "./pages/registro/Registro";
import Liquidaciones from "./pages/liquidaciones/Liquidaciones";



function App() {

  const Layout = () => {
    return(
      <div className="main">
        <Navbar/>
          <div className="container">
            <div className="menuContainer">
              <Menu/>
            </div>
            <div className="contentContainer">
              <Outlet/>
            </div>
          </div> 
        <Footer/> 
      </div>
    )
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout/>,
      children:[
        {

          path:"/",
          element:<Home/>,

        },
        {

          path:"/Users",
          element:<Users/>,

        },
        {

          path:"/Documentos",
          element:<Documentos/>,

        },
        {

          path:"/Empresas",
          element:<Empresas/>,

        },
        {
          path:"/Funcionarios",
          element:<Funcionarios/>,
        },
        {
          path:"/Registro",
          element:<Registro/>,
        },
        {
          path:"/Liquidaciones",
          element:<Liquidaciones/>,
        },
        
      ]   
    },
    {

      path:"/Login",
      element:<Login/>
      
    }
   

  ]);

  return <RouterProvider router={router}/>
}

export default App
