import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const inputRef = useRef();

  const [todos, setTodos] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editingInput, setEditingInput] = useState('');
  const editingInputRef = useRef();

  useEffect(() => {
    if (editingId !== null) {
      editingInputRef.current && editingInputRef.current.focus();
    }
  }, [editingId]);


  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAdd();
    } else if (e.key === 'Escape') {
      handleInputClear();
    }
  };

  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
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

  const handleEditInputChange = (e) => {
    setEditingInput(e.target.value);
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
      alert('Failed to add todo: ' + err.message);
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
      alert('Failed to delete todo: ' + err.message);
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
      alert('Failed to delete all todos: ' + err.message);
    }
  };

  const handleInputClear = () => {
    setInput('');
    inputRef.current.focus();
  }

  const handleEditInputClear = () => {
    setEditingInput('');
    editingInputRef.current.focus();
  }

  const handleStartEdit = (id, content) => {
    setEditingId(id);
    setEditingInput(content);
  };

  const handleSaveEdit = async () => {
    if (editingInput.trim() === '') return;
    try {
      const res = await fetch(`/api/todos/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({content: editingInput})
      });
      if (!res.ok) throw new Error('server error');
      const todosRes = await fetch('/api/todos');
      const todosData = await todosRes.json();
      setTodos(todosData);
      setEditingId(null);
      setEditingInput('');
      inputRef.current.focus();
    } catch (err) {
      alert('Failed to update todo: ' + err.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingInput('');
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
        <button onClick={handleInputClear}>Clear input</button>
        <button onClick={handleDeleteAll}> Clear ALL </button>
      </div>
      <div className='task-list-container'>
        <ul className='task-list'>
          {todos.map(todo => (
            <li key={todo.id}>
              {editingId === todo.id ? (
                <div className='edit-container'>
                  <input
                    ref={editingInputRef}
                    type='text'
                    value={editingInput}
                    onChange={handleEditInputChange}
                    onKeyDown={handleEditKeyDown}
                  />
                  <button onClick={handleSaveEdit}>Save</button>
                  <button onClick={handleEditInputClear}>Clear</button>
                  <button onClick={handleCancelEdit}>Cancel</button>
                </div>
              ) : (
                <>
                  <span>{todo.content}</span>
                  <div>
                    <button>finished</button>
                    <button onClick={() => handleDelete(todo.id)}>delete</button>
                    <button onClick={() => {handleStartEdit(todo.id, todo.content)}}>update</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;