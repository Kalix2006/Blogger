import {useState,useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar.jsx';
import {createPost,fetchCats,fetchAuthors,uploadImage} from '../services/api.js';

export default function CreatePost(){
    const navTo=useNavigate();
    const[sendingP,setSendingP]=useState(false);
    const[uploadingImg,setUploadingImg]=useState(false);
    const[createErr,setCreateErr]=useState('');
    const[catList,setCatList]=useState([]);
    const[authList,setAuthList]=useState([]);
    const[fval,setFval]=useState({
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
        const getMeta=async()=>{
            try{
                const [cats,auths]=await Promise.all([fetchCats(),fetchAuthors()]);
                const cArr=Array.isArray(cats)?cats:(cats.data||[]);
                const aArr=Array.isArray(auths)?auths:(auths.data||[]);
                setCatList(cArr);
                setAuthList(aArr);
                if(cArr.length>0){
                    setFval((prev)=>({...prev,category:prev.category||cArr[0].name}));
                }
                if(aArr.length>0){
                    setFval((prev)=>({...prev,author:prev.author||aArr[0].name}));
                }
            }catch(err){
                console.error(err);
            }
        };
        getMeta();
    },[]);

    const changeVal=(e)=>{
        const{name,value,type,checked}=e.target;
        setFval((prev)=>{
            const updated={
                ...prev,
                [name]:type==='checkbox'?checked:value
            };
            if(name==='title'&&!prev.slug){
                updated.slug=value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-');
            }
            return updated;
        });
    };

    const handleImgUpload=async(e)=>{
        const f=e.target.files?.[0];
        if(!f)return;
        try{
            setUploadingImg(true);
            const res=await uploadImage(f);
            if(res&&res.url){
                setFval((prev)=>({...prev,image:res.url}));
            }
        }catch(err){
            alert('Image upload failed: '+(err?.response?.data?.message||err.message));
        }finally{
            setUploadingImg(false);
        }
    };

    const submitPost=async(chosenStatus)=>{
        setCreateErr('');
        if(!fval.title||!fval.descript||!fval.content||!fval.author||!fval.category){
            setCreateErr('Please fill in title, description, content, author and category');
            return;
        }
        if(chosenStatus==='scheduled'&&!fval.scheduledAt){
            setCreateErr('Please choose a scheduled publication date and time');
            return;
        }
        try{
            setSendingP(true);
            const postObj={
                ...fval,
                status:chosenStatus,
                scheduledAt:chosenStatus==='scheduled'?fval.scheduledAt:null
            };
            await createPost(postObj);
            navTo('/admin/dashboard');
        }catch(err){
            setCreateErr(err?.response?.data?.message||'Failed to create post');
        }finally{
            setSendingP(false);
        }
    };

    return(
        <div className="d-flex">
            <AdminSidebar/>
            <div className="flex-grow-1 p-4 bg-light min-vh-100">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold m-0 text-dark">Create New Article</h2>
                </div>

                <div className="card shadow-sm border-0 p-4 bg-white" style={{maxWidth:'900px'}}>
                    {createErr && <div className="alert alert-danger">{createErr}</div>}
                    <form onSubmit={(e)=>e.preventDefault()}>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Article Title *</label>
                            <input
                                type="text"
                                name="title"
                                className="form-control form-control-lg"
                                placeholder="Enter article title"
                                value={fval.title}
                                onChange={changeVal}
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
                                        placeholder="custom-url-slug"
                                        value={fval.slug}
                                        onChange={changeVal}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Tags (comma separated)</label>
                                <input
                                    type="text"
                                    name="tags"
                                    className="form-control"
                                    placeholder="e.g. AI, React, Cloud"
                                    value={fval.tags}
                                    onChange={changeVal}
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold">Short Description / Summary *</label>
                            <textarea
                                name="descript"
                                rows="3"
                                className="form-control"
                                placeholder="Write a catchy 1-2 sentence overview"
                                value={fval.descript}
                                onChange={changeVal}
                            ></textarea>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold">Full Article Content (Supports Markdown, Headings ##, Tables, Code Blocks ```) *</label>
                            <textarea
                                name="content"
                                rows="10"
                                className="form-control font-monospace"
                                placeholder="Write article content here. Use ## for headings, ``` for code blocks, | for tables..."
                                value={fval.content}
                                onChange={changeVal}
                            ></textarea>
                        </div>

                        <div className="row g-3 mb-3">
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Category *</label>
                                <select
                                    name="category"
                                    className="form-select"
                                    value={fval.category}
                                    onChange={changeVal}
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
                                    value={fval.author}
                                    onChange={changeVal}
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
                                        placeholder="Or paste external image URL"
                                        value={fval.image}
                                        onChange={changeVal}
                                    />
                                </div>
                            </div>
                            {fval.image && (
                                <div className="mt-3 text-center">
                                    <img src={fval.image} alt="Preview" className="rounded shadow-sm" style={{maxHeight:'150px'}}/>
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
                                        value={fval.seoTitle}
                                        onChange={changeVal}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-semibold">SEO Meta Description</label>
                                    <textarea
                                        name="metaDesc"
                                        rows="2"
                                        className="form-control"
                                        placeholder="Defaults to article description"
                                        value={fval.metaDesc}
                                        onChange={changeVal}
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
                                        id="featToggle"
                                        className="form-check-input"
                                        checked={fval.featured}
                                        onChange={changeVal}
                                    />
                                    <label className="form-check-label fw-semibold" htmlFor="featToggle">
                                        Mark as Featured Article
                                    </label>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-semibold small">Publication Status</label>
                                <select
                                    name="status"
                                    className="form-select"
                                    value={fval.status}
                                    onChange={changeVal}
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="scheduled">Scheduled for Future</option>
                                </select>
                            </div>
                            {fval.status==='scheduled' && (
                                <div className="col-md-4">
                                    <label className="form-label fw-semibold small text-primary">Schedule Date & Time *</label>
                                    <input
                                        type="datetime-local"
                                        name="scheduledAt"
                                        className="form-control"
                                        value={fval.scheduledAt}
                                        onChange={changeVal}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="d-flex gap-2 flex-wrap">
                            <button
                                type="button"
                                className="btn btn-primary"
                                disabled={sendingP}
                                onClick={()=>submitPost('published')}
                            >
                                {sendingP ? 'Publishing...' : 'Publish Article Now'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-warning"
                                disabled={sendingP}
                                onClick={()=>submitPost('scheduled')}
                            >
                                Schedule Article
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                disabled={sendingP}
                                onClick={()=>submitPost('draft')}
                            >
                                Save as Draft
                            </button>
                            <button
                                type="button"
                                className="btn btn-light ms-auto"
                                onClick={()=>navTo('/admin/dashboard')}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
