
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {register} from '../api/auth'
import useAuthStore from '../store/authStore'



function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  })

  const [error, setError] = useState('')
    const navigate = useNavigate()
    const setAuth = useAuthStore((state)=>state.setAuth)

    const handleChange = (e)=>{
      setFormData({
        ...formData,
        [e.target.name]:e.target.value
      })
    
    }

    const handleSubmit = async(e)=>{
      e.preventDefault();
      setError('')


    try{
      const data = await register(formData)
      setAuth(data.user, data.token)
      navigate('/dashboard')

    }catch(error){
      setError(error.response.data.message)
    }
        }
  
  return (
     <div className="auth-container">
      <h1>Register</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
export default Register;