import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { TodoState } from '../types/todo'
import { migrateTodos, STORAGE_VERSION } from './migrations'

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      todos: [],

      addTodo: (title) => {
        const trimmed = title.trim()
        if (!trimmed) return

        set((state) => ({
          todos: [
            ...state.todos,
            {
              id: crypto.randomUUID(),
              title: trimmed,
              completed: false,
              createdAt: Date.now(),
            },
          ],
        }))
      },

      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo,
          ),
        })),

      removeTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),
    }),
    {
      name: 'todo-storage',
      version: STORAGE_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ todos: state.todos }),
      migrate: (persistedState, version) =>
        migrateTodos(persistedState, version),
    },
  ),
)
