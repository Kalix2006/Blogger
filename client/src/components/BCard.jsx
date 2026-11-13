import {Link} from 'react-router-dom';

export default function Bcard({post}){
    return(
        <div className='card h-100 shadow-sm border-0'>
            {post.image &&(
                <img
                    src={post.image}
                    className='card-img-top'
                    alt={post.title}
                    style={{height:'200px',objectFit:'cover'}}
                />
            )}
            <div className='caard-body d-flex flex-column'>
                <div className='mb=2'>
                    <span className='badge bg-secondary'>{post.category}</span>
                </div>
                <h5 className='card-title fw-bold text-dark'>{post.title}</h5>
                <p className='card-text text-muted flex-grow-1'>{post.descript}</p>
                <div className='d-flex justify-content-between align items-center text-muted small mb-3'>
                    <span>By {post.author}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <Link to={`/blogs/${post._id}`} className='btn btn-outline-dark btn-sm mt-auto'>
                    Read More &rarr;
                </Link>
            </div>
        </div>
    )
}