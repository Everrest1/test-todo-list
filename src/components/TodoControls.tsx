import {
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'

export type TodoSortOrder = 'newest' | 'oldest'

interface TodoControlsProps {
  sortOrder: TodoSortOrder
  onSortOrderChange: (value: TodoSortOrder) => void
  hideCompleted: boolean
  onHideCompletedChange: (value: boolean) => void
}

export function TodoControls({
  sortOrder,
  onSortOrderChange,
  hideCompleted,
  onHideCompletedChange,
}: TodoControlsProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 1.5, sm: 2 },
        mb: 2,
        bgcolor: 'background.default',
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1, sm: 2 }}
        sx={{
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
        }}
      >
        <ToggleButtonGroup
          size="small"
          exclusive
          value={sortOrder}
          onChange={(_event, value: TodoSortOrder | null) => {
            if (value) onSortOrderChange(value)
          }}
          aria-label="Сортировка по дате добавления"
          sx={{ width: { xs: '100%', sm: 'auto' }, flexShrink: 0 }}
        >
          <ToggleButton
            value="newest"
            sx={{ fontSize: 12, textTransform: 'none', flex: { xs: 1, sm: 'initial' }, whiteSpace: 'nowrap' }}
          >
            Сначала новые
          </ToggleButton>
          <ToggleButton
            value="oldest"
            sx={{ fontSize: 12, textTransform: 'none', flex: { xs: 1, sm: 'initial' }, whiteSpace: 'nowrap' }}
          >
            Сначала старые
          </ToggleButton>
        </ToggleButtonGroup>

        <FormControlLabel
          control={
            <Switch
              checked={hideCompleted}
              onChange={(event) => onHideCompletedChange(event.target.checked)}
            />
          }
          label="Скрыть выполненные"
          sx={{ m: 0, flexShrink: 0, whiteSpace: 'nowrap' }}
        />
      </Stack>
    </Paper>
  )
}
