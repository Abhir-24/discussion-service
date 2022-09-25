import {useEffect, useState} from 'react'
import { signOut } from 'firebase/auth'
import { collection,doc,getDocs,addDoc } from 'firebase/firestore'
import { auth,db } from '../firebase.config'
import { Grid,Typography } from "@mui/material"
import { useNavigate } from 'react-router-dom'
import Card from './Card'
import { async } from '@firebase/util'

const Post = () => {
  const navigate = useNavigate()
  const [postName,setPostName] = useState('')
  const [message,setMessage] = useState('')
  const [imgURL,setImgURL] = useState('')
  const [errPostName,setErrPostName] = useState('')
  const [errMessage,setErrMessage] = useState('')
  const [errImgURL,setErrImgURL] = useState('')
  const [like,setLike] = useState(false)
  const [fields,setFields] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      let fieldValues = []
      const querySnapshot = await getDocs(collection(db,"posts"))
  
      querySnapshot.forEach(doc => {
        const val = doc.data()

        fieldValues.push({
          id: doc.id,
          createdBy: val.createdBy,
          msg: val.msg,
          phead: val.phead,
          plike: val.plike,
          pphoto: val.pphoto
        })
        // console.log(doc.id, " => ", doc.data().msg)
      })
      setFields(fieldValues)

      // console.log(fieldValues)
    }

    fetchData()
  },[])

  const toggle = () => setLike(!like)

  const validateForm = () => {
    let validity = true
    
    if(postName==='') {
      validity = false
      setErrPostName('*Please Enter Your Post Name')
    }

    if(typeof(postName) !== 'undefined') {
      if (!(postName.length > 3)) {
        validity = false
        setErrPostName('*Please Enter More Than 3 Characters')
      }
    }

    if(imgURL==='') {
      validity = false
      setErrImgURL('*Please enter an Image URL')
    }

    if(typeof(email) !== 'undefined') {
      let pattern = new RegExp(/(http[s]?:\/\/.*\.(?:png|jpg|gif|svg|jpeg))/i)
      if (!pattern.test(imgURL)) {
        validity = false
        setErrImgURL('*Please enter a valid Image URL')
      }
    }

    if(message==='') {
      validity = false
      setErrMessage('*Please Enter Your Message')
    }

    if(typeof(message) !== 'undefined') {
      if (!(message.length > 0)) {
        validity = false
        setErrMessage('*Message Cannot be Empty')
      }
    }

    return validity
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(validateForm()) {
      const user = auth.currentUser

      if(user) {
        const userName = user.displayName

        await addDoc(collection(db,"posts"), {
          createdBy: userName,
          msg: message,
          phead: postName,
          plike: like,
          pphoto: imgURL
        }).then(res => alert("Post is created successfully!"))
        .catch(err => alert(err))

      }
    }

    setPostName('')
    setImgURL('')
    setMessage('')
  }

  const handleLogout = () => {
    auth.signOut()
    .then(() => {
      alert('Logged Out Successfully!')
      navigate('/login')
      localStorage.removeItem("authToken")
    })
    .catch(err => {
      alert(err)
    })
  }
  return (
    <div className='Post'>
      <div className="btn-logout">
        <button className='btn' onClick={handleLogout}>Logout</button>
      </div>

      <div className="container post">
        <form method='post' 
        className="form" 
        name='Login-Form' 
        onSubmit={(e) => handleSubmit(e)}
        >
          <h2>Create Post</h2>

          <div className="control">
            <label htmlFor="post-name">Post Name</label>
            <input type="text" 
            name='post-name'
            onChange={e => setPostName(e.target.value)}
            placeholder='Enter Post Name'
            />
            <small className="errorMsg">{errPostName}</small>
          </div>

          <div className="control">
            <label htmlFor="img-url">Post Image URL</label>
            <input type="text" 
            name='img-url'
            onChange={e => setImgURL(e.target.value)}
            placeholder='Enter Image URL'
            />
            <small className="errorMsg">{errImgURL}</small>
          </div>

          <div className="control">
            <label htmlFor="msg">Message</label>
            <textarea type="text" 
            name='msg'
            onChange={e => setMessage(e.target.value)}
            placeholder='Enter Message'
            />
            <small className="errorMsg">{errMessage}</small>
          </div>

          <input type='submit' className='button' value='Post' />
        </form>
      </div>

      <h1 className='article-head'>All Posts</h1>
      {
        fields.map(post => {
          return (
          <div className="card-grid" key={post.id}>
          <div className="main">        
          <div className="card">
                <Grid container spacing={2}>
                  <Grid item xs={4} style={{'paddingTop': '0'}}>
                    <img className="img-post" src={post.pphoto} alt="post_img" />
                  </Grid> 
                  <Grid item xs={8} style={{'paddingTop': '0','paddingLeft': '0'}}>
                    <br /><br />
                    <Typography variant='h4'>
                      {post.phead}
                      </Typography>
                    <br />
                    <Typography>
                      {post.msg}
                    </Typography>
                    <br />
                    <Typography color="gray">
                      Created By: {post.createdBy}
                      <br /><br />
                      <button onClick={() =>setLike(!post.plike)} style={{cursor: 'pointer',padding: 7,border: '1px solid #0d6efd',borderRadius: '4px'}} className={`liked-btn ${like ? 'liked' : ''}`}>
                        👍 Like
                        </button>
                    </Typography>
                    <br />
                    <Typography align="right" marginRight={5}>
                        <button className='btn'>Read More </button>
                    </Typography>
                    <br />
                  </Grid> 
                </Grid>
              </div>
          </div>
          </div>

          )
        })
      }
      {/* <div className="card-grid">
        <Card />
      </div>
      <div className="card-grid">
        <Card />
      </div>
      <div className="card-grid">
        <Card />
      </div> */}
    </div>
  )
}

export default Post