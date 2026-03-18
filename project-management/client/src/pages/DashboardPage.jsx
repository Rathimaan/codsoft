import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Calendar, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

const DashboardPage = () => {
  const { api } = useAuth();
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '', deadline: '' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (err) {
      toast.error('Failed to load projects');
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      setShowModal(false);
      setNewProject({ name: '', description: '', deadline: '' });
      fetchProjects();
      toast.success('Project created successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors">Your Projects</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1 transition-colors">Manage and track your active projects</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg transition font-medium shadow-lg shadow-emerald-500/20"
        >
          <PlusCircle size={20} />
          New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 transition-colors shadow-sm">
          <h3 className="text-xl text-slate-700 dark:text-slate-300 transition-colors">No projects yet</h3>
          <p className="text-slate-500 mt-2">Create your first project to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col hover:border-emerald-500 dark:hover:border-emerald-500/50 transition duration-300 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white truncate pr-4 transition-colors">{project.name}</h3>
                <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                  project.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' :
                  project.status === 'On Hold' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {project.status}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 flex-grow line-clamp-2 transition-colors">{project.description}</p>
              
              <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                <Calendar size={16} />
                <span>Due {new Date(project.deadline).toLocaleDateString()}</span>
              </div>
              
              <Link 
                to={`/projects/${project._id}`}
                className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/50 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-medium py-2 rounded-lg transition-colors"
              >
                View Project <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-900/80 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl w-full max-w-md border border-slate-200 dark:border-slate-700 shadow-2xl transition-colors">
            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white transition-colors">Create New Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors">Project Name</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors">Description</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white h-32 resize-none focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors">Deadline</label>
                <input
                  type="date"
                  value={newProject.deadline}
                  onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                  className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition font-medium"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
