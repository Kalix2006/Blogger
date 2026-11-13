import { useState,useEffect } from "react";
import {useSearchParams} from 'react-router-dom';
import {fetchP} from '../services/api.js';
import Bcard from '../components/BCard.jsx';

export default function Blogs(){
    const[posts,setPosts]=useState([]);
    const[searchParams,setSearchParams]=useSearchParams();
    const[searchWord,setSearchWord]=useState('');
    const[selectCategory,setSelectCategory]=useState('All');
    const[dispNum,setDispNum]=useState(6);
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
        const urlCat=searchParams.get('category');
        const urlTerm=searchParams.get('search');
        if(urlCat){
            setSelectCategory(urlCat);
        }
        if(urlTerm){
            setSearchWord(urlTerm);
        }
        setDispNum(6);
    },[searchParams]);

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

    const changeCat=(val)=>{
        setSelectCategory(val);
        setDispNum(6);
        const newParams=new URLSearchParams(searchParams);
        if(val==='All'){
            newParams.delete('category');
        }else{
            newParams.set('category',val);
        }
        setSearchParams(newParams);
    };

    const changeSearch=(val)=>{
        setSearchWord(val);
        setDispNum(6);
        const newParams=new URLSearchParams(searchParams);
        if(!val.trim()){
            newParams.delete('search');
        }else{
            newParams.set('search',val);
        }
        setSearchParams(newParams);
    };

    const filterdP=posts.filter((post)=>{
        const title=post.title || '';
        const description=post.description || post.descript || '';
        const content=post.content || '';
        const postC=post.category || '';
        const searchMatch=
            !searchWord.trim() ||
            title.toLowerCase().includes(searchWord.toLowerCase()) ||
            description.toLowerCase().includes(searchWord.toLowerCase()) ||
            content.toLowerCase().includes(searchWord.toLowerCase());

        const categoryMatch=
            selectCategory==="All" || postC.toLowerCase()===selectCategory.toLowerCase();

        return searchMatch && categoryMatch;
    });

    const visP=filterdP.slice(0,dispNum);

    return(
        <div className="container my-4">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <h1 className="fw-bold m-0">All Articles</h1>
                <span className="text-muted small">
                    Showing {visP.length} of {filterdP.length} articles
                </span>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-md-8">
                    <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Search articles by title or keyword..."
                        value={searchWord}
                        onChange={(e)=>changeSearch(e.target.value)}
                    />
                </div>
                <div className="col-md-4">
                    <select
                        className="form-select form-select-lg"
                        value={selectCategory}
                        onChange={(e)=>changeCat(e.target.value)}
                    >
                        {categories.map((cat,index)=>(
                            <option key={index} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>
            {load && <div className="text-center py-5"><div className="spinner-border text-dark" role='status'></div></div>}
            {error && <div className="alert alert-danger text-center">{error}</div>}
            {!load && !error && (
                <>
                    <div className="row g-4">
                        {visP.length===0?(
                            <div className="col-12 text-center py-5">
                                <p className="text-muted fs-5">No articles found matching your criteria</p>
                                <button
                                    className="btn btn-outline-dark btn-sm mt-2"
                                    onClick={()=>{setSearchWord('');setSelectCategory('All');setSearchParams({});setDispNum(6);}}
                                >
                                    Clear filters
                                </button>
                            </div>
                        ):(
                            visP.map((post)=>(
                                <div className="col-md-4" key={post._id}>
                                    <Bcard post={post}/>
                                </div>
                            ))
                        )}
                    </div>

                    {dispNum < filterdP.length && (
                        <div className="text-center my-5">
                            <button
                                onClick={()=>setDispNum((prev)=>prev+6)}
                                className="btn btn-outline-dark btn-lg px-5 py-2 shadow-sm"
                            >
                                <i className="bi bi-arrow-down-circle me-2"></i>
                                Load More Articles
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
