import {useEffect, useState} from 'react'
import { signOut } from 'firebase/auth'
import { collection,doc,getDocs,addDoc, updateDoc, arrayRemove, arrayUnion, getDoc } from 'firebase/firestore'
import { auth,db } from '../firebase.config'
import { Grid,Typography } from "@mui/material"
import { useNavigate } from 'react-router-dom'

const Post = () => {
  const navigate = useNavigate()
  const [postName,setPostName] = useState('')
  const [message,setMessage] = useState('')
  const [imgURL,setImgURL] = useState('')
  const [errPostName,setErrPostName] = useState('')
  const [errMessage,setErrMessage] = useState('')
  const [errImgURL,setErrImgURL] = useState('')
  const [fields,setFields] = useState([])

  const cur_user = auth.currentUser

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
      })
      setFields(fieldValues)
    }

    fetchData()
  },[fields])

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
        const id = user.uid

        // console.log(user)
        await addDoc(collection(db,"posts"), {
          user_id: id,
          createdBy: userName,
          msg: message,
          phead: postName,
          plike: [],
          pphoto: imgURL,
          comments: []
        }).then(res => alert("Post is created successfully!"))
        .catch(err => alert(err))

      }
    }

    setPostName('')
    setImgURL('')
    setMessage('')
  }
  
  const handleLike = async (id,likes) => {
    const likesRef = doc(db,"posts",id)
    
    if(likes.includes(cur_user.uid)) {
      updateDoc(likesRef, {
        plike: arrayRemove(cur_user.uid)
      }).then(() => {
      }).catch(err =>console.log(err))
    }
    else {
      updateDoc(likesRef, {
        plike: arrayUnion(cur_user.uid)
      }).then(() => {
      }).catch(err =>console.log(err))
    }
  }

  const handleComment = id => {
    navigate(`/posts/${id}`)
  }

  const handleLogout = () => {
    auth.signOut()
    .then(() => {
      alert('Logged Out Successfully!')
      navigate('/login')
      localStorage.removeItem("user_id")
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
        fields.length === 0 ? (<h3 className='no-posts-head'>No Posts Found!</h3>)
        : (
          fields.map(post => {
            return (
            <div className="card-grid" key={post?.id}>
            <div className="main">        
            <div className="card">
                  <Grid container spacing={2}>
                    <Grid item xs={4} style={{'paddingTop': '0'}}>
                      <img className="img-post" src={post?.pphoto} alt="post_img" />
                    </Grid> 
                    <Grid item xs={8} style={{'paddingTop': '0','paddingLeft': '0'}}>
                      <br /><br />
                      <Typography variant='h4'>
                        {post?.phead}
                        </Typography>
                      <br />
                      <Typography>
                        {post?.msg}
                      </Typography>
                      <br />
                      <Typography color="gray">
                        Created By: {post.createdBy}
                        <br /><br />
                        <button 
                        id={post?.id} 
                        onClick={() => handleLike(post.id,post.plike)} 
                        style={{cursor: 'pointer',
                        padding: 7,
                        border: '1px solid #0d6efd',
                        borderRadius: '4px',
                        backgroundColor: post?.plike?.includes(cur_user.uid) ? "#0d6efd" : "white",
                        color: post?.plike?.includes(cur_user.uid) ? "white" : "#0d6efd"
                      }} 
                        >
                          ???? Like <span style={{marginLeft: '2px'}}>{post?.plike?.length}</span>
                          </button>
                          
                      </Typography>
                      <br />
                      <Typography align="right" marginRight={5}>
                          <button onClick={() => handleComment(post?.id)} className='btn'>Read More </button>
                      </Typography>
                      <br />
                    </Grid> 
                  </Grid>
                </div>
            </div>
            </div>
  
            )
          })

        )
      }
    </div>
  )
}

export default Post