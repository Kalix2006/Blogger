import {useState,useEffect} from 'react';
import {useParams,useNavigate} from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar.jsx';
import {fetchPID,updatePost,fetchCats,fetchAuthors,uploadImage} from '../services/api.js';

export default function EditPost(){
    const{id}=useParams();
    const navTo=useNavigate();
    const[loadingInit,setLoadingInit]=useState(true);
    const[savingNow,setSavingNow]=useState(false);
    const[uploadingImg,setUploadingImg]=useState(false);
    const[editErr,setEditErr]=useState('');
    const[catList,setCatList]=useState([]);
    const[authList,setAuthList]=useState([]);
    const[currPost,setCurrPost]=useState({
        title:'',
        slug:'',
        descript:'',
        content:'',
        category:'',
        author:'',
        image:'',
        tags:'',
        status:'draft',
        scheduledAt:'',
        seoTitle:'',
        metaDesc:'',
        featured:false
    });

    useEffect(()=>{
        const loadAll=async()=>{
            try{
                setLoadingInit(true);
                const [cats,auths,data]=await Promise.all([
                    fetchCats(),
                    fetchAuthors(),
                    fetchPID(id)
                ]);
                const cArr=Array.isArray(cats)?cats:(cats.data||[]);
                const aArr=Array.isArray(auths)?auths:(auths.data||[]);
                setCatList(cArr);
                setAuthList(aArr);

                if(data){
                    setCurrPost({
                        title:data.title||'',
                        slug:data.slug||'',
                        descript:data.descript||'',
                        content:data.content||'',
                        category:data.category||(cArr[0]?.name||''),
                        author:data.author||(aArr[0]?.name||''),
                        image:data.image||'',
                        tags:Array.isArray(data.tags)?data.tags.join(', '):(data.tags||''),
                        status:data.status||'draft',
                        scheduledAt:data.scheduledAt?new Date(data.scheduledAt).toISOString().slice(0,16):'',
                        seoTitle:data.seoTitle||'',
                        metaDesc:data.metaDesc||'',
                        featured:Boolean(data.featured)
                    });
                }
            }catch(err){
                setEditErr('Could not find article or session expired');
            }finally{
                setLoadingInit(false);
            }
        };
        loadAll();
    },[id]);

    const changeField=(e)=>{
        const{name,value,type,checked}=e.target;
        setCurrPost((prev)=>({
            ...prev,
            [name]:type==='checkbox'?checked:value
        }));
    };

    const handleImgUpload=async(e)=>{
        const f=e.target.files?.[0];
        if(!f)return;
        try{
            setUploadingImg(true);
            const res=await uploadImage(f);
            if(res&&res.url){
                setCurrPost((prev)=>({...prev,image:res.url}));
            }
        }catch(err){
            alert('Image upload failed: '+(err?.response?.data?.message||err.message));
        }finally{
            setUploadingImg(false);
        }
    };

    const saveArticle=async(newStatus)=>{
        setEditErr('');
        if(!currPost.title||!currPost.descript||!currPost.content||!currPost.author||!currPost.category){
            setEditErr('Please fill in title, description, content, author and category');
            return;
        }
        const finalStatus=newStatus||currPost.status;
        if(finalStatus==='scheduled'&&!currPost.scheduledAt){
            setEditErr('Please choose a scheduled publication date and time');
            return;
        }
        try{
            setSavingNow(true);
            const sendObj={
                ...currPost,
                status:finalStatus,
                scheduledAt:finalStatus==='scheduled' && currPost.scheduledAt ? new Date(currPost.scheduledAt).toISOString() : null
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

                <div className="card shadow-sm border-0 p-4 bg-white" style={{maxWidth:'900px'}}>
                    {loadingInit && <div className="text-center py-4"><div className="spinner-border text-dark"></div></div>}
                    {editErr && <div className="alert alert-danger">{editErr}</div>}
                    {!loadingInit && (
                        <form onSubmit={(e)=>e.preventDefault()}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Article Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    className="form-control form-control-lg"
                                    value={currPost.title}
                                    onChange={changeField}
                                />
                            </div>

                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">URL Slug (SEO friendly) *</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light small">/blogs/</span>
                                        <input
                                            type="text"
                                            name="slug"
                                            className="form-control"
                                            value={currPost.slug}
                                            onChange={changeField}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Tags (comma separated)</label>
                                    <input
                                        type="text"
                                        name="tags"
                                        className="form-control"
                                        placeholder="AI, Web, Cloud"
                                        value={currPost.tags}
                                        onChange={changeField}
                                    />
                                </div>
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
                                <label className="form-label fw-semibold">Content (Markdown supported) *</label>
                                <textarea
                                    name="content"
                                    rows="10"
                                    className="form-control font-monospace"
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
                                        {catList.map((c)=>(
                                            <option key={c._id} value={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Author *</label>
                                    <select
                                        name="author"
                                        className="form-select"
                                        value={currPost.author}
                                        onChange={changeField}
                                    >
                                        {authList.map((a)=>(
                                            <option key={a._id} value={a.name}>{a.name} ({a.email})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="card bg-light border p-3 mb-4">
                                <label className="form-label fw-semibold">Featured Thumbnail Image</label>
                                <div className="row g-3 align-items-center">
                                    <div className="col-md-6">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="form-control"
                                            onChange={handleImgUpload}
                                            disabled={uploadingImg}
                                        />
                                        {uploadingImg && <span className="small text-primary mt-1 d-block">Uploading image...</span>}
                                    </div>
                                    <div className="col-md-6">
                                        <input
                                            type="url"
                                            name="image"
                                            className="form-control"
                                            placeholder="Or external image URL"
                                            value={currPost.image}
                                            onChange={changeField}
                                        />
                                    </div>
                                </div>
                                {currPost.image && (
                                    <div className="mt-3 text-center">
                                        <img src={currPost.image} alt="Preview" className="rounded shadow-sm" style={{maxHeight:'150px'}}/>
                                    </div>
                                )}
                            </div>

                            <div className="card border p-3 mb-4 bg-white">
                                <h6 className="fw-bold mb-3 text-dark">SEO Metadata (Search Engine Optimization)</h6>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label small fw-semibold">SEO Meta Title</label>
                                        <input
                                            type="text"
                                            name="seoTitle"
                                            className="form-control"
                                            placeholder="Defaults to article title"
                                            value={currPost.seoTitle}
                                            onChange={changeField}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-semibold">SEO Meta Description</label>
                                        <textarea
                                            name="metaDesc"
                                            rows="2"
                                            className="form-control"
                                            placeholder="Defaults to article description"
                                            value={currPost.metaDesc}
                                            onChange={changeField}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="row g-3 mb-4 align-items-center">
                                <div className="col-md-4">
                                    <div className="form-check form-switch">
                                        <input
                                            type="checkbox"
                                            name="featured"
                                            id="editFeatToggle"
                                            className="form-check-input"
                                            checked={currPost.featured}
                                            onChange={changeField}
                                        />
                                        <label className="form-check-label fw-semibold" htmlFor="editFeatToggle">
                                            Mark as Featured
                                        </label>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-semibold small">Current Status</label>
                                    <select
                                        name="status"
                                        className="form-select"
                                        value={currPost.status}
                                        onChange={changeField}
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                        <option value="scheduled">Scheduled for Future</option>
                                    </select>
                                </div>
                                {currPost.status==='scheduled' && (
                                    <div className="col-md-4">
                                        <label className="form-label fw-semibold small text-primary">Schedule Date & Time *</label>
                                        <input
                                            type="datetime-local"
                                            name="scheduledAt"
                                            className="form-control"
                                            value={currPost.scheduledAt}
                                            onChange={changeField}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="d-flex gap-2 flex-wrap">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    disabled={savingNow}
                                    onClick={()=>saveArticle(currPost.status)}
                                >
                                    {savingNow ? 'Saving...' : 'Save Changes'}
                                </button>
                                {currPost.status!=='published' && (
                                    <button
                                        type="button"
                                        className="btn btn-success"
                                        disabled={savingNow}
                                        onClick={()=>saveArticle('published')}
                                    >
                                        Publish Now
                                    </button>
                                )}
                                {currPost.status!=='draft' && (
                                    <button
                                        type="button"
                                        className="btn btn-warning"
                                        disabled={savingNow}
                                        onClick={()=>saveArticle('draft')}
                                    >
                                        Switch to Draft
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
