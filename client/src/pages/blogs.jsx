import { useState,useEffect } from "react";
import {fetchP} from '../services/api.js';
import Bcard from '../components/BCard.jsx';

export default function Blogs(){
    const[posts,setPosts]=useState([]);
    const[searchWord,setSearchWord]=useState('');
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

    const filterdP=posts.filter((post)=>{
        const title=post.title || '';
        const description=post.description || post.descript || '';
        return(
            title.toLowerCase().includes(searchWord.toLowerCase()) ||
            description.toLowerCase().includes(searchWord.toLowerCase())
        );
    });

    return(
        <div className="container my-4">
            <h1 className="fw-bold mb-4">All articles</h1>
            <div className="mb-4">
                <input type="text" className="form-control form-control-lg" placeholder="Search articles..." value={searchWord} onChange={(e)=>setSearchWord(e.target.value)}/>
            </div>
            {load && <div className="text-center py-5"><div className="spinner-border text-dark" role='status'></div></div>}
            {error && <div className="alert alert-danger text-center">{error}</div>}
            {!load && !error && (
                <div className="row g-4">
                    {filterdP.length===0?(
                        <div className="col-12 text-center py-5">
                            <p className="text-muted fs-5">No article found</p>
                        </div>
                    ):(
                        filterdP.map((post)=>(
                            <div className="col-md-4" key={post._id}>
                                <Bcard post={post}/>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}