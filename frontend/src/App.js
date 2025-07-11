import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch('/api/todos')
      .then(res => res.json())
      .then(data => setTodos(data));
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleAdd = async () => {
    if (input.trim() === '') return;
    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({content: input})
      });
      if (!res.ok) throw new Error('서버 오류');
      const todosRes = await fetch('/api/todos');
      const todosData = await todosRes.json();
      setTodos(todosData);
      setInput('');
    } catch (err) {
      alert('Failed to add todo');
    }
  };

  return (
    <div>
      <h1>TODO LIST</h1>
      <div className='container'>
        <input type='text' 
               placeholder="Input here.."
               value={input}
               onChange={handleInputChange}
        />
        <button onClick={handleAdd}>Add</button>
        <button>Clear</button>
        <button>Clear ALL</button>
      </div>
      <div className='task-list-container'>
        <ul className='task-list'>
          {todos.map(todo => (
            <li key={todo.id}>
              {todo.content}
              <button>finished</button>
              <button>delete</button>
              <button>update</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;