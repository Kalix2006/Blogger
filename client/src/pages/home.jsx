import { useEffect,useState } from "react";
import {Link,useNavigate} from 'react-router-dom';
import Bcard from "../components/BCard.jsx";
import {fetchP} from "../services/api.js";

export default function Home(){
    const[posts,setPosts]=useState([]);
    const[load,setLoad]=useState(true);
    const[error,setError]=useState(null);
    const[homeWord,setHomeWord]=useState('');
    const navTo=useNavigate();

    useEffect(()=>{
        const getposts=async()=>{
            try{
                const Postdata=await fetchP();
                setPosts(Array.isArray(Postdata)?Postdata:(Postdata.data||[]));
            }
            catch(error){
                setError('failed to load.chek backend');
            }
            finally{
                setLoad(false)
            }
        };
        getposts();
    },[]);

    const doHomeSearch=(e)=>{
        e.preventDefault();
        if(homeWord.trim()){
            navTo(`/blogs?search=${encodeURIComponent(homeWord.trim())}`);
        }
    };

    const catBtns=[
        'Technology & Innovation',
        'Web and Mobile App Development',
        'Artificial Intelligence & Machine Learning',
        'Software Development',
        'Cybersecurity'
    ];

    const trendP=posts.filter((p)=>Boolean(p.featured)).length>0 
        ? posts.filter((p)=>Boolean(p.featured)).slice(0,4)
        : posts.slice(0,4);

    return(
        <div className="mb-5">
            <div className="p-5 mb-5 bg-light rounded-3 shadow-sm border text-center">
                <div className="container-fluid py-3">
                    <h1 className="display-5 fw-bold text-dark">One Step Ahead In Technology</h1>
                    <p className="col-md-8 fs-4 mx-auto text-muted mb-4">
                        Make a deep dive into technology explore the AI era
                    </p>

                    <form onSubmit={doHomeSearch} className="row g-2 justify-content-center mb-3">
                        <div className="col-md-6 col-sm-8">
                            <input
                                type="text"
                                className="form-control form-control-lg shadow-sm"
                                placeholder="Search articles by title, topic..."
                                value={homeWord}
                                onChange={(e)=>setHomeWord(e.target.value)}
                            />
                        </div>
                        <div className="col-auto">
                            <button type="submit" className="btn btn-dark btn-lg shadow-sm">
                                <i className="bi bi-search me-2"></i>
                                Search
                            </button>
                        </div>
                    </form>

                    <Link to="/blogs" className="btn btn-outline-dark btn-sm mt-1">Browse All Articles</Link>
                </div>
            </div>

            {load && <div className="text-center py-5"><div className="spinner-border text-dark" role='status'></div></div>}
            {error && <div className="alert alert-danger text-center">{error}</div>}
            {!load && !error &&(
                <>
                    {trendP.length>0 && (
                        <section className="mb-5">
                            <div className="d-flex align-items-center mb-4 border-bottom pb-2">
                                <i className="bi bi-fire text-danger fs-3 me-2"></i>
                                <h2 className="fw-bold m-0 text-dark">Popular & Trending</h2>
                            </div>
                            <div className="row g-4">
                                {trendP.map((trP,idx)=>(
                                    <div className="col-lg-3 col-md-6" key={trP._id}>
                                        <div className="card h-100 shadow-sm border-0 position-relative p-3 bg-white">
                                            <span className="display-6 fw-bold text-muted opacity-25 position-absolute top-0 end-0 p-3">
                                                0{idx+1}
                                            </span>
                                            <div className="mb-2">
                                                <span className="badge bg-danger-subtle text-danger border border-danger-subtle">Trending</span>
                                                <span className="badge bg-secondary ms-1">{trP.category}</span>
                                            </div>
                                            <h6 className="fw-bold text-dark flex-grow-1">
                                                <Link to={`/blogs/${trP._id}`} className="text-dark text-decoration-none">
                                                    {trP.title}
                                                </Link>
                                            </h6>
                                            <p className="text-muted small line-clamp-2 mb-3">
                                                {trP.descript?.slice(0,90)}...
                                            </p>
                                            <div className="d-flex justify-content-between align-items-center text-muted small mt-auto border-top pt-2">
                                                <span>{trP.author}</span>
                                                <span>{new Date(trP.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {posts.length>0 &&(
                        <section className="mb-5">
                            <h2 className="fw-bold mb-4 border-bottom pb-2">Featured Articles</h2>
                            <div className="row g-4">
                                {posts.slice(0,2).map((post)=>(
                                    <div className="col-md-6" key={post._id}>
                                        <Bcard post={post}/>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <section className="mb-5 bg-white p-4 rounded shadow-sm border">
                        <h3 className="fw-bold mb-3">Popular Categories</h3>
                        <div className="d-flex flex-wrap gap-2">
                            {catBtns.map((cat,index)=>(
                                <Link 
                                    key={index}
                                    to={`/blogs?category=${encodeURIComponent(cat)}`}
                                    className="btn btn-outline-secondary btn-sm">
                                        {cat}
                                    </Link>
                            ))}
                        </div>
                    </section>

                    <section className="mb-5">
                        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                            <h2 className="fw-bold m-0">Latest Articles</h2>
                            <Link to="/blogs" className="text-dark text-decoration-none fw-semibold">
                                View All &rarr;
                            </Link>
                        </div>
                        <div className="row g-4">
                            {posts.length===0?(
                                <p className="text-muted">No articles found</p>
                            ):(
                                posts.slice(2,8).map((post)=>(
                                    <div className="col-md-4" key={post._id}>
                                        <Bcard post={post}/>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </>
            )}
        </div>
    )
}
