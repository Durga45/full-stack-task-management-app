import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import TaskList from './TaskList';
import EditTask from './EditTask'; 

const AddTask = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null); 
  const [modalOpen, setModalOpen] = useState(false); 
  const [fullName, setFullName] = useState(''); 
  const navigate = useNavigate(); 

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found. Please login first.');
      }

      const response = await axios.get('https://full-stack-task-management-app-backend.onrender.com/api/v1/tasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(response.data.tasks);
    } catch (err) {
      setError('Error fetching tasks. Please try again.');
      console.error('Error fetching tasks:', err);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found. Please login first.');
      }

      const response = await axios.get('https://full-stack-task-management-app-backend.onrender.com/api/v1/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFullName(response.data.fullName);
    } catch (err) {
      setError('Error fetching user details. Please try again.');
      console.error('Error fetching user details:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found. Please login first.');
      }

      const response = await axios.post('https://full-stack-task-management-app-backend.onrender.com/api/v1/create/tasks', {
        title,
        description,
        status: isDone, 
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks((prevTasks) => [response.data, ...prevTasks]);
      setTitle('');
      setDescription('');
      setIsDone(false);
      setError(null);
    } catch (err) {
      setError('Error creating task. Please try again.');
      console.error('Error creating task:', err);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true); 
  };

  const handleCancelEdit = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  const handleDelete = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found. Please login first.');
      }

      await axios.delete(`https://full-stack-task-management-app-backend.onrender.com/api/v1/task/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (err) {
      setError('Error deleting task. Please try again.');
      console.error('Error deleting task:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  useEffect(() => {
    fetchTasks();
    fetchUserDetails();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="flex justify-between mb-4">
        <div className="text-xl text-gray-700">
          Welcome, {fullName}
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Logout
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="title"
            type="text"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            placeholder="Enter task description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
          />
        </div>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isDone}
              onChange={(e) => setIsDone(e.target.checked)}  
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2 text-gray-700">Mark as done</span>
          </label>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Add Task
          </button>
          <span className="text-sm text-gray-600">
            Status: {isDone ? 'Done' : 'Pending'}
          </span>
        </div>
      </form>

      {tasks.length > 0 ? (
        tasks.map((task) => (
          <TaskList
            key={task._id}
            title={task.title}
            description={task.description}
            status={task.status ? 'Done' : 'Pending'}
            onEdit={() => handleEdit(task)}
            onDelete={() => handleDelete(task._id)} 
          />
        ))
      ) : (
        <div>No tasks found</div>
      )}

      {modalOpen && (
        <EditTask
          task={editingTask}
          onEditTask={(updatedTask) => {
            setTasks((prevTasks) => 
              prevTasks.map((task) => task._id === updatedTask._id ? updatedTask : task)
            );
            handleCancelEdit();
          }}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
};

export default AddTask;
