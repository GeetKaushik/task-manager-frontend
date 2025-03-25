import { useEffect, useState } from 'react'
import { api } from '../api'
import { useNavigate } from 'react-router-dom'
import {
  MoonIcon,
  SunIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon,
  PencilIcon,
  CheckCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/solid'

export default function Dashboard({ token }) {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [editTaskTitle, setEditTaskTitle] = useState('')
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true'
  )
  const [loading, setLoading] = useState(false); // Loader state
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) navigate('/login')

    const fetchTasks = async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/tasks', { 
          headers: { Authorization: `Bearer ${token}` },
        })
        setTasks(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false);
      }
    }
    fetchTasks()
  }, [token, navigate])

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  const handleAddTask = async (e) => {
    e.preventDefault()
    if (!newTask.trim()) return
    setLoading(true);
    try {
      const res = await api.post(
        '/api/tasks', 
        { title: newTask },
        { headers: { Authorization: `Bearer ${token}` } } 
      )
      setTasks([...tasks, res.data])
      setNewTask('')
    } catch (err) {
      console.error('Error adding task:', err)
    } finally {
      setLoading(false);
    }
  }

  const toggleComplete = async (taskId, completed) => {
    setLoading(true);
    try {
      await api.put(
        `/api/tasks/${taskId}`, 
        { completed: !completed },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setTasks(
        tasks.map((task) =>
          task._id === taskId ? { ...task, completed: !completed } : task
        )
      )
    } catch (err) {
      console.error('Error updating task:', err)
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (taskId) => {
    setLoading(true);
    try {
      await api.delete(`/api/tasks/${taskId}`, { 
        headers: { Authorization: `Bearer ${token}` },
      })
      setTasks(tasks.filter((task) => task._id !== taskId))
    } catch (err) {
      console.error('Error deleting task:', err)
    } finally {
      setLoading(false);
    }
  }

  const handleEditTask = async (taskId) => {
    setLoading(true);
    try {
      await api.put(
        `/api/tasks/${taskId}`, 
        { title: editTaskTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setTasks(
        tasks.map((task) =>
          task._id === taskId ? { ...task, title: editTaskTitle } : task
        )
      )
      setEditingTaskId(null)
      setEditTaskTitle('')
    } catch (err) {
      console.error('Error updating task title:', err)
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`p-4 min-h-screen ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'
      }`}>
      {/* Dark Mode Toggle */}
      <button
        className="absolute top-4 right-4 p-2 rounded"
        onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? (
          <SunIcon className="w-6 h-6 text-white" />
        ) : (
          <MoonIcon className="w-6 h-6 text-gray-800" />
        )}
      </button>

      <div className="max-w-[90%] md:max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center">Your Tasks</h2>

        {/* Loader */}
        {loading && (
          <div className="text-center text-blue-500 font-bold my-2">Loading...</div>
        )}

        {/* Task Input Form */}
        <form
          onSubmit={handleAddTask}
          className="mt-4 flex flex-col md:flex-row gap-2">
          <input
            type="text"
            placeholder="New Task"
            className={`border p-2 flex-1 rounded w-full ${
              darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'
            }`}
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button
            className={`py-2 px-4 rounded w-full md:w-auto flex justify-center items-center ${
              newTask.trim()
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-gray-400 text-gray-700 cursor-not-allowed'
            }`}
            disabled={!newTask.trim()}>
            <PlusIcon className="w-6 h-6" />
          </button>
        </form>

        {/* Task List */}
        <ul className="mt-4">
          {tasks.map((task) => (
            <li
              key={task._id}
              className={`border p-2 mt-2 flex flex-col md:flex-row justify-between rounded items-center ${
                task.completed
                  ? darkMode
                    ? 'bg-green-700'
                    : 'bg-green-200'
                  : darkMode
                  ? 'bg-gray-800'
                  : 'bg-white'
              }`}>
              <div className="flex-1 text-center md:text-left w-full">
                {editingTaskId === task._id ? (
                  <input
                    type="text"
                    value={editTaskTitle}
                    onChange={(e) => setEditTaskTitle(e.target.value)}
                    className={`border p-1 rounded w-full md:w-auto text-center md:text-left ${
                      darkMode
                        ? 'bg-gray-700 text-white'
                        : 'bg-white text-black'
                    }`}
                  />
                ) : (
                  <span>{task.title}</span>
                )}
              </div>
              <div className="flex gap-2 flex-wrap justify-center mt-2 md:mt-0">
                <button
                  onClick={() => toggleComplete(task._id, task.completed)}>
                  {task.completed ? (
                    <XMarkIcon className="w-6 h-6 text-blue-500" />
                  ) : (
                    <CheckIcon className="w-6 h-6 text-blue-500" />
                  )}
                </button>
                {editingTaskId === task._id ? (
                  <button onClick={() => handleEditTask(task._id)}>
                    <CheckCircleIcon className="w-6 h-6 text-green-500" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingTaskId(task._id)
                      setEditTaskTitle(task.title)
                    }}>
                    <PencilIcon className="w-6 h-6 text-yellow-500" />
                  </button>
                )}
                <button onClick={() => handleDelete(task._id)}>
                  <TrashIcon className="w-6 h-6 text-red-500" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
