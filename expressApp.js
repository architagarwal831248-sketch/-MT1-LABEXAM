import express from 'express';

const app = express();

app.use(express.json());

// Sample employee tasks
let tasks = [
    {
        id: 1,
        taskName: "Develop Login Page",
        assignedTo: "Rahul Sharma",
        status: "Pending",
        priority: "High"
    },
    {
        id: 2,
        taskName: "Create Database",
        assignedTo: "Amit Kumar",
        status: "Completed",
        priority: "Medium"
    },
    {
        id: 3,
        taskName: "Design Homepage",
        assignedTo: "Priya Singh",
        status: "In Progress",
        priority: "High"
    }
];

// 1. GET - Display all tasks
app.get('/tasks', (req, res) => {
    res.status(200).json(tasks);
});

// 2. GET - Display task by ID
app.get('/tasks/:id', (req, res) => {

    const id = Number(req.params.id);

    const task = tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({
            message: 'Task not found'
        });
    }

    res.status(200).json(task);
});

// 3. POST - Add a new task
app.post('/tasks', (req, res) => {

    const { id, taskName, assignedTo, status, priority } = req.body;

    if (
        id === undefined ||
        !Number.isInteger(id) ||
        !taskName ||
        !assignedTo ||
        !status
    ) {
        return res.status(400).json({
            message: 'Please provide id, taskName, assignedTo and status'
        });
    }

    const existingTask = tasks.find(t => t.id === id);

    if (existingTask) {
        return res.status(409).json({
            message: 'Task ID already exists'
        });
    }

    const newTask = {
        id,
        taskName,
        assignedTo,
        status,
        priority: priority || "Medium"
    };

    tasks.push(newTask);

    res.status(201).json({
        message: 'Task added successfully',
        task: newTask
    });
});

// 4. PUT - Update task details
app.put('/tasks/:id', (req, res) => {

    const id = Number(req.params.id);

    const task = tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({
            message: 'Task not found'
        });
    }

    const { taskName, assignedTo, status, priority } = req.body;

    if (!taskName || !assignedTo || !status) {
        return res.status(400).json({
            message: 'Please provide taskName, assignedTo and status'
        });
    }

    task.taskName = taskName;
    task.assignedTo = assignedTo;
    task.status = status;

    if (priority !== undefined) {
        task.priority = priority;
    }

    res.status(200).json({
        message: 'Task updated successfully',
        task: task
    });
});

// 5. DELETE - Delete a task
app.delete('/tasks/:id', (req, res) => {

    const id = Number(req.params.id);

    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: 'Task not found'
        });
    }

    const deletedTask = tasks.splice(index, 1);

    res.status(200).json({
        message: 'Task deleted successfully',
        task: deletedTask[0]
    });
});

// Invalid routes
app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found'
    });
});

// Handle invalid JSON and other errors
app.use((err, req, res, next) => {

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            message: 'Invalid JSON data'
        });
    }

    res.status(500).json({
        message: 'Internal Server Error'
    });
});

// Start server
app.listen(4000, () => {
    console.log('Express Server running at http://localhost:4000');
});