import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import { TodoForm, TodoList, Footer } from './components/todo'
import { addTodo, generateId, findById, toggleTodo, updateTodo, removeTodo, filterTodos } from './lib/todoHelpers'
import { pipe, partial } from './lib/utils'
import { loadTodos, createTodo, saveTodo, destroyTodo } from './lib/todoService'

class App extends Component {
  state = {
    todos: [],
    currentTodo: '',
    errorMessage: ''
  }

  static contextTypes = {
    route: React.PropTypes.string
  }

  componentDidMount() {
    loadTodos()
      .then(todos => this.setState({todos}))
  }

  handleRemove = (id, e) => {
    e.preventDefault()

    const updatedTodos = removeTodo(this.state.todos, id)
    this.setState({ todos: updatedTodos })

    destroyTodo(id)
      .then(() => this.showTempMessage('Todo Removed'))
  }

  handleToggle = (id) => {
    const getToggledTodo = pipe(findById, toggleTodo)
    const updated = getToggledTodo(id, this.state.todos);

    const getUpdatedTodos = partial(updateTodo, this.state.todos);
    const updatedTodos = getUpdatedTodos(updated)
    this.setState({ todos: updatedTodos })

    saveTodo(updated)
      .then(() => this.showTempMessage('Todo Updated'))
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const newId = generateId()
    const newTodo = { id: newId, name: this.state.currentTodo, isComplete: false }
    const updatedTodos = addTodo(this.state.todos, newTodo)

    this.setState({
      todos: updatedTodos,
      currentTodo: '',
      errorMessage: ''
    })

    createTodo(newTodo)
      .then(() => this.showTempMessage('Todo added'))
  }

  showTempMessage = (message) => {
    this.setState({message})
    setTimeout(() => this.setState({ message: '' }), 2500)
  }

  handleEmptySubmit = (e) => {
    e.preventDefault();

    this.setState({
      errorMessage: 'Please supply a todo name'
    })
  }

  handleInputChange = (e) => {
    this.setState({ currentTodo: e.target.value })
  }

  render() {
    const submitHandler = this.state.currentTodo ? this.handleSubmit : this.handleEmptySubmit;
    const displayTodos = filterTodos(this.state.todos, this.context.route)

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>React Todos</h2>
        </div>
        <div className="Todo-App">
          {this.state.errorMessage && <span className='error'>{this.state.errorMessage}</span>}
          {this.state.message && <span className='success'>{this.state.message}</span>}
          <TodoForm
            currentTodo={this.state.currentTodo}
            handleInputChange={this.handleInputChange}
            handleSubmit={submitHandler}/>
          <TodoList
            todos={displayTodos}
            handleToggle={this.handleToggle}
            handleRemove={this.handleRemove}/>
        </div>
        <Footer/>
      </div>
    );
  }
}

export default App;
