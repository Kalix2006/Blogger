import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar.jsx';
import {createPost} from '../services/api.js';

export default function CreatePost(){
    const navTo=useNavigate();
    const[sendingP,setSendingP]=useState(false);
    const[createErr,setCreateErr]=useState('');
    const[fval,setFval]=useState({
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

    const changeVal=(e)=>{
        const{name,value,type,checked}=e.target;
        setFval((prev)=>({
            ...prev,
            [name]:type==='checkbox'?checked:value
        }));
    };

    const submitPost=async(finalStatus)=>{
        setCreateErr('');
        if(!fval.title||!fval.descript||!fval.content||!fval.author){
            setCreateErr('Please fill all required fields');
            return;
        }
        try{
            setSendingP(true);
            const postObj={
                ...fval,
                status:finalStatus
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
                    <h2 className="fw-bold m-0 text-dark">Create New Post</h2>
                </div>

                <div className="card shadow-sm border-0 p-4 bg-white" style={{maxWidth:'850px'}}>
                    {createErr && <div className="alert alert-danger">{createErr}</div>}
                    <form onSubmit={(e)=>e.preventDefault()}>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Article Title *</label>
                            <input
                                type="text"
                                name="title"
                                className="form-control"
                                placeholder="Enter title"
                                value={fval.title}
                                onChange={changeVal}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold">Description *</label>
                            <textarea
                                name="descript"
                                rows="3"
                                className="form-control"
                                placeholder="Short description / summary"
                                value={fval.descript}
                                onChange={changeVal}
                            ></textarea>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold">Content *</label>
                            <textarea
                                name="content"
                                rows="8"
                                className="form-control"
                                placeholder="Write your full article here..."
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
                                    placeholder="Author name"
                                    value={fval.author}
                                    onChange={changeVal}
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold">Image URL</label>
                            <input
                                type="url"
                                name="image"
                                className="form-control"
                                placeholder="https://example.com/image.jpg"
                                value={fval.image}
                                onChange={changeVal}
                            />
                        </div>

                        <div className="form-check form-switch mb-4">
                            <input
                                type="checkbox"
                                name="featured"
                                id="featCheck"
                                className="form-check-input"
                                checked={fval.featured}
                                onChange={changeVal}
                            />
                            <label className="form-check-label fw-semibold" htmlFor="featCheck">Mark as Featured</label>
                        </div>

                        <div className="d-flex gap-2">
                            <button
                                type="button"
                                className="btn btn-primary"
                                disabled={sendingP}
                                onClick={()=>submitPost('published')}
                            >
                                {sendingP ? 'Publishing...' : 'Publish Article'}
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
