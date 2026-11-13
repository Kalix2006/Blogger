import {Link} from 'react-router-dom';

export default function Footer(){
    const curYr=new Date().getFullYear();

    return(
        <footer className="bg-dark text-white pt-5 pb-4 mt-auto border-top border-secondary">
            <div className="container">
                <div className="row g-4">
                    <div className="col-lg-4 col-md-6">
                        <div className="d-flex align-items-center mb-3">
                            <img src="/logo.png" alt="Blogger" width="36" height="36" className="rounded-circle me-2 bg-white p-1"/>
                            <span className="fs-4 fw-bold">Blogger</span>
                        </div>
                        <p className="text-secondary small pe-lg-4">
                            Your daily source for technology news, software development tutorials, cloud innovations, and artificial intelligence insights.
                        </p>
                        <div className="d-flex gap-3 mt-3">
                            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-white fs-5">
                                <i className="bi bi-twitter-x"></i>
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-white fs-5">
                                <i className="bi bi-linkedin"></i>
                            </a>
                            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-white fs-5">
                                <i className="bi bi-github"></i>
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-white fs-5">
                                <i className="bi bi-facebook"></i>
                            </a>
                        </div>
                    </div>

                    <div className="col-lg-2 col-md-6 col-6">
                        <h6 className="fw-bold text-uppercase text-light mb-3">Quick Links</h6>
                        <ul className="list-unstyled d-flex flex-column gap-2 small">
                            <li><Link to="/" className="text-secondary text-decoration-none">Home</Link></li>
                            <li><Link to="/blogs" className="text-secondary text-decoration-none">All Articles</Link></li>
                            <li><Link to="/admin/dashboard" className="text-secondary text-decoration-none">Admin Portal</Link></li>
                        </ul>
                    </div>

                    <div className="col-lg-3 col-md-6 col-6">
                        <h6 className="fw-bold text-uppercase text-light mb-3">Categories</h6>
                        <ul className="list-unstyled d-flex flex-column gap-2 small">
                            <li><Link to="/blogs?category=Technology%20%26%20Innovation" className="text-secondary text-decoration-none">Technology & Innovation</Link></li>
                            <li><Link to="/blogs?category=Web%20and%20Mobile%20App%20Development" className="text-secondary text-decoration-none">Web Development</Link></li>
                            <li><Link to="/blogs?category=Artificial%20Intelligence%20%26%20Machine%20Learning" className="text-secondary text-decoration-none">AI & Machine Learning</Link></li>
                            <li><Link to="/blogs?category=Cybersecurity" className="text-secondary text-decoration-none">Cybersecurity</Link></li>
                        </ul>
                    </div>

                    <div className="col-lg-3 col-md-6">
                        <h6 className="fw-bold text-uppercase text-light mb-3">Company Details</h6>
                        <p className="text-secondary small mb-1">
                            <i className="bi bi-geo-alt me-2 text-primary"></i>Tech Hub City, Innovation Way
                        </p>
                        <p className="text-secondary small mb-1">
                            <i className="bi bi-envelope me-2 text-primary"></i>contact@blogger.tech
                        </p>
                        <p className="text-secondary small">
                            <i className="bi bi-telephone me-2 text-primary"></i>+1 (555) 019-2834
                        </p>
                    </div>
                </div>

                <hr className="my-4 border-secondary"/>

                <div className="d-flex flex-wrap justify-content-between align-items-center small text-secondary">
                    <p className="m-0">&copy; {curYr} Blogger Tech Media Inc. All rights reserved.</p>
                    <div className="d-flex gap-3 mt-2 mt-md-0">
                        <span className="text-secondary">Privacy Policy</span>
                        <span className="text-secondary">Terms of Service</span>
                        <span className="text-secondary">Contact Us</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
