import { useParams,Link } from "react-router-dom";
import { useState,useEffect } from "react";
import {fetchP,fetchPID} from '../services/api.js';
import Bcard from '../components/BCard.jsx';

export default function CompleteBlog(){
    const[post,setPost]=useState(null);
    const[allP,setAllP]=useState([]);
    const[load,setLoad]=useState(true);
    const[error,setError]=useState(null);
    const[copiedAlert,setCopiedAlert]=useState(false);
    const {id}=useParams();

    useEffect(()=>{
        const getPostAndRealated=async()=>{
            try{
                setLoad(true);
                const allData=await fetchP();
                const plist=Array.isArray(allData)?allData:(allData.data||[]);
                setAllP(plist);

                const singleP=await fetchPID(id);
                if(!singleP){
                    setError('Post not found.');
                }
                else{
                    setPost(singleP);
                    document.title=singleP.seoTitle||singleP.title||'Blogger';
                    const metaTag=document.querySelector('meta[name="description"]');
                    if(metaTag){
                        metaTag.setAttribute('content',singleP.metaDesc||singleP.descript||'');
                    }
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
        window.scrollTo(0,0);
    },[id]);

    const calcReadTime=(str)=>{
        if(!str)return '1 min read';
        const words=str.trim().split(/\s+/).length;
        const mins=Math.ceil(words/180);
        return `${mins} min read`;
    };

    const copyCurUrl=()=>{
        navigator.clipboard.writeText(window.location.href);
        setCopiedAlert(true);
        setTimeout(()=>setCopiedAlert(false),2000);
    };

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

    const curIdx=allP.findIndex((p)=>p._id===post._id || p.slug===post.slug);
    const prevP=curIdx>0 ? allP[curIdx-1] : null;
    const nextP=curIdx>=0 && curIdx<allP.length-1 ? allP[curIdx+1] : null;

    const related=allP.filter((p)=>p.category===post.category && p._id!=post._id).slice(0,3);

    const fullTxt=post.content || post.descript || '';
    const rawLines=fullTxt.split('\n');

    const tocList=[];
    rawLines.forEach((l,i)=>{
        const trm=l.trim();
        if(trm.startsWith('### ')){
            tocList.push({id:`heading-${i}`,text:trm.replace('### ',''),level:3});
        }else if(trm.startsWith('## ')){
            tocList.push({id:`heading-${i}`,text:trm.replace('## ',''),level:2});
        }
    });

    const renderRichBody=()=>{
        const elements=[];
        let inCode=false;
        let codeLines=[];
        let inTable=false;
        let tableLines=[];

        const flushTable=(idx)=>{
            if(tableLines.length>0){
                const headerCols=tableLines[0].split('|').map((c)=>c.trim()).filter(Boolean);
                const bodyRows=tableLines.slice(2);
                elements.push(
                    <div className="table-responsive my-3" key={`table-${idx}`}>
                        <table className="table table-bordered table-hover">
                            <thead className="table-light">
                                <tr>
                                    {headerCols.map((c,ci)=><th key={ci}>{c}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {bodyRows.map((r,ri)=>{
                                    const cols=r.split('|').map((c)=>c.trim()).filter(Boolean);
                                    return(
                                        <tr key={ri}>
                                            {cols.map((c,ci)=><td key={ci}>{c}</td>)}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                );
                tableLines=[];
            }
        };

        rawLines.forEach((ln,idx)=>{
            const trm=ln.trim();

            if(trm.startsWith('```')){
                if(inCode){
                    elements.push(
                        <pre className="bg-dark text-light p-3 rounded my-3" key={`code-${idx}`}>
                            <code>{codeLines.join('\n')}</code>
                        </pre>
                    );
                    codeLines=[];
                    inCode=false;
                }else{
                    inCode=true;
                }
                return;
            }

            if(inCode){
                codeLines.push(ln);
                return;
            }

            if(trm.startsWith('|')&&trm.endsWith('|')){
                inTable=true;
                tableLines.push(trm);
                return;
            }else if(inTable){
                flushTable(idx);
                inTable=false;
            }

            if(trm.startsWith('### ')){
                elements.push(
                    <h4 id={`heading-${idx}`} className="fw-bold mt-4 mb-2 text-dark" key={`h3-${idx}`}>
                        {trm.replace('### ','')}
                    </h4>
                );
            }else if(trm.startsWith('## ')){
                elements.push(
                    <h3 id={`heading-${idx}`} className="fw-bold mt-4 mb-3 text-dark border-bottom pb-2" key={`h2-${idx}`}>
                        {trm.replace('## ','')}
                    </h3>
                );
            }else if(trm.startsWith('# ')){
                elements.push(
                    <h2 id={`heading-${idx}`} className="fw-bold mt-4 mb-3 text-dark" key={`h1-${idx}`}>
                        {trm.replace('# ','')}
                    </h2>
                );
            }else if(trm.startsWith('> ')){
                elements.push(
                    <blockquote className="blockquote p-3 bg-light border-start border-4 border-primary my-3" key={`quote-${idx}`}>
                        <p className="mb-0 text-muted fst-italic">{trm.replace('> ','')}</p>
                    </blockquote>
                );
            }else if(trm.startsWith('![')&&trm.includes('](')&&trm.endsWith(')')){
                const alt=trm.substring(trm.indexOf('[')+1,trm.indexOf(']'));
                const src=trm.substring(trm.indexOf('(')+1,trm.indexOf(')'));
                elements.push(
                    <div className="text-center my-4" key={`img-${idx}`}>
                        <img src={src} alt={alt} className="img-fluid rounded shadow-sm" style={{maxHeight:'400px'}}/>
                    </div>
                );
            }else if(trm.includes('youtube.com/embed/')||trm.includes('youtube.com/watch?v=')){
                const ytSrc=trm.includes('embed') 
                    ? trm.match(/https?:\/\/[^\s]+/)?.[0] 
                    : trm.match(/https?:\/\/[^\s]+/)?.[0]?.replace('watch?v=','embed/');
                if(ytSrc){
                    elements.push(
                        <div className="ratio ratio-16x9 my-4 shadow-sm" key={`yt-${idx}`}>
                            <iframe src={ytSrc} title="Video" allowFullScreen></iframe>
                        </div>
                    );
                }
            }else if(trm===''){
                elements.push(<div className="my-2" key={`space-${idx}`}></div>);
            }else{
                elements.push(
                    <p className="fs-5 text-secondary lh-lg mb-3" key={`p-${idx}`}>
                        {trm}
                    </p>
                );
            }
        });

        if(inTable){
            flushTable(rawLines.length);
        }

        return elements;
    };

    const shareUrl=window.location.href;
    const shareTitle=post.title;

    return(
        <div className="container my-5" style={{maxWidth:'860px'}}>
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
                    <li className="breadcrumb-item"><Link to="/blogs" className="text-decoration-none text-muted">Articles</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{post.title.slice(0,35)}...</li>
                </ol>
            </nav>

            <div className="mb-3 d-flex flex-wrap gap-2 align-items-center">
                <span className="badge bg-primary px-3 py-2">{post.category}</span>
                {post.featured && <span className="badge bg-danger px-3 py-2">Featured</span>}
                {Array.isArray(post.tags)&&post.tags.map((t,i)=>(
                    <span key={i} className="badge bg-light text-dark border px-2 py-1">#{t}</span>
                ))}
            </div>

            <h1 className="fw-bold display-5 mb-3 text-dark">{post.title}</h1>

            <div className="d-flex flex-wrap justify-content-between align-items-center text-muted mb-4 pb-3 border-bottom gap-2">
                <div className="d-flex align-items-center">
                    <i className="bi bi-person-circle fs-5 me-2 text-dark"></i>
                    <span className="fw-semibold text-dark me-3">{post.author}</span>
                    <span className="me-3">&bull;</span>
                    <i className="bi bi-calendar3 me-1"></i>
                    <span className="me-3">{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span className="me-3">&bull;</span>
                    <i className="bi bi-clock me-1 text-primary"></i>
                    <span className="fw-medium text-dark">{calcReadTime(fullTxt)}</span>
                </div>

                <div className="d-flex align-items-center gap-2">
                    <span className="small text-uppercase fw-bold text-muted me-1">Share:</span>
                    <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline-dark btn-sm rounded-circle p-1"
                        style={{width:'32px',height:'32px'}}
                    >
                        <i className="bi bi-twitter-x"></i>
                    </a>
                    <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline-primary btn-sm rounded-circle p-1"
                        style={{width:'32px',height:'32px'}}
                    >
                        <i className="bi bi-linkedin"></i>
                    </a>
                    <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline-primary btn-sm rounded-circle p-1"
                        style={{width:'32px',height:'32px'}}
                    >
                        <i className="bi bi-facebook"></i>
                    </a>
                    <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle+' '+shareUrl)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline-success btn-sm rounded-circle p-1"
                        style={{width:'32px',height:'32px'}}
                    >
                        <i className="bi bi-whatsapp"></i>
                    </a>
                    <button
                        onClick={copyCurUrl}
                        className="btn btn-outline-secondary btn-sm rounded-circle p-1"
                        style={{width:'32px',height:'32px'}}
                        title="Copy Link"
                    >
                        <i className="bi bi-link-45deg"></i>
                    </button>
                    {copiedAlert && <span className="badge bg-success small">Copied!</span>}
                </div>
            </div>

            {post.image &&(
                <div className="mb-4 text-center">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="img-fluid rounded shadow-sm w-100"
                        style={{maxHeight:'450px',objectFit:'cover'}}
                    />
                </div>
            )}

            {tocList.length>=2 && (
                <div className="card shadow-sm border-0 bg-light p-3 mb-4">
                    <h5 className="fw-bold mb-2 text-dark">
                        <i className="bi bi-list-nested me-2"></i>Table of Contents
                    </h5>
                    <ul className="list-unstyled mb-0 d-flex flex-column gap-1">
                        {tocList.map((h,hi)=>(
                            <li key={hi} style={{paddingLeft:h.level===3?'18px':'0px'}}>
                                <a href={`#${h.id}`} className="text-decoration-none text-dark small fw-medium">
                                    &bull; {h.text}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="article-content">
                {renderRichBody()}
            </div>

            <hr className="my-5"/>

            <div className="row g-3 mb-5">
                <div className="col-md-6">
                    {prevP ? (
                        <Link to={`/blogs/${prevP.slug||prevP._id}`} className="card h-100 text-decoration-none border shadow-sm p-3 bg-white">
                            <span className="small text-muted text-uppercase fw-bold">
                                &larr; Previous Article
                            </span>
                            <span className="fw-bold text-dark mt-1 line-clamp-2">
                                {prevP.title}
                            </span>
                        </Link>
                    ):(
                        <div className="card h-100 border p-3 bg-light text-muted">
                            <span className="small text-uppercase">Previous Article</span>
                            <span className="small mt-1">Beginning of articles</span>
                        </div>
                    )}
                </div>
                <div className="col-md-6 text-md-end">
                    {nextP ? (
                        <Link to={`/blogs/${nextP.slug||nextP._id}`} className="card h-100 text-decoration-none border shadow-sm p-3 bg-white">
                            <span className="small text-muted text-uppercase fw-bold">
                                Next Article &rarr;
                            </span>
                            <span className="fw-bold text-dark mt-1 line-clamp-2">
                                {nextP.title}
                            </span>
                        </Link>
                    ):(
                        <div className="card h-100 border p-3 bg-light text-muted">
                            <span className="small text-uppercase">Next Article</span>
                            <span className="small mt-1">End of articles</span>
                        </div>
                    )}
                </div>
            </div>

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
                <Link to="/blogs" className="btn btn-outline-dark px-4">
                    Back to All Articles
                </Link>
            </div>
        </div>
    );
}
