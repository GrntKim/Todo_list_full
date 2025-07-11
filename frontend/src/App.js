import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const inputRef = useRef();
  const [todos, setTodos] = useState([]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

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
      if (!res.ok) throw new Error('server error');
      const todosRes = await fetch('/api/todos');
      const todosData = await todosRes.json();
      setTodos(todosData);
      setInput('');
      inputRef.current.focus();
    } catch (err) {
      alert('Failed to add todo' + err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('server error');
      const todosRes = await fetch('/api/todos');
      const todosData = await todosRes.json();
      setTodos(todosData);
    } catch (err) {
      alert('Failed to delete todo');
    }
  };

  const handleDeleteAll = async () => {
    try {
      const count = todos.length;
      const message = count == 1
        ? 'Delete 1 todo item?'
        : `Delete ${count} todo items?`;
      if (window.confirm(message)) {
        const res = await fetch('/api/todos/', {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error('server error');
        const todosRes = await fetch('/api/todos');
        const todosData = await todosRes.json();
        setTodos(todosData);
      }
    } catch (err) {
      alert('Failed to delete all todos');
    }
  };

  return (
    <div>
      <h1>TODO LIST</h1>
      <div className='container'>
        <input 
          ref={inputRef}
          type='text' 
          placeholder="Input here.."
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleAdd}>Add</button>
        <button onClick={() => {
            setInput(''); 
            inputRef.current.focus();}}>Clear input</button>
        <button onClick={handleDeleteAll}>
          Clear ALL
        </button>
      </div>
      <div className='task-list-container'>
        <ul className='task-list'>
          {todos.map(todo => (
            <li key={todo.id}>
              <span>{todo.content}</span>
              <div>
                <button>finished</button>
                <button onClick={() => handleDelete(todo.id)}>delete</button>
                <button>update</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;