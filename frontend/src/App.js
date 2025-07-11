import './App.css';

function App() {
  return (
    <div>
      <h1>TODO LIST</h1>
      <div className='container'>
        <input type='text' placeholder="Todo.." />
        <button>Add</button>
        <button>Clear</button>
        <button>Clear ALL</button>
      </div>
      <div className='task-list'>
        <ul>
          <li>task1</li>
          <li>task2</li>
          <li>task3</li>
        </ul>
      </div>
    </div>
  );
}

export default App;