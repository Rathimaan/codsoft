import expressAsyncHandler from 'express-async-handler';
import Task from '../models/Task.js';
import Project from '../models/Project.js';

export const getTasks = expressAsyncHandler(async (req, res) => {
  const tasks = await Task.find({ project: req.params.projectId }).populate('assignedTo', 'name email');
  res.json(tasks);
});

export const createTask = expressAsyncHandler(async (req, res) => {
  const { title, projectId, assignedTo, status, priority, deadline } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const task = new Task({
    title,
    project: projectId,
    assignedTo: assignedTo || null,
    status: status || 'Todo',
    priority: priority || 'Medium',
    deadline,
  });

  const createdTask = await task.save();
  res.status(201).json(createdTask);
});

export const updateTask = expressAsyncHandler(async (req, res) => {
  const { status, assignedTo, deadline } = req.body;
  const task = await Task.findById(req.params.id);

  if (task) {
    task.status = status || task.status;
    task.assignedTo = assignedTo !== undefined ? assignedTo : task.assignedTo;
    task.deadline = deadline || task.deadline;
    
    const updatedTask = await task.save();
    res.json(updatedTask);
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

export const deleteTask = expressAsyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (task) {
    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});
