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
    const statSched=admPosts.filter((p)=>p.status==='scheduled').length;

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
                            <span className="text-muted small fw-bold text-uppercase">Scheduled</span>
                            <h3 className="fw-bold mt-2 text-info">{statSched}</h3>
                        </div>
                    </div>
                </div>

                <div className="card shadow-sm border-0 p-4 bg-white">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="fw-bold m-0 text-dark">All Articles</h4>
                        <button onClick={loadPosts} className="btn btn-outline-secondary btn-sm">
                            <i className="bi bi-arrow-clockwise me-1"></i> Refresh
                        </button>
                    </div>
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
                                                <td className="fw-semibold text-dark">
                                                    {pst.title}
                                                    {pst.featured && <span className="badge bg-danger ms-2">Featured</span>}
                                                </td>
                                                <td><span className="badge bg-secondary">{pst.category}</span></td>
                                                <td>{pst.author}</td>
                                                <td>
                                                    {pst.status==='published' && (
                                                        <span className="badge bg-success">Published</span>
                                                    )}
                                                    {pst.status==='draft' && (
                                                        <span className="badge bg-warning text-dark">Draft</span>
                                                    )}
                                                    {pst.status==='scheduled' && (
                                                        <span className="badge bg-info text-dark" title={`Scheduled: ${new Date(pst.scheduledAt).toLocaleString()}`}>
                                                            Scheduled ({pst.scheduledAt ? new Date(pst.scheduledAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) : 'later'})
                                                        </span>
                                                    )}
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
