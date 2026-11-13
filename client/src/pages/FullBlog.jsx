import { useParams,Link } from "react-router-dom";
import { useState,useEffect } from "react";
import {fetchP,fetchPID} from '../services/api.js';
import Bcard from '../components/BCard.jsx';

export default function CompleteBlog(){
    const[post,setPost]=useState(null);
    const[allP,setAllP]=useState([]);
    const[load,setLoad]=useState(true);
    const[error,setError]=useState(null);
    const {id}=useParams();

    useEffect(()=>{
        const getPostAndRealated=async()=>{
            try{
                setLoad(true);
                const data=await fetchP();
                setAllP(data);

                const foundP=data.find((p)=>p._id===id);
                if(!foundP){
                    setError('Post not found.');
                }
                else{
                    setPost(foundP);
                }
            }
            catch(error){
                setError('Failed to load.');
            }
            finally{
                setLoad(false);
            }
        };
        getPostAndRealated();
    },[id]);

    if(load){
        return(
            <div className="text-center py-5">
                <div className="spinner-border text-dark" role="status"></div>
            </div>
        );
    }
    if(error || !post){
        return(
            <div className="container my-5 text-center">
                <div className="alert alert-danger">{error || 'Article not found.'}</div>
                <Link to='/blogs' className="btn btn-dark mt-3">Back to All</Link>
            </div>
        );
    }

    const related=allP.filter((p)=>p.category===post.category && p._id!=post._id).slice(0,3);
    
    return(
        <div className="container my-5" style={{maxWidth:'800px'}}>
            <div className="mb-3">
                <span className="badge bg-secondary">{post.category}</span>
            </div>
            <h1 className="fw-bold display-5 mb-3 text-dark">{post.title}</h1>
            <div className="d-flex align-items-center text-muted mb-4 pb-3 border-bottom">
                <span className="fw-semibold text-dark me-3 ">By {post.author}</span>
                <span>.</span>
                <span className="ms-3">{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            {post.image &&(
                <div className="mb-4">
                    <img src={post.image} alt={post.title} className="img-fluid rounded shadow-sm w-100 "
                    style={{maxHeight:'450px',objectFit:'cover'}}/>
                </div>
            )}
            <div className="article-content fs-5 text-secondary lh-lg mb-5" style={{whiteSpace:'pre-line'}}>
                {post.content || post.descript}
            </div>
            <hr className="my-5"/>
            {related.length>0 && (
                <section className="mb-5">
                    <h3 className="fw-bold mb-4">Related Articles</h3>
                    <div className="row g-4">
                        {related.map((rP)=>(
                            <div className="col-md-4" key={rP._id}>
                                <Bcard post={rP}/>
                            </div>
                        ))}
                    </div>
                </section>
            )}
            <div className="text-center mt-4">
                <Link to="/blogs" className="btn btn-outline-dark">
                    Back to All
                </Link>
            </div>
        </div>
    );
}