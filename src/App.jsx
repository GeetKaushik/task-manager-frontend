import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Auth from './pages/Auth'

function App() {
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true) // Track loading state

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken) // Only set token if it exists
    }
    setLoading(false) // Mark loading as complete
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>
  }

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth setToken={setToken} />} />
        <Route
          path="/dashboard"
          element={
            token ? <Dashboard token={token} /> : <Navigate to="/auth" />
          }
        />
        <Route
          path="*"
          element={<Navigate replace to={token ? "/dashboard" : "/auth"} />}
        />
      </Routes>
    </Router>
  )
}

export default App
