import { useState,useEffect } from "react";
import {fetchP} from '../services/api.js';
import Bcard from '../components/BCard.jsx';

export default function Blogs(){
    const[posts,setPosts]=useState([]);
    const[searchWord,setSearchWord]=useState('');
    const[selectCategory,setSelectCategory]=useState('All');
    const[load,setLoad]=useState(true);
    const[error,setError]=useState(null);

    const categories=["All",
        "Software Development",
        "Artificial Intelligence & Machine Learning",
        "Web and Mobile App Development",
        "Technology & Innovation",
        "Cybersecurity",
        "Cloud Computing",
        "Industry Insights"];

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

    const filterdP=posts.filter((post)=>{
        const title=post.title || '';
        const description=post.description || post.descript || '';
        const postC=post.category || '';
        const searchMatch=
            title.toLowerCase().includes(searchWord.toLowerCase()) ||
            description.toLowerCase().includes(searchWord.toLowerCase());

        const categoryMatch=
            selectCategory==="All" || postC===selectCategory;

        return searchMatch &&  categoryMatch;
    
    });

    return(
        <div className="container my-4">
            <h1 className="fw-bold mb-4">All articles</h1>
            <div className="row g-3 mb-4">
                <div className="col-md-8">
                    <input type="text" className="form-control form-control-lg" placeholder="Search articles..." value={searchWord} onChange={(e)=>setSearchWord(e.target.value)}/>
                </div>
                <div className="col-md-4">
                    <select className="form-select form-select-lg" value={selectCategory} onChange={(e)=>setSelectCategory(e.target.value)}>
                        {categories.map((cat,index)=>(
                            <option key={index} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
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
