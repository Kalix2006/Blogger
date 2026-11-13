import { useEffect,useState } from "react";
import {Link} from 'react-router-dom';
import Bcard from "../components/BCard.jsx";
import {fetchP} from "../services/api.js";

export default function Home(){
    const[posts,setPosts]=useState([]);
    const[load,setLoad]=useState(true);
    const[error,setError]=useState(null);
    useEffect(()=>{
        const getposts=async()=>{
            try{
                const Postdata=await fetchP();
                setPosts(Postdata);
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
    const categories=['Technolog','Web development','AI & Machine Learning'];
    return(
        <div className="p-5 mb-5 bg-light rounded-3 shadow-sm border">
            <div className="container-fluid py-4 text-center">
                <h1 className="display-5 fw-bold text-dark">One Step Ahead In Technology</h1>
                <p className="col-md-8 fs-4 mx-auto text-muted">
                    Make a deep dive into technology explore the AI era
                </p>
                <Link to="/blogs" className="btn btn-dark btn-lg mt-2">View All</Link>
            </div>
            {load && <div className="text-center py-5"><div className="spinner-border text-dark" role='status'></div></div>}
            {error && <div className="alert alert-danger text-center">{error}</div>}
            {!load && !error &&(
                <>
                    {posts.length>0 &&(
                        <section className="mb-5">
                            <h2 className="fw-bold mb-4 border-bottom pb-2">Featured Artilces</h2>
                            <div className="row g-4">
                                {posts.slice(0,2).map((post)=>(
                                    <div className="col-md-6" key={post._id}>
                                        <Bcard post={post}/>
                                    </div>                                ))}
                            </div>
                        </section>
                    )}

                    <section className="mb-5 bg-white p-4 rounded shadow-sm border">
                        <h3 className="fw-bold mb-3">Popular categories</h3>
                        <div className="d-flex flex-wrap gap-2">
                            {categories.map((cat,index)=>(
                                <Link 
                                    key={index}
                                    to={`/blogs?category=${cat}`}
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
                                View All &&rarr;
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