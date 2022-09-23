import {useState} from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase.config'
import { useNavigate } from 'react-router-dom'

const Post = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    auth.signOut()
    .then(() => {
      alert('Logged Out Successfully!')
      navigate('/login')
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
    </div>
  )
}

export default Post