import {useState} from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { Link,Navigate } from 'react-router-dom'
import { auth } from '../firebase.config'

const Login = () => {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [errEmail,setErrEmail] = useState('');
  const [errPassword,setErrPassword] = useState('');
  const [redirect,setRedirect] = useState(false)

  const validateForm = () => {
    let validity = true

    if(email==='') {
      validity = false
      setErrEmail('*Please enter your Email ID')
    }

    if(typeof(email) !== 'undefined') {
      let pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i)
      if (!pattern.test(email)) {
        validity = false
        setErrEmail('*Please enter valid Email ID')
      }
    }

    if(password==='') {
      validity = false
      setErrPassword('*Please enter your Password')
    }

    if (typeof(password) !== 'undefined') {
      if (!(password.length > 6)) {
        validity = false
        setErrPassword('*Please enter more than 6 characters')
      }
    }

    return validity
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if(validateForm()) {
      // console.log(email)
      // console.log(password)

    signInWithEmailAndPassword(auth,email,password)
    .then(async (res) => {
      // console.log(res.user.accessToken)
      localStorage.setItem("user_id",res.user.uid)
      alert('Logged in Successfully!')
      setRedirect(true)
    })
    .catch(err => alert(err))
    }

    setEmail('')
    setPassword('')
  }

  return (
    <div className='Login'>
      <div className="container">
        <form method='post' 
        className="form" 
        name='Login-Form' 
        onSubmit={(e) => handleSubmit(e)}
        >
          <h2>Login</h2>

          <div className="control">
            <label htmlFor="email">Email</label>
            <input type="text" 
            name='email'
            onChange={e => setEmail(e.target.value)}
            placeholder='Enter Email'
            />
            <small className="errorMsg">{errEmail}</small>
          </div>

          <div className="control">
            <label htmlFor="password">Password</label>
            <input type="password" 
            name='password'
            onChange={e => setPassword(e.target.value)}
            placeholder='Enter Password'
            />
            <small className="errorMsg">{errPassword}</small>
          </div>

          <div className="control">
            <span>Don't have an account? <Link to='/signup' className='login-link'>Signup</Link></span>
          </div>

          <input type='submit' className='button' value='Login' />
        </form>
        {redirect===true ? <Navigate to='/posts' /> : ''}
      </div>
    </div>
  )
}

export default Login