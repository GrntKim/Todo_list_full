import React, { useState } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [todos, setTodos] = useState([]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleAdd = () => {
    if (input.trim() === '') return;
    setTodos([...todos, { id: Date.now(), content: input }]);
    setInput('');
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