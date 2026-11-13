import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Home from './pages/home.jsx';
import Blogs from './pages/blogs.jsx';
import Navbar from './components/navbar.jsx';
import CompleteBlog from './pages/FullBlog.jsx';

function App() {
  return (
    <Router>
      <Navbar/>
      <div className='container my-4'>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/blogs" element={<Blogs/>}/>
          <Route path="/blogs/:id" element={<CompleteBlog/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
