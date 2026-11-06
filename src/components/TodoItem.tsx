import DeleteIcon from '@mui/icons-material/Delete'
import {
  Checkbox,
  IconButton,
  ListItem,
  ListItemText,
  Tooltip,
} from '@mui/material'
import { useTodoStore } from '../store/todoStore'
import type { Todo } from '../types/todo'

interface TodoItemProps {
  todo: Todo
}

export function TodoItem({ todo }: TodoItemProps) {
  const toggleTodo = useTodoStore((state) => state.toggleTodo)
  const removeTodo = useTodoStore((state) => state.removeTodo)

  return (
    <ListItem
      disablePadding
      sx={{
        gap: 1,
        borderBottom: 1,
        borderColor: 'divider',
        '&:last-of-type': { borderBottom: 0 },
      }}
    >
      <Checkbox
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)}
        slotProps={{
          input: { 'aria-label': `Отметить задачу "${todo.title}"` },
        }}
      />
      <ListItemText
        primary={todo.title}
        sx={{
          my: 1,
          color: todo.completed ? 'text.disabled' : 'text.primary',
          textDecoration: todo.completed ? 'line-through' : 'none',
          wordBreak: 'break-word',
        }}
      />
      <Tooltip title="Удалить">
        <IconButton
          edge="end"
          aria-label={`Удалить задачу "${todo.title}"`}
          onClick={() => removeTodo(todo.id)}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </ListItem>
  )
}
