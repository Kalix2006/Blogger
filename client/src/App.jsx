import {BrowserRouter as Router,Routes,Route,useLocation} from 'react-router-dom';
import Home from './pages/home.jsx';
import Blogs from './pages/blogs.jsx';
import Navbar from './components/navbar.jsx';
import CompleteBlog from './pages/FullBlog.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import CreatePost from './pages/CreatePost.jsx';
import EditPost from './pages/EditPost.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function AppContent(){
    const loc=useLocation();
    const isAdmin=loc.pathname.startsWith('/admin')&&loc.pathname!=='/admin/login';
    return(
        <>
            {!loc.pathname.startsWith('/admin') && <Navbar/>}
            {loc.pathname==='/admin/login' && <Navbar/>}
            <div className={isAdmin ? '' : 'container my-4'}>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/blogs" element={<Blogs/>}/>
                    <Route path="/blogs/:id" element={<CompleteBlog/>}/>
                    <Route path="/admin/login" element={<AdminLogin/>}/>
                    <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard/></ProtectedRoute>}/>
                    <Route path="/admin/create" element={<ProtectedRoute><CreatePost/></ProtectedRoute>}/>
                    <Route path="/admin/edit/:id" element={<ProtectedRoute><EditPost/></ProtectedRoute>}/>
                </Routes>
            </div>
        </>
    );
}

function App(){
    return(
        <Router>
            <AppContent/>
        </Router>
    );
}

export default App;
