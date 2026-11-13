import {useState,useEffect} from 'react';
import AdminSidebar from '../components/AdminSidebar.jsx';
import {fetchAuthors,createAuthor,deleteAuthor} from '../services/api.js';

export default function ManageAuthors(){
    const[authList,setAuthList]=useState([]);
    const[loading,setLoading]=useState(true);
    const[savingAuth,setSavingAuth]=useState(false);
    const[errMsg,setErrMsg]=useState('');
    const[aname,setAname]=useState('');
    const[aemail,setAemail]=useState('');
    const[abio,setAbio]=useState('');

    const loadAuthors=async()=>{
        try{
            setLoading(true);
            const data=await fetchAuthors();
            setAuthList(Array.isArray(data)?data:(data.data||[]));
        }catch(err){
            setErrMsg('Failed to load authors');
        }finally{
            setLoading(false);
        }
    };

    useEffect(()=>{
        loadAuthors();
    },[]);

    const handleAddAuthor=async(e)=>{
        e.preventDefault();
        setErrMsg('');
        if(!aname.trim()||!aemail.trim()){
            setErrMsg('Name and email are required');
            return;
        }
        try{
            setSavingAuth(true);
            await createAuthor({
                name:aname.trim(),
                email:aemail.trim(),
                bio:abio.trim()
            });
            setAname('');
            setAemail('');
            setAbio('');
            loadAuthors();
        }catch(err){
            setErrMsg(err?.response?.data?.message||'Error adding author');
        }finally{
            setSavingAuth(false);
        }
    };

    const handleDelAuthor=async(id)=>{
        if(!window.confirm('Are you sure you want to delete this author?'))return;
        try{
            await deleteAuthor(id);
            setAuthList((prev)=>prev.filter((a)=>a._id!==id));
        }catch(err){
            alert('Failed to delete author');
        }
    };

    return(
        <div className="d-flex">
            <AdminSidebar/>
            <div className="flex-grow-1 p-4 bg-light min-vh-100">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold m-0 text-dark">Author Management</h2>
                </div>

                {errMsg && <div className="alert alert-danger">{errMsg}</div>}

                <div className="row g-4">
                    <div className="col-md-5">
                        <div className="card shadow-sm border-0 p-4 bg-white">
                            <h5 className="fw-bold mb-3 text-dark">Add New Author</h5>
                            <form onSubmit={handleAddAuthor}>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Author Name *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Full name"
                                        value={aname}
                                        onChange={(e)=>setAname(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Email Address *</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="author@example.com"
                                        value={aemail}
                                        onChange={(e)=>setAemail(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Bio / Role</label>
                                    <textarea
                                        rows="3"
                                        className="form-control"
                                        placeholder="Author biography or job title"
                                        value={abio}
                                        onChange={(e)=>setAbio(e.target.value)}
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary w-100" disabled={savingAuth}>
                                    {savingAuth ? 'Saving...' : 'Add Author'}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="col-md-7">
                        <div className="card shadow-sm border-0 p-4 bg-white">
                            <h5 className="fw-bold mb-3 text-dark">All Authors ({authList.length})</h5>
                            {loading && <div className="text-center py-4"><div className="spinner-border text-dark"></div></div>}
                            {!loading && (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Bio</th>
                                                <th className="text-end">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {authList.length===0?(
                                                <tr>
                                                    <td colSpan="4" className="text-center py-3 text-muted">
                                                        No authors registered yet.
                                                    </td>
                                                </tr>
                                            ):(
                                                authList.map((a)=>(
                                                    <tr key={a._id}>
                                                        <td className="fw-semibold text-dark">
                                                            <i className="bi bi-person-circle me-2 text-secondary"></i>
                                                            {a.name}
                                                        </td>
                                                        <td className="small text-muted">{a.email}</td>
                                                        <td className="small text-secondary">{a.bio||'-'}</td>
                                                        <td className="text-end">
                                                            <button
                                                                onClick={()=>handleDelAuthor(a._id)}
                                                                className="btn btn-outline-danger btn-sm"
                                                            >
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
            </div>
        </div>
    );
}
