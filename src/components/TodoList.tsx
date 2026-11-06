import { Box, List, Typography } from '@mui/material'
import type { Todo } from '../types/todo'
import { TodoItem } from './TodoItem'

interface TodoListProps {
  todos: Todo[]
  emptyMessage?: string
}

export function TodoList({
  todos,
  emptyMessage = 'Задач пока нет',
}: TodoListProps) {
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
        <Typography>{emptyMessage}</Typography>
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
