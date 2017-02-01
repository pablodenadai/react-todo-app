export const addTodo = (list, item) => [...list, item]

export const generateId = () => Math.floor(Math.random() * 10000)

export const findById = (id, list) => list.find(item => item.id === id)

export const toggleTodo = (todo) => ({ ...todo, isComplete: !todo.isComplete })

export const updateTodo = (list, updated) => {
  const updatedIndex = list.findIndex(item => item.id === updated.id)

  return [
    ...list.slice(0, updatedIndex),
    updated,
    ...list.slice(updatedIndex + 1)
  ]
}

export const removeTodo = (list, id) => {
  const removedIndex = list.findIndex(item => item.id === id)

  return [
    ...list.slice(0, removedIndex),
    ...list.slice(removedIndex + 1)
  ]
}

export const filterTodos = (list, route) => {
  switch (route) {
    case '/active':
      return list.filter(item => !item.isComplete)
    case '/complete':
      return list.filter(item => item.isComplete)
    default:
      return list
  }
}
