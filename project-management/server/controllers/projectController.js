import expressAsyncHandler from 'express-async-handler';
import Project from '../models/Project.js';

export const getProjects = expressAsyncHandler(async (req, res) => {
  const projects = await Project.find({ user: req.user._id });
  res.json(projects);
});

export const createProject = expressAsyncHandler(async (req, res) => {
  const { name, description, deadline, status } = req.body;
  const project = new Project({
    name,
    description,
    deadline,
    status: status || 'Active',
    user: req.user._id,
  });

  const createdProject = await project.save();
  res.status(201).json(createdProject);
});

export const getProjectById = expressAsyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project && project.user.toString() === req.user._id.toString()) {
    res.json(project);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});
