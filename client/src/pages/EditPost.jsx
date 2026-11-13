import {useState,useEffect} from 'react';
import {useParams,useNavigate} from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar.jsx';
import {fetchPID,updatePost} from '../services/api.js';

export default function EditPost(){
    const{id}=useParams();
    const navTo=useNavigate();
    const[loadingInit,setLoadingInit]=useState(true);
    const[savingNow,setSavingNow]=useState(false);
    const[editErr,setEditErr]=useState('');
    const[currPost,setCurrPost]=useState({
        title:'',
        descript:'',
        content:'',
        category:'Technology & Innovation',
        author:'',
        image:'',
        status:'draft',
        featured:false
    });

    const cats=[
        "Software Development",
        "Artificial Intelligence & Machine Learning",
        "Web and Mobile App Development",
        "Technology & Innovation",
        "Cybersecurity",
        "Cloud Computing",
        "Industry Insights"
    ];

    useEffect(()=>{
        const loadSinglePost=async()=>{
            try{
                setLoadingInit(true);
                const data=await fetchPID(id);
                if(data){
                    setCurrPost({
                        title:data.title||'',
                        descript:data.descript||'',
                        content:data.content||'',
                        category:data.category||'Technology & Innovation',
                        author:data.author||'',
                        image:data.image||'',
                        status:data.status||'draft',
                        featured:Boolean(data.featured)
                    });
                }
            }catch(err){
                setEditErr('Could not find article or session expired');
            }finally{
                setLoadingInit(false);
            }
        };
        loadSinglePost();
    },[id]);

    const changeField=(e)=>{
        const{name,value,type,checked}=e.target;
        setCurrPost((prev)=>({
            ...prev,
            [name]:type==='checkbox'?checked:value
        }));
    };

    const saveArticle=async(newStatus)=>{
        setEditErr('');
        if(!currPost.title||!currPost.descript||!currPost.content||!currPost.author){
            setEditErr('Please fill all required fields');
            return;
        }
        try{
            setSavingNow(true);
            const sendObj={
                ...currPost,
                status:newStatus||currPost.status
            };
            await updatePost(id,sendObj);
            navTo('/admin/dashboard');
        }catch(err){
            setEditErr(err?.response?.data?.message||'Failed to update post');
        }finally{
            setSavingNow(false);
        }
    };

    return(
        <div className="d-flex">
            <AdminSidebar/>
            <div className="flex-grow-1 p-4 bg-light min-vh-100">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold m-0 text-dark">Edit Article</h2>
                </div>

                <div className="card shadow-sm border-0 p-4 bg-white" style={{maxWidth:'850px'}}>
                    {loadingInit && <div className="text-center py-4"><div className="spinner-border text-dark" role="status"></div></div>}
                    {editErr && <div className="alert alert-danger">{editErr}</div>}
                    {!loadingInit && (
                        <form onSubmit={(e)=>e.preventDefault()}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Article Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    className="form-control"
                                    value={currPost.title}
                                    onChange={changeField}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Description *</label>
                                <textarea
                                    name="descript"
                                    rows="3"
                                    className="form-control"
                                    value={currPost.descript}
                                    onChange={changeField}
                                ></textarea>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Content *</label>
                                <textarea
                                    name="content"
                                    rows="8"
                                    className="form-control"
                                    value={currPost.content}
                                    onChange={changeField}
                                ></textarea>
                            </div>

                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Category *</label>
                                    <select
                                        name="category"
                                        className="form-select"
                                        value={currPost.category}
                                        onChange={changeField}
                                    >
                                        {cats.map((c,i)=>(
                                            <option key={i} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Author *</label>
                                    <input
                                        type="text"
                                        name="author"
                                        className="form-control"
                                        value={currPost.author}
                                        onChange={changeField}
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Image URL</label>
                                <input
                                    type="url"
                                    name="image"
                                    className="form-control"
                                    value={currPost.image}
                                    onChange={changeField}
                                />
                            </div>

                            <div className="row g-3 mb-4 align-items-center">
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Current Status</label>
                                    <select
                                        name="status"
                                        className="form-select"
                                        value={currPost.status}
                                        onChange={changeField}
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                    </select>
                                </div>
                                <div className="col-md-6 pt-4">
                                    <div className="form-check form-switch">
                                        <input
                                            type="checkbox"
                                            name="featured"
                                            id="editFeatCheck"
                                            className="form-check-input"
                                            checked={currPost.featured}
                                            onChange={changeField}
                                        />
                                        <label className="form-check-label fw-semibold" htmlFor="editFeatCheck">
                                            Mark as Featured
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex gap-2">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    disabled={savingNow}
                                    onClick={()=>saveArticle(currPost.status)}
                                >
                                    {savingNow ? 'Saving...' : 'Save Changes'}
                                </button>
                                {currPost.status==='draft' ? (
                                    <button
                                        type="button"
                                        className="btn btn-success"
                                        disabled={savingNow}
                                        onClick={()=>saveArticle('published')}
                                    >
                                        Publish Now
                                    </button>
                                ):(
                                    <button
                                        type="button"
                                        className="btn btn-warning"
                                        disabled={savingNow}
                                        onClick={()=>saveArticle('draft')}
                                    >
                                        Convert to Draft
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className="btn btn-light ms-auto"
                                    onClick={()=>navTo('/admin/dashboard')}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
