import express from 'express';
const app = express();
app.use(express.json());

let todos = [];

// view todos
app.get('/api/todos', (req, res) => {
    res.json(todos);
});

// add todos
app.post('/api/todos', (req, res) => {
    const { content } = req.body;
    const newTodo = {
        id: Date.now(),
        content,
        createdAt: new Date().toISOString(),
        completed: false
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

// modify(status, content) todo
app.patch('/api/todos/:id', (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    const todo = todos.find(t => t.id == id);
    if (todo) {
        todo.completed = completed;
        res.json(todo);
    } else {
        res.status(404).json({ error: 'Not found'});
    }
});

// delete todo
app.delete('/api/todos/:id', (req, res) => {
    todos = todos.filter(t => t.id == req.params.id);
    res.status(204).end();
});

app.listen(5000, () => console.log('Server started'));