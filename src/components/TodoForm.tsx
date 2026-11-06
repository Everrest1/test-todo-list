import { useState, type FormEvent } from 'react'
import AddIcon from '@mui/icons-material/Add'
import { Button, Stack, TextField } from '@mui/material'
import { useTodoStore } from '../store/todoStore'

export function TodoForm() {
  const [title, setTitle] = useState('')
  const addTodo = useTodoStore((state) => state.addTodo)

  const canSubmit = title.trim().length > 0

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) return

    addTodo(title)
    setTitle('')
  }

  return (
    <Stack
      component="form"
      direction="row"
      spacing={1}
      onSubmit={handleSubmit}
      sx={{ mb: 2 }}
    >
      <TextField
        fullWidth
        size="small"
        label="Новая задача"
        placeholder="Например, купить молоко"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        autoComplete="off"
      />
      <Button
        type="submit"
        variant="contained"
        startIcon={<AddIcon />}
        disabled={!canSubmit}
        sx={{ flexShrink: 0 }}
      >
        Добавить
      </Button>
    </Stack>
  )
}
