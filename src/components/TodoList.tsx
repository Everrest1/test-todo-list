import { Box, List, Typography } from '@mui/material'
import { useTodoStore } from '../store/todoStore'
import { TodoItem } from './TodoItem'

export function TodoList() {
  const todos = useTodoStore((state) => state.todos)

  if (todos.length === 0) {
    return (
      <Box
        sx={{
          py: 4,
          textAlign: 'center',
          color: 'text.secondary',
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
        }}
      >
        <Typography>Задач пока нет</Typography>
      </Box>
    )
  }

  return (
    <List disablePadding>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </List>
  )
}
