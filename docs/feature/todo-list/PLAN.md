# План реализации To-Do List

> Журнал изменений:
>
> - [CHANGES-1.md](./CHANGES-1.md) — ограничение длины задачи и адаптивная форма.
> - [CHANGES-2.md](./CHANGES-2.md) — сортировка по дате добавления и фильтр выполненных.

## 1. Цель

Небольшое SPA-приложение для управления задачами:

- добавление новой задачи;
- отметка задачи как выполненной / невыполненной;
- удаление задачи;
- сохранение задач в `localStorage` и восстановление после перезагрузки страницы.

Стек: **React + TypeScript + Zustand (`persist`) + Material UI (MUI)**.

---

## 2. Текущее состояние проекта

Проект создан на Vite и уже содержит React + TypeScript.

Установлены:

- `react`, `react-dom`
- `typescript`, `vite`, `oxlint`

Требуется добавить:

```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material zustand
```

---

## 3. Архитектура и структура файлов

```
src/
├── components/
│   ├── TodoForm.tsx      # поле ввода + кнопка добавления
│   ├── TodoItem.tsx      # одна задача: checkbox, текст, кнопка удаления
│   └── TodoList.tsx      # список задач + пустое состояние
├── store/
│   ├── todoStore.ts      # Zustand store + persist + версионирование
│   └── migrations.ts     # миграции схемы localStorage
├── types/
│   └── todo.ts           # типы Todo и TodoState
├── theme.ts              # (опционально) MUI-тема
├── App.tsx               # компоновка экрана
└── main.tsx              # ThemeProvider, CssBaseline
```

Принципы:

- компоненты отвечают только за отображение и ввод;
- вся логика изменения данных находится в store;
- типы вынесены отдельно и переиспользуются;
- store не хранит функции в `localStorage` (используем `partialize`).

---

## 4. Модель данных

`src/types/todo.ts`:

```ts
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

export interface TodoState {
  todos: Todo[];
  addTodo: (title: string) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
}
```

Правила:

- `id` генерируется через `crypto.randomUUID()`;
- `title` обрезается через `trim()`, пустые значения не добавляются;
- `createdAt` нужен для стабильной сортировки и будущих миграций.

---

## 5. Zustand store и версионирование

`src/store/todoStore.ts`:

```ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { TodoState } from '../types/todo';
import { STORAGE_VERSION, migrateTodos } from './migrations';

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      todos: [],

      addTodo: (title) => {
        const trimmed = title.trim();
        if (!trimmed) return;

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
        }));
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
      migrate: (persistedState, version) => migrateTodos(persistedState, version),
    },
  ),
);
```

Ключевые моменты:

- `name: 'todo-storage'` — единый ключ в `localStorage`;
- `version` — текущая версия схемы, хранится рядом с данными;
- `partialize` — сохраняем только `todos`, без функций;
- `migrate` — приводит старые данные к актуальной схеме.

### Схема версионирования

`src/store/migrations.ts`:

```ts
import type { Todo } from '../types/todo';

export const STORAGE_VERSION = 1;

type PersistedState = { todos?: unknown } | undefined;

export function migrateTodos(
  persistedState: PersistedState,
  version: number,
): { todos: Todo[] } {
  let todos = Array.isArray(persistedState?.todos)
    ? (persistedState.todos as Todo[])
    : [];

  if (version < 1) {
    todos = todos.map((todo) => ({
      id: String(todo.id ?? crypto.randomUUID()),
      title: String(todo.title ?? ''),
      completed: Boolean(todo.completed),
      createdAt: Number(todo.createdAt ?? Date.now()),
    }));
  }

  return { todos };
}
```

Правила изменения схемы:

1. При изменении структуры данных увеличить `STORAGE_VERSION`.
2. Добавить в `migrateTodos` ветку `if (version < N) { ... }`.
3. Миграции писать последовательно, чтобы поддерживать переход с любой старой версии.
4. Не удалять старый ключ `todo-storage` — Zustand сам перезапишет его новой версией.
5. Добавить защиту от повреждённых данных: невалидный массив заменять на `[]`.

### Обработка повреждённого localStorage (опционально)

Если JSON в `todo-storage` невалиден, `persist` может не восстановить состояние. Рекомендуется:

- обернуть чтение в try/catch на уровне приложения;
- либо добавить отдельный `onRehydrateStorage` для логирования ошибки и сброса состояния.

---

## 6. UI на Material UI

`main.tsx`:

- обернуть приложение в `ThemeProvider` и `CssBaseline`;
- опционально подключить `@fontsource/roboto`.

`App.tsx`:

```tsx
<Container maxWidth="sm" sx={{ py: 4 }}>
  <Paper elevation={3} sx={{ p: 3 }}>
    <Typography variant="h4" component="h1" gutterBottom>
      To-Do List
    </Typography>
    <TodoForm />
    <TodoList />
  </Paper>
</Container>
```

### TodoForm

- `TextField` (controlled) + `Button` с иконкой `Add`.
- Отправка по `Enter` через `<form onSubmit>`.
- После добавления поле очищается.
- Кнопка неактивна при пустом/пробельном вводе.

### TodoList

- `List` из MUI.
- Если задач нет — `Typography` / `Alert` с сообщением «Задач пока нет».
- Рендер `TodoItem` для каждой задачи.

### TodoItem

- `ListItem` с `Checkbox` (отметка выполнения).
- Текст задачи: зачёркивание и приглушённый цвет при `completed`.
- `IconButton` с `DeleteIcon` для удаления.
- `aria-label` для доступности кнопок и чекбокса.

Пример поведения:

```tsx
<ListItem
  secondaryAction={
    <IconButton edge="end" aria-label="Удалить задачу" onClick={() => removeTodo(todo.id)}>
      <DeleteIcon />
    </IconButton>
  }
>
  <Checkbox
    checked={todo.completed}
    onChange={() => toggleTodo(todo.id)}
    inputProps={{ 'aria-label': `Отметить задачу "${todo.title}"` }}
  />
  <ListItemText
    primary={todo.title}
    sx={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
  />
</ListItem>
```

---

## 7. Этапы реализации

- [ ] Установить зависимости MUI и Zustand.
- [ ] Создать типы `Todo`, `TodoState`.
- [ ] Реализовать `todoStore.ts` с `persist`, `version`, `partialize`, `migrate`.
- [ ] Реализовать `migrations.ts` и константу `STORAGE_VERSION`.
- [ ] Настроить MUI `ThemeProvider` и `CssBaseline` в `main.tsx`.
- [ ] Сверстать `TodoForm`.
- [ ] Сверстать `TodoItem` и `TodoList`.
- [ ] Собрать экран в `App.tsx`.
- [ ] Удалить/адаптировать демо-контент Vite (`App.css`, ассеты).
- [ ] Проверить сохранение после перезагрузки.
- [ ] Проверить миграцию: вручную записать старую версию данных в `localStorage` и обновить страницу.
- [ ] Запустить `npm run lint` и `npm run build`.

---

## 8. Проверка и критерии готовности

Функциональные проверки:

- [ ] Можно добавить задачу с непустым названием.
- [ ] Пустая строка и строка из пробелов не добавляются.
- [ ] Checkbox переключает статус выполнения.
- [ ] Выполненная задача визуально зачёркнута.
- [ ] Кнопка удаления убирает задачу.
- [ ] После `F5` задачи, статусы и порядок сохраняются.
- [ ] В `localStorage` по ключу `todo-storage` лежат `state.todos` и `version`.
- [ ] При увеличении версии старые данные корректно мигрируют.
- [ ] Повреждённые данные не ломают приложение.
- [ ] `npm run lint` и `npm run build` проходят без ошибок.

---

## 9. Возможные расширения (вне рамок задачи)

- фильтры: все / активные / выполненные;
- редактирование текста задачи;
- очистка выполненных задач;
- счётчик оставшихся задач;
- drag-and-drop сортировка;
- синхронизация с бэкендом;
- unit-тесты store на Vitest.
