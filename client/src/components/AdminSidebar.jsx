import {Link,useNavigate,useLocation} from 'react-router-dom';

export default function AdminSidebar(){
    const navTo=useNavigate();
    const loc=useLocation();

    const doLogout=()=>{
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        navTo('/admin/login');
    };

    return(
        <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark shadow" style={{width:'260px',minHeight:'100vh'}}>
            <Link to="/admin/dashboard" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                <img src="/logo.png" alt="Blogger" width="40" height="40" className="rounded-circle me-2 bg-white p-1"/>
                <span className="fs-5 fw-bold">Admin Panel</span>
            </Link>
            <hr/>
            <ul className="nav nav-pills flex-column mb-auto gap-1">
                <li className="nav-item">
                    <Link to="/admin/dashboard" className={`nav-link text-white ${loc.pathname==='/admin/dashboard'?'active bg-primary':''}`}>
                        <i className="bi bi-speedometer2 me-2"></i>
                        Dashboard
                    </Link>
                </li>
                <li>
                    <Link to="/admin/create" className={`nav-link text-white ${loc.pathname==='/admin/create'?'active bg-primary':''}`}>
                        <i className="bi bi-plus-circle me-2"></i>
                        Create Post
                    </Link>
                </li>
                <li>
                    <Link to="/admin/categories" className={`nav-link text-white ${loc.pathname==='/admin/categories'?'active bg-primary':''}`}>
                        <i className="bi bi-tags me-2"></i>
                        Categories
                    </Link>
                </li>
                <li>
                    <Link to="/admin/authors" className={`nav-link text-white ${loc.pathname==='/admin/authors'?'active bg-primary':''}`}>
                        <i className="bi bi-people me-2"></i>
                        Authors
                    </Link>
                </li>
                <li>
                    <Link to="/" className="nav-link text-white">
                        <i className="bi bi-globe me-2"></i>
                        View Website
                    </Link>
                </li>
            </ul>
            <hr/>
            <button onClick={doLogout} className="btn btn-outline-danger w-100 text-start">
                <i className="bi bi-box-arrow-right me-2"></i>
                Logout
            </button>
        </div>
    );
}
