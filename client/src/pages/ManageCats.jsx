import {useState,useEffect} from 'react';
import AdminSidebar from '../components/AdminSidebar.jsx';
import {fetchCats,createCat,deleteCat} from '../services/api.js';

export default function ManageCats(){
    const[catList,setCatList]=useState([]);
    const[loading,setLoading]=useState(true);
    const[savingCat,setSavingCat]=useState(false);
    const[errMsg,setErrMsg]=useState('');
    const[cname,setCname]=useState('');
    const[cdesc,setCdesc]=useState('');

    const loadCategories=async()=>{
        try{
            setLoading(true);
            const data=await fetchCats();
            setCatList(Array.isArray(data)?data:(data.data||[]));
        }catch(err){
            setErrMsg('Failed to load categories');
        }finally{
            setLoading(false);
        }
    };

    useEffect(()=>{
        loadCategories();
    },[]);

    const handleAddCat=async(e)=>{
        e.preventDefault();
        setErrMsg('');
        if(!cname.trim()){
            setErrMsg('Category name is required');
            return;
        }
        try{
            setSavingCat(true);
            await createCat({name:cname.trim(),descript:cdesc.trim()});
            setCname('');
            setCdesc('');
            loadCategories();
        }catch(err){
            setErrMsg(err?.response?.data?.message||'Error adding category');
        }finally{
            setSavingCat(false);
        }
    };

    const handleDelCat=async(id)=>{
        if(!window.confirm('Are you sure you want to delete this category?'))return;
        try{
            await deleteCat(id);
            setCatList((prev)=>prev.filter((c)=>c._id!==id));
        }catch(err){
            alert('Failed to delete category');
        }
    };

    return(
        <div className="d-flex">
            <AdminSidebar/>
            <div className="flex-grow-1 p-4 bg-light min-vh-100">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold m-0 text-dark">Category Management</h2>
                </div>

                {errMsg && <div className="alert alert-danger">{errMsg}</div>}

                <div className="row g-4">
                    <div className="col-md-5">
                        <div className="card shadow-sm border-0 p-4 bg-white">
                            <h5 className="fw-bold mb-3 text-dark">Add New Category</h5>
                            <form onSubmit={handleAddCat}>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Category Name *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="e.g. DevOps & CI/CD"
                                        value={cname}
                                        onChange={(e)=>setCname(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Description</label>
                                    <textarea
                                        rows="3"
                                        className="form-control"
                                        placeholder="Brief description about this topic"
                                        value={cdesc}
                                        onChange={(e)=>setCdesc(e.target.value)}
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary w-100" disabled={savingCat}>
                                    {savingCat ? 'Saving...' : 'Create Category'}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="col-md-7">
                        <div className="card shadow-sm border-0 p-4 bg-white">
                            <h5 className="fw-bold mb-3 text-dark">All Categories ({catList.length})</h5>
                            {loading && <div className="text-center py-4"><div className="spinner-border text-dark"></div></div>}
                            {!loading && (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Category Name</th>
                                                <th>Slug</th>
                                                <th className="text-end">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {catList.length===0?(
                                                <tr>
                                                    <td colSpan="3" className="text-center py-3 text-muted">
                                                        No categories found.
                                                    </td>
                                                </tr>
                                            ):(
                                                catList.map((c)=>(
                                                    <tr key={c._id}>
                                                        <td className="fw-semibold text-dark">{c.name}</td>
                                                        <td><code>{c.slug||c.name.toLowerCase().replace(/\s+/g,'-')}</code></td>
                                                        <td className="text-end">
                                                            <button
                                                                onClick={()=>handleDelCat(c._id)}
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
