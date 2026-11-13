import {useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar.jsx';
import {fetchAdminPosts,deletePost} from '../services/api.js';

export default function AdminDashboard(){
    const[admPosts,setAdmPosts]=useState([]);
    const[loadData,setLoadData]=useState(true);
    const[errInfo,setErrInfo]=useState(null);

    const loadPosts=async()=>{
        try{
            setLoadData(true);
            const resData=await fetchAdminPosts();
            setAdmPosts(Array.isArray(resData)?resData:(resData.data||[]));
        }catch(err){
            setErrInfo('Failed to load admin posts. Session might be expired.');
        }finally{
            setLoadData(false);
        }
    };

    useEffect(()=>{
        loadPosts();
    },[]);

    const handleDelete=async(id)=>{
        const confirmed=window.confirm('Are you sure you want to delete this article?');
        if(!confirmed)return;
        try{
            await deletePost(id);
            setAdmPosts((prev)=>prev.filter((p)=>p._id!==id));
        }catch(err){
            alert('Error deleting post');
        }
    };

    const statTot=admPosts.length;
    const statPub=admPosts.filter((p)=>p.status==='published').length;
    const statDft=admPosts.filter((p)=>p.status==='draft').length;
    const statFeat=admPosts.filter((p)=>Boolean(p.featured)).length;

    return(
        <div className="d-flex">
            <AdminSidebar/>
            <div className="flex-grow-1 p-4 bg-light min-vh-100">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold m-0 text-dark">Dashboard Overview</h2>
                    <Link to="/admin/create" className="btn btn-primary">
                        <i className="bi bi-plus-circle me-2"></i>
                        Create New Post
                    </Link>
                </div>

                <div className="row g-3 mb-4">
                    <div className="col-md-3">
                        <div className="card shadow-sm border-0 border-start border-primary border-4 p-3 bg-white">
                            <span className="text-muted small fw-bold text-uppercase">Total Posts</span>
                            <h3 className="fw-bold mt-2 text-dark">{statTot}</h3>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card shadow-sm border-0 border-start border-success border-4 p-3 bg-white">
                            <span className="text-muted small fw-bold text-uppercase">Published</span>
                            <h3 className="fw-bold mt-2 text-success">{statPub}</h3>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card shadow-sm border-0 border-start border-warning border-4 p-3 bg-white">
                            <span className="text-muted small fw-bold text-uppercase">Drafts</span>
                            <h3 className="fw-bold mt-2 text-warning">{statDft}</h3>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card shadow-sm border-0 border-start border-info border-4 p-3 bg-white">
                            <span className="text-muted small fw-bold text-uppercase">Featured</span>
                            <h3 className="fw-bold mt-2 text-info">{statFeat}</h3>
                        </div>
                    </div>
                </div>

                <div className="card shadow-sm border-0 p-4 bg-white">
                    <h4 className="fw-bold mb-3 text-dark">All Articles</h4>
                    {loadData && <div className="text-center py-4"><div className="spinner-border text-dark" role="status"></div></div>}
                    {errInfo && <div className="alert alert-danger">{errInfo}</div>}
                    {!loadData && !errInfo && (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Title</th>
                                        <th>Category</th>
                                        <th>Author</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {admPosts.length===0?(
                                        <tr>
                                            <td colSpan="6" className="text-center py-4 text-muted">
                                                No posts created yet.
                                            </td>
                                        </tr>
                                    ):(
                                        admPosts.map((pst)=>(
                                            <tr key={pst._id}>
                                                <td className="fw-semibold text-dark">{pst.title}</td>
                                                <td><span className="badge bg-secondary">{pst.category}</span></td>
                                                <td>{pst.author}</td>
                                                <td>
                                                    <span className={`badge ${pst.status==='published'?'bg-success':'bg-warning text-dark'}`}>
                                                        {pst.status}
                                                    </span>
                                                </td>
                                                <td className="text-muted small">
                                                    {new Date(pst.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="text-end">
                                                    <Link to={`/admin/edit/${pst._id}`} className="btn btn-outline-dark btn-sm me-2">
                                                        Edit
                                                    </Link>
                                                    <button onClick={()=>handleDelete(pst._id)} className="btn btn-outline-danger btn-sm">
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
