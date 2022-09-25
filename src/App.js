import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';
import Post from './components/Post';
import Comment from './components/Comment';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />
          <Route path='/posts' element={<Post />} />
          <Route path='/posts/:id' element={<Comment />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
