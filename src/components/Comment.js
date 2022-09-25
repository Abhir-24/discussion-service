import { useParams,useNavigate } from "react-router"
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import '../App.css'
import { v4 as uuidv4 } from "uuid";
import { db,auth} from "../firebase.config";
import { doc, getDoc, onSnapshot,updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";

const Comment = () => {
    const {id} = useParams();
    const navigate = useNavigate()
    const cur_user = auth.currentUser
    const [comm,setComm] = useState('')
    const [comLike,setComLike] = useState(false)
    const [thread,setThread] = useState([])
    const [comment,setComment] = useState(null)

    useEffect(() =>{
        const fetchData = async (id) => {
            const docRef = doc(db,"posts",id)
            const docSnap = await getDoc(docRef)

            if(docSnap.exists())
            setComment({...docSnap.data(),id:id})
            // console.log("comment",comment)
            else
            console.log('no data')
        }
        
        fetchData(id)
    },[id,comment])

    useEffect(() => {
      const fetchData = async (id) => {
      const docRef = doc(db,"posts",id)
      const docSnap = await getDoc(docRef)

      if(docSnap.exists())
      setThread(docSnap.data().comments)
      // console.log("comment",thread)
      else
      console.log('no data')
      }
      fetchData(id)
      },[id,thread])

    const handleBack = () => {
        navigate('/posts')
    }

    const handleSubmit = e => {
      e.preventDefault()

      const commRef = doc(db,"posts",id)

      if(comm.length > 0) {
        updateDoc(commRef, {
          comments: arrayUnion({
            user_comm_id: cur_user.uid,
            userName: cur_user.displayName,
            comment: comm,
            comm_id: uuidv4(),
            user_comm_like: false
          }),
        }).then(() => setComm(''))
      }
    }

    const handleLike = async (id,likes) => {
        const likesRef = doc(db,"posts",id)
        
        if(likes.includes(cur_user.uid)) {
          updateDoc(likesRef, {
            plike: arrayRemove(cur_user.uid)
          }).then(() => {
            // console.log("unliked")
          }).catch(err =>console.log(err))
        }
        else {
          updateDoc(likesRef, {
            plike: arrayUnion(cur_user.uid)
          }).then(() => {
            // console.log("liked")
          }).catch(err =>console.log(err))
        }
      }

    const handleCommentLike = (id,likes,doc_id) => {
      const commLikeRef = doc(db,"posts",doc_id)
      console.log(commLikeRef)


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
    <div className='Comment'>
        <div className="btns">
            <div className="btn-back">
                <button className='btn' onClick={handleBack}>Back</button>
            </div>

            <div className="btn-logout">
                <button className='btn' onClick={handleLogout}>Logout</button>
            </div>
        </div>

        <div className="comment-sec">
            { 
                <div className="parent-com">
                    <div className="comment-box">
                        <h1>{comment?.phead}</h1>
                        <hr />
                        <h3 style={{marginTop: '10px'}}>Posted By: {comment?.createdBy}</h3>
                        <img className="img-post-2" src={comment?.pphoto} alt="post_img" />

                        <div className="comment-text">
                            {comment?.msg}
                        </div>
                        <button 
                            id={comment?.id} 
                            onClick={() => handleLike(comment.id,comment.plike)} 
                            style={{cursor: 'pointer',
                            marginTop: '15px',
                            padding: 7,
                            border: '1px solid #0d6efd',
                            borderRadius: '4px',
                            backgroundColor: comment?.plike?.includes(cur_user.uid) ? "#0d6efd" : "white",
                            color: comment?.plike?.includes(cur_user.uid) ? "white" : "#0d6efd"
                        }} 
                            >
                            👍 Like <span style={{marginLeft: '2px'}}>{comment?.plike?.length}</span>
                            </button>

                        <div className="threads">
                          <div className="user-comment">
                            <h3>Comments</h3>
                            { thread.map(thr => {
                              return (
                                <div className="user-msg" key={thr?.user_comm_id}>
                                  <b>{thr.userName}:</b> {thr?.comment}  
                                  <span style={{marginLeft: '10px'}}></span>
                                  <button 
                                  onClick={() => setComLike(!comLike)}
                                  style={{cursor: 'pointer',
                                                  marginTop: '15px',
                                                  padding: '4px 4px',
                                                  border: '1px solid #0d6efd',
                                                  // borderRadius: '4px',
                                                  // backgroundColor: 'white'
                                                  backgroundColor: comLike ? "#0d6efd" : "white",
                                                  color: comLike ? "white" : "#0d6efd"
                                              }}>
                                                👍
                                              </button>
                                </div>

                              )

                            })

                            }
                            
                          </div>

                          <div className="comment-form">
                            <form name='Comment-form' onSubmit={e => handleSubmit(e)} className='form-2' method="post">
                            <div className="control-2">
                              <input type="text" 
                              name='comment'
                              className='comm-value'
                              onChange={e => setComm(e.target.value)}
                              placeholder='Enter Comment'
                              />
                              <input type='submit' className='button2' value='Post' />
                            </div>
                            </form>
                          </div>
                        </div>
                        
                    </div>
                </div>
            }
        </div>
    </div>
  )
}

export default Comment