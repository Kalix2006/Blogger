import {Navigate} from 'react-router-dom';

export default function ProtectedRoute({children}){
    const userTok=sessionStorage.getItem('token');
    if(!userTok){
        return <Navigate to="/admin/login" replace/>;
    }
    return children;
}
