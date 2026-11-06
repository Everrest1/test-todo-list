import { useMemo, useState } from 'react'
import { Box, Container, Paper, Typography } from '@mui/material'
import { TodoControls, type TodoSortOrder } from './components/TodoControls'
import { TodoForm } from './components/TodoForm'
import { TodoList } from './components/TodoList'
import { useTodoStore } from './store/todoStore'

function App() {
  const todos = useTodoStore((state) => state.todos)
  const [sortOrder, setSortOrder] = useState<TodoSortOrder>('newest')
  const [hideCompleted, setHideCompleted] = useState(false)

  const visibleTodos = useMemo(() => {
    const filtered = hideCompleted
      ? todos.filter((todo) => !todo.completed)
      : todos

    return [...filtered].sort((a, b) => {
      const byDate = b.createdAt - a.createdAt
      return sortOrder === 'newest' ? byDate : -byDate
    })
  }, [todos, sortOrder, hideCompleted])

  const remaining = todos.filter((todo) => !todo.completed).length
  const emptyMessage =
    todos.length > 0 ? 'Все задачи выполнены' : 'Задач пока нет'

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, sm: 6 } }}>
      <Paper
        elevation={3}
        sx={{ maxWidth: 760, mx: 'auto', p: { xs: 2, sm: 4 } }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            To-Do List
          </Typography>
          <Typography color="text.secondary">
            Осталось задач: {remaining} из {todos.length}
          </Typography>
        </Box>

        <TodoForm />
        <TodoControls
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          hideCompleted={hideCompleted}
          onHideCompletedChange={setHideCompleted}
        />
        <TodoList todos={visibleTodos} emptyMessage={emptyMessage} />
      </Paper>
    </Container>
  )
}

export default App
