import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, Users, ListTodo, Plus, ChevronLeft, ArrowRight, Grid, LayoutList } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProjectPage = () => {
  const { id } = useParams();
  const { api } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', status: 'Todo', priority: 'Medium', deadline: '' });

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks/project/${id}`)
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to load project details');
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
        await api.post('/tasks', { ...newTask, projectId: id });
        setShowTaskModal(false);
        setNewTask({ title: '', status: 'Todo', priority: 'Medium', deadline: '' });
        fetchProjectData();
        toast.success('Task added');
    } catch (err) {
        toast.error('Failed to add task');
    }
  };

  const handleUpdateTaskStatus = async (taskId, currentStatus) => {
    // Basic progression cycle: Todo -> In Progress -> Done
    const nextStatus = currentStatus === 'Todo' ? 'In Progress' : currentStatus === 'In Progress' ? 'Done' : 'Todo';
    try {
      await api.put(`/tasks/${taskId}`, { status: nextStatus });
      fetchProjectData();
      toast.success(`Task status updated to ${nextStatus}`);
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Delete this task?")) {
        try {
            await api.delete(`/tasks/${taskId}`);
            fetchProjectData();
            toast.success('Task removed');
        } catch (err) {
            toast.error('Failed to delete task');
        }
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-500 dark:text-slate-400">Loading project...</div>;
  if (!project) return <div className="text-center py-20 text-slate-500 dark:text-slate-400">Project not found.</div>;

  const todoTasks = tasks.filter(t => t.status === 'Todo');
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress');
  const doneTasks = tasks.filter(t => t.status === 'Done');

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 border-slate-200 dark:border-slate-800">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium mb-4 transition gap-1 px-3 py-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-500/10 -ml-3">
          <ChevronLeft size={16} /> Back to Dashboard
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-md dark:shadow-xl relative overflow-hidden transition-colors">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 w-full md:w-2/3">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors">{project.name}</h1>
              <span className={`px-4 py-1 text-sm rounded-full font-bold shadow-sm ${
                  project.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  project.status === 'On Hold' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}>
                {project.status}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed max-w-3xl mt-4 transition-colors">{project.description}</p>
            
            <div className="flex flex-wrap items-center gap-6 mt-6 text-sm">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700/50 transition-colors">
                <Calendar size={18} className="text-emerald-600 dark:text-emerald-400" />
                <span className="font-medium text-slate-700 dark:text-slate-300">Due: <span className="text-slate-900 dark:text-white ml-1">{new Date(project.deadline).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span></span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700/50 transition-colors">
                <ListTodo size={18} className="text-emerald-600 dark:text-emerald-400" />
                <span className="font-medium text-slate-700 dark:text-slate-300"><span className="text-slate-900 dark:text-white">{tasks.length}</span> Total Tasks</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setShowTaskModal(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 hover:-translate-y-0.5 text-white px-6 py-3 rounded-xl transition-all font-semibold shadow-lg shadow-emerald-600/30 relative z-10 whitespace-nowrap w-full md:w-auto mt-6 md:mt-0 justify-center"
          >
            <Plus size={20} />
            Add Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mt-12">
        {/* Kanban Board Columns */}
        {[
          { title: "To Do", tasks: todoTasks, borderColor: "border-slate-300 dark:border-slate-500/50", headerBg: "bg-slate-100 dark:bg-slate-700/30", iconColor: "text-slate-700 dark:text-slate-400" },
          { title: "In Progress", tasks: inProgressTasks, borderColor: "border-blue-300 dark:border-blue-500/50", headerBg: "bg-blue-50 dark:bg-blue-900/20", iconColor: "text-blue-600 dark:text-blue-400" },
          { title: "Done", tasks: doneTasks, borderColor: "border-emerald-300 dark:border-emerald-500/50", headerBg: "bg-emerald-50 dark:bg-emerald-900/20", iconColor: "text-emerald-600 dark:text-emerald-400" }
        ].map(column => (
          <div key={column.title} className={`bg-white dark:bg-slate-800/40 rounded-2xl border ${column.borderColor} p-5 flex flex-col h-full backdrop-blur-sm relative overflow-hidden transition duration-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 shadow-sm`}>
            
            <div className={`flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-700/50 ${column.headerBg} -mx-5 -mt-5 px-5 pt-5`}>
              <h2 className={`font-bold text-lg flex items-center gap-2 ${column.iconColor}`}>
                <div className={`w-2 h-2 rounded-full ${column.title === 'Done' ? 'bg-emerald-500' : column.title === 'In Progress' ? 'bg-blue-500' : 'bg-slate-400'}`}></div>
                {column.title}
              </h2>
              <span className="bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 text-xs py-1 px-3 rounded-full font-bold border border-slate-300 dark:border-slate-700 shadow-inner">
                {column.tasks.length}
              </span>
            </div>
            
            <div className="space-y-4 flex-grow">
              {column.tasks.length === 0 ? (
                <div className="h-32 border-2 border-dashed border-slate-300 dark:border-slate-700/50 rounded-xl flex items-center justify-center text-slate-500 text-sm italic py-8 bg-slate-50 dark:bg-slate-800/20 transition-colors">
                  No tasks here
                </div>
              ) : (
                column.tasks.map(task => (
                  <div key={task._id} className="group bg-slate-50 dark:bg-slate-900/80 rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 transition-all shadow-sm hover:shadow-md dark:shadow-md dark:hover:shadow-xl dark:hover:shadow-emerald-500/10 hover:-translate-y-1 relative">
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <h4 className="font-semibold text-slate-900 dark:text-white leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors pr-6">{task.title}</h4>
                      <button 
                        onClick={() => handleDeleteTask(task._id)}
                        className="opacity-0 group-hover:opacity-100 absolute top-4 right-4 text-slate-500 hover:text-red-400 transition-all p-1 hover:bg-red-500/10 rounded-md flex-shrink-0"
                        title="Delete task"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-4 text-xs font-medium">
                      <span className={`px-2.5 py-1 rounded-md border ${
                        task.priority === 'High' ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20' :
                        task.priority === 'Medium' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20' :
                        'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'
                      }`}>
                        {task.priority} Priority
                      </span>
                      {task.deadline && (
                        <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700/50">
                          <Calendar size={12} className={new Date(task.deadline) < new Date() ? 'text-red-500 dark:text-red-400' : ''} />
                          <span className={new Date(task.deadline) < new Date() ? 'text-red-500 dark:text-red-400' : ''}>
                             {new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </span>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => handleUpdateTaskStatus(task._id, task.status)}
                      className="w-full mt-4 flex items-center justify-center gap-2 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white font-medium py-2 rounded-lg transition-all text-sm group/btn"
                    >
                      Move to {task.status === 'Todo' ? 'In Progress' : task.status === 'In Progress' ? 'Done' : 'Todo'} 
                      <ArrowRight size={14} className="opacity-60 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modern Add Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-900/80 backdrop-blur-md flex justify-center items-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl w-full max-w-md border border-slate-200 dark:border-slate-600 shadow-2xl relative overflow-hidden transition-colors">
            {/* Top decorative glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400"></div>
            
            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2 transition-colors">
              <Plus size={24} className="text-emerald-500 dark:text-emerald-400" />
              New Task
            </h2>
            
            <form onSubmit={handleCreateTask} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1 transition-colors">Task Title <span className="text-red-500 dark:text-red-400">*</span></label>
                <input
                  type="text"
                  placeholder="What needs to be done?"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition shadow-inner"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1 transition-colors">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right .5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: `2.5rem` }}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1 transition-colors">Deadline <span className="text-red-500 dark:text-red-400">*</span></label>
                  <input
                    type="date"
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                    className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition shadow-inner dark:[color-scheme:dark]"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-200 dark:border-slate-700/50">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-6 py-3 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-700 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 hover:-translate-y-0.5 text-white transition-all font-semibold shadow-lg shadow-emerald-600/30"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
