import {useState} from 'react'
import { Link,Navigate } from 'react-router-dom'
import {createUserWithEmailAndPassword,updateProfile} from 'firebase/auth'
import {auth} from '../firebase.config'

const Signup = () => {
  const [username,setUsername] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [errUsername,setErrUsername] = useState('');
  const [errEmail,setErrEmail] = useState('');
  const [errPassword,setErrPassword] = useState('');
  const [redirect,setRedirect] = useState(false);

  const validateForm = () => {
    let validity = true
    
    if(username==='') {
      validity = false
      setErrUsername('*Please Enter Your Name')
    }

    if(typeof(username) !== 'undefined') {
      if (!(username.length > 3)) {
        validity = false
        setErrUsername('*Please Enter More Than 3 Characters')
      }
    }

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
      console.log(username)
      console.log(email)
      console.log(password)

    createUserWithEmailAndPassword(auth,email,password)
    .then(async (res) => {
      const user = res.user
      await updateProfile(user, {
        displayName: username,
      })
    })
    .catch(err => console.log(err))

    alert('Registered Successfully!')
    setRedirect(true)
    }

    setUsername('')
    setEmail('')
    setPassword('')
  }

  return (
    <div className='Signup'>
      <div className="container">
        <form method='post' 
        className="form" 
        name='Login-Form' 
        onSubmit={(e) => handleSubmit(e)}
        >
          <h2>Sign Up</h2>

          <div className="control">
            <label htmlFor="username">Username</label>
            <input type="text" 
            name='username'
            onChange={e => setUsername(e.target.value)}
            placeholder='Enter Username'
            />
            <small className="errorMsg">{errUsername}</small>
          </div>

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
            <span>Already have an account? <Link to='/login' className='login-link'>Login</Link></span>
          </div>

          <input type='submit' className='button' value='Sign Up' />
        </form>
        {redirect===true ? <Navigate to='/login' /> : ''}
      </div>
    </div>
  )
}

export default Signup