import { useState, useEffect } from 'react';
import axios from 'axios';

const EditTask = ({ task, onEditTask, onCancel }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState(task.status);
  const [error, setError] = useState('');

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || '');
    setStatus(task.status);
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!title.trim()) return;
  
    const updatedTask = {
      _id: task._id,
      title,
      description,
      status: status === 'Done' ? true : false,
    };
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found. Please login first.');
      }
  
      const url = `http://localhost:3000/api/v1/task/${updatedTask._id}`;
      const response = await axios.put(url, updatedTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      onEditTask(response.data.task);
      onCancel();
    } catch (err) {
      console.error("Error updating task:", err);
      setError('Error updating task. Please try again.');
      if (err.response) {
        setError(err.response.data.message || 'An error occurred.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Task</h3>
          <form onSubmit={handleSubmit} className="mt-2 text-left">
            {error && <p className="text-red-500">{error}</p>}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-title">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="edit-title"
                type="text"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-description">
                Description
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="edit-description"
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
                  checked={status === 'Done'}
                  onChange={(e) => setStatus(e.target.checked ? 'Done' : 'Pending')}
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
                Save Changes
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={onCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTask;