import type { Todo } from '../types/todo'

export const STORAGE_VERSION = 1

interface PersistedTodos {
  todos: Todo[]
}

function normalizeTodos(value: unknown): Todo[] {
  if (!Array.isArray(value)) return []

  return value.flatMap((item) => {
    if (typeof item !== 'object' || item === null) return []

    const todo = item as Partial<Todo>
    const title = typeof todo.title === 'string' ? todo.title.trim() : ''
    if (!title) return []

    return [
      {
        id:
          typeof todo.id === 'string' && todo.id.length > 0
            ? todo.id
            : crypto.randomUUID(),
        title,
        completed: Boolean(todo.completed),
        createdAt:
          typeof todo.createdAt === 'number' &&
          Number.isFinite(todo.createdAt)
            ? todo.createdAt
            : Date.now(),
      },
    ]
  })
}

const migrations: Record<number, (state: PersistedTodos) => PersistedTodos> = {
  0: (state) => ({ todos: normalizeTodos(state.todos) }),
}

export function migrateTodos(
  persistedState: unknown,
  version: number,
): PersistedTodos {
  const state =
    typeof persistedState === 'object' && persistedState !== null
      ? (persistedState as { todos?: unknown })
      : {}

  let result: PersistedTodos = { todos: normalizeTodos(state.todos) }

  for (let current = version; current < STORAGE_VERSION; current += 1) {
    const migration = migrations[current]
    if (migration) {
      result = migration(result)
    }
  }

  return result
}
