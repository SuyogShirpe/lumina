import { Outlet } from "react-router-dom";
import CategoriesProvider from "../contexts/CategoriesProvider";
import Navbar from "./Navbar";

export default function ProtectedLayout(){
    return (
        <CategoriesProvider>
            <Navbar />
            <Outlet />
        </CategoriesProvider>
    )
}