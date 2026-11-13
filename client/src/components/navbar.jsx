import {Link} from 'react-router-dom';

export default function Navbar(){
    return(
        <nav className='navbar navbar-expand-lg navbar-dark bg-dark shadw-sm'>
            <div className='container'>
                <Link className='navbar-brand fw-bold' to="/">Blogger</Link>

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
                    <form className='d-flex ms-lg-4 my-2 my-lg-0' role="search">
                        <input
                            className='form-control form-control-sm me-2'
                            type='search'
                            placeholder='Search articles'
                            aria-label='Search'
                        />
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
                                <li><Link className='dropdown-item' to="/blogs?category=Technology">Technology</Link></li>
                                <li><Link className='dropdown-item' to="/blogs?category=WebDevelopment">Web Development</Link></li>
                                <li><Link className='dropdown-item' to="/blogs?category=AI">AI & Machine Learning</Link></li>
                            </ul>
                        </li>
                        <li className='nav-item ms-lg-2'>
                            <Link className='nav-link' to="/admin">Admin</Link>
                        </li>
                    </ul>

                </div>
            </div>
        </nav>
    );
}
