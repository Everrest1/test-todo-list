import { Box, Container, Paper, Typography } from '@mui/material'
import { TodoForm } from './components/TodoForm'
import { TodoList } from './components/TodoList'
import { useTodoStore } from './store/todoStore'

function App() {
  const todos = useTodoStore((state) => state.todos)
  const remaining = todos.filter((todo) => !todo.completed).length

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 3, sm: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            To-Do List
          </Typography>
          <Typography color="text.secondary">
            Осталось задач: {remaining} из {todos.length}
          </Typography>
        </Box>

        <TodoForm />
        <TodoList />
      </Paper>
    </Container>
  )
}

export default App
