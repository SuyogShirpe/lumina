import { Outlet } from "react-router-dom";
import CategoriesProvider from "../contexts/CategoriesProvider";

export default function ProtectedLayout(){
    return (
        <CategoriesProvider>
            <Outlet></Outlet>
        </CategoriesProvider>
    )
}