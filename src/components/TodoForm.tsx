import { useState, type FormEvent } from 'react'
import AddIcon from '@mui/icons-material/Add'
import { Button, Stack, TextField } from '@mui/material'
import { MAX_TODO_TITLE_LENGTH } from '../constants'
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
    <form onSubmit={handleSubmit}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        sx={{
          mb: 2,
          alignItems: { xs: 'stretch', sm: 'flex-start' },
        }}
      >
        <TextField
          fullWidth
          size="small"
          label="Новая задача"
          placeholder="Например, купить молоко"
          value={title}
          onChange={(event) =>
            setTitle(event.target.value.slice(0, MAX_TODO_TITLE_LENGTH))
          }
          autoComplete="off"
          helperText={`${title.length}/${MAX_TODO_TITLE_LENGTH}`}
          slotProps={{
            htmlInput: { maxLength: MAX_TODO_TITLE_LENGTH },
            formHelperText: { sx: { textAlign: 'right', mx: 0 } },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          startIcon={<AddIcon />}
          disabled={!canSubmit}
          sx={{ flexShrink: 0, width: { xs: '100%', sm: 'auto' } }}
        >
          Добавить
        </Button>
      </Stack>
    </form>
  )
}
