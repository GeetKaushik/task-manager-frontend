import { useState } from 'react'
import { api } from '../api'
import { useNavigate } from 'react-router-dom'

export default function Auth({ setToken }) {
  const [isRegister, setIsRegister] = useState(false) // Toggle between Login & Register
  const [name, setName] = useState('') // Name field (only for registration)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login'
      const data = isRegister ? { name, email, password } : { email, password }

      const res = await api.post(endpoint, data)
      setToken(res.data.token)
      localStorage.setItem('token', res.data.token)
      navigate('/dashboard')
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || 'Something went wrong'))
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">
        {isRegister ? 'Register' : 'Login'}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80">
        {isRegister && (
          <input
            type="text"
            placeholder="Name"
            className="border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-blue-500 text-white p-2 rounded">
          {isRegister ? 'Register' : 'Login'}
        </button>
      </form>

      <button
        className="mt-4 text-sm text-blue-500"
        onClick={() => setIsRegister(!isRegister)}>
        {isRegister
          ? 'Already have an account? Login'
          : "Don't have an account? Register"}
      </button>
    </div>
  )
}
