export interface Todo {
  id: string
  title: string
  completed: boolean
  createdAt: number
}

export interface TodoState {
  todos: Todo[]
  addTodo: (title: string) => void
  toggleTodo: (id: string) => void
  removeTodo: (id: string) => void
}
