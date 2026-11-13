import {useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';

export default function Navbar(){
    const[navWord,setNavWord]=useState('');
    const navTo=useNavigate();

    const doNavSearch=(e)=>{
        e.preventDefault();
        if(navWord.trim()){
            navTo(`/blogs?search=${encodeURIComponent(navWord.trim())}`);
            setNavWord('');
        }
    };

    return(
        <nav className='navbar navbar-expand-lg navbar-dark bg-dark shadow-sm'>
            <div className='container'>
                <Link className='navbar-brand fw-bold d-flex align-items-center' to="/">
                    <img src="/logo.png" alt="Blogger" width="36" height="36" className="rounded-circle me-2 bg-white p-1"/>
                    Blogger
                </Link>

                <button 
                    className='navbar-toggler'
                    type='button'
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className='navbar-toggler-icon'></span>
                </button>
                <div className='collapse navbar-collapse' id='navbarNav'>
                    <form className='d-flex ms-lg-4 my-2 my-lg-0' onSubmit={doNavSearch}>
                        <input
                            className='form-control form-control-sm me-2'
                            type='search'
                            placeholder='Search articles...'
                            value={navWord}
                            onChange={(e)=>setNavWord(e.target.value)}
                        />
                        <button className='btn btn-outline-light btn-sm' type='submit'>
                            <i className='bi bi-search'></i>
                        </button>
                    </form>
                    <ul className='navbar-nav ms-auto align-items-center'>
                        <li className='nav-item'>
                            <Link className='nav-link' to="/">Home</Link>
                        </li>
                        <li className='nav-item'>
                            <Link className='nav-link' to="/blogs">Articles</Link>
                        </li>
                        <li className='nav-item dropdown'>
                            <a className='nav-link dropdown-toggle'
                                href='#'
                                role='button'
                                data-bs-toggle="dropdown"
                                aria-expanded='false'
                            >
                                Categories
                            </a>
                            <ul className='dropdown-menu dropdown-menu-dark'>
                                <li><Link className='dropdown-item' to="/blogs?category=Technology%20%26%20Innovation">Technology & Innovation</Link></li>
                                <li><Link className='dropdown-item' to="/blogs?category=Web%20and%20Mobile%20App%20Development">Web Development</Link></li>
                                <li><Link className='dropdown-item' to="/blogs?category=Artificial%20Intelligence%20%26%20Machine%20Learning">AI & Machine Learning</Link></li>
                                <li><Link className='dropdown-item' to="/blogs?category=Software%20Development">Software Development</Link></li>
                                <li><Link className='dropdown-item' to="/blogs?category=Cybersecurity">Cybersecurity</Link></li>
                                <li><Link className='dropdown-item' to="/blogs?category=Cloud%20Computing">Cloud Computing</Link></li>
                            </ul>
                        </li>
                        <li className='nav-item ms-lg-2'>
                            <Link className='nav-link' to="/admin/dashboard">Admin</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
