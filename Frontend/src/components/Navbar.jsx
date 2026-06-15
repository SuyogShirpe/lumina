import { useAuth } from "./AuthProvider";

export default function Navbar() {
    const { user } = useAuth();

    {user?.role === 'ADMIN' && <link to='/admin'>Admin</link>}

}