import { useState, useEffect, useRef } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import './App.css'

// ----------------------------------------------------------------------
// SUB-KOMPONEN: SortableTodoItem (Komponen Todo Item dengan Drag & Drop)
// ----------------------------------------------------------------------
function SortableTodoItem({
  todo,
  onToggle,
  onDelete,
  onStartEdit,
  editingId,
  editingText,
  setEditingText,
  onSaveEdit,
  onCancelEdit,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const isEditing = editingId === todo.id
  const editInputRef = useRef(null)

  // Auto focus saat masuk mode edit
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus()
    }
  }, [isEditing])

  // Cek apakah tugas sudah lewat tenggat waktu (overdue)
  const isOverdue = () => {
    if (!todo.dueDate || todo.completed) return false
    const today = new Date().toISOString().split('T')[0]
    return todo.dueDate < today
  }

  // Label prioritas
  const priorityLabels = {
    high: { label: 'Tinggi', class: 'high' },
    medium: { label: 'Sedang', class: 'medium' },
    low: { label: 'Rendah', class: 'low' },
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`todo-item ${todo.completed ? 'completed' : ''} ${
        isDragging ? 'is-dragging' : ''
      }`}
    >
      {/* Handle Drag & Drop */}
      <div
        className="drag-handle"
        {...attributes}
        {...listeners}
        title="Geser untuk mengubah urutan"
      >
        ⋮⋮
      </div>

      <div className="todo-main-content">
        {/* Checkbox Tandai Selesai */}
        <div className="custom-checkbox" onClick={() => onToggle(todo.id)}>
          <span className="checkmark">✓</span>
        </div>

        {/* Konten Teks Tugas & Metadata */}
        <div className="todo-details">
          {isEditing ? (
            /* Mode Edit Inline */
            <input
              ref={editInputRef}
              type="text"
              className="inline-edit-input"
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSaveEdit(todo.id)
                if (e.key === 'Escape') onCancelEdit()
              }}
              onBlur={() => onSaveEdit(todo.id)}
            />
          ) : (
            /* Mode Tampilan Teks Normal */
            <div className="todo-text-row">
              <span
                className="todo-text"
                onDoubleClick={() => onStartEdit(todo)}
                title="Klik 2x untuk edit"
              >
                {todo.text}
              </span>
              <span className="edit-hint">(klik 2x untuk edit)</span>
            </div>
          )}

          {/* Badges: Prioritas & Tenggat Waktu */}
          <div className="badges-container">
            {todo.priority && (
              <span
                className={`priority-badge ${
                  priorityLabels[todo.priority]?.class || 'medium'
                }`}
              >
                ● {priorityLabels[todo.priority]?.label || 'Sedang'}
              </span>
            )}

            {todo.dueDate && (
              <span
                className={`duedate-badge ${isOverdue() ? 'overdue' : ''}`}
              >
                📅 {todo.dueDate} {isOverdue() ? '(Lewat Tenggat)' : ''}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Aksi Tugas: Tombol Edit & Tombol Hapus */}
      <div className="todo-actions">
        {!isEditing && (
          <button
            className="btn-action edit"
            onClick={() => onStartEdit(todo)}
            title="Edit tugas"
          >
            ✏️
          </button>
        )}
        <button
          className="btn-action delete"
          onClick={() => onDelete(todo.id)}
          title="Hapus tugas"
        >
          🗑️
        </button>
      </div>
    </li>
  )
}

// ----------------------------------------------------------------------
// KOMPONEN UTAMA (App)
// ----------------------------------------------------------------------
function App() {
  // 1. STATE MANAGEMENT

  // State Todos (Mengambil data awal dari localStorage)
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('my_react_todos_pro')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Gagal membaca data dari localStorage', e)
        return []
      }
    }
    return [
      {
        id: '1',
        text: 'Belajar konsep dasar React (useState & useEffect)',
        completed: true,
        priority: 'high',
        dueDate: '2026-09-01',
      },
      {
        id: '2',
        text: 'Membuat aplikasi To-Do List Pro dengan Drag & Drop',
        completed: false,
        priority: 'high',
        dueDate: '2026-09-05',
      },
      {
        id: '3',
        text: 'Mencoba fitur Edit Inline (Klik 2x) & Dark/Light Mode',
        completed: false,
        priority: 'medium',
        dueDate: '',
      },
    ]
  })

  // State Form Input Tugas
  const [inputText, setInputText] = useState('')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')

  // State Filter & Theme
  const [filter, setFilter] = useState('all')
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('my_react_theme') || 'dark'
  })

  // State Edit Inline
  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState('')

  // 2. SENSOR DRAG & DROP (@dnd-kit)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4, // Geser sedikit dulu sebelum dragging aktif
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // 3. EFFECTS (LOCAL STORAGE & THEME)

  // Simpan todos ke localStorage setiap kali state `todos` berubah
  useEffect(() => {
    localStorage.setItem('my_react_todos_pro', JSON.stringify(todos))
  }, [todos])

  // Terapkan tema (Dark/Light) pada elemen HTML
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('my_react_theme', theme)
  }, [theme])

  // 4. HANDLERS (FUNGSI AKSI)

  // Tambah Tugas Baru
  const handleAddTodo = (e) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const newTodo = {
      id: String(Date.now()),
      text: inputText.trim(),
      completed: false,
      priority: priority,
      dueDate: dueDate,
      createdAt: Date.now(),
    }

    setTodos([newTodo, ...todos])
    setInputText('')
    setDueDate('')
    setPriority('medium')
  }

  // Toggle Selesai / Belum Selesai
  const handleToggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  // Hapus Tugas Individual
  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  // Hapus Semua Tugas Selesai
  const handleClearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed))
  }

  // Toggle Mode Gelap / Terang
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'))
  }

  // Mulai Mode Edit Inline
  const handleStartEdit = (todo) => {
    setEditingId(todo.id)
    setEditingText(todo.text)
  }

  // Simpan Hasil Edit
  const handleSaveEdit = (id) => {
    if (!editingText.trim()) {
      handleDeleteTodo(id)
    } else {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, text: editingText.trim() } : todo
        )
      )
    }
    setEditingId(null)
    setEditingText('')
  }

  // Batal Edit
  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingText('')
  }

  // Handler Selesai Drag & Drop Reordering
  const handleDragEnd = (event) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setTodos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  // 5. FILTERING LOGIC
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const activeCount = todos.filter((todo) => !todo.completed).length
  const completedCount = todos.length - activeCount

  return (
    <div className="todo-app">
      {/* Header Application & Theme Switcher */}
      <header className="app-header">
        <div className="header-top">
          <h1 className="app-title">React Task Manager</h1>
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
        <p className="app-subtitle">Kelola tugas pro dengan Drag & Drop, Due Date & Edit Inline</p>
      </header>

      {/* Form Input Tambah Tugas Pro */}
      <form className="todo-form-container" onSubmit={handleAddTodo}>
        <div className="todo-form-main">
          <div className="input-wrapper">
            <input
              type="text"
              className="todo-input"
              placeholder="Tambah tugas baru... (tekan Enter)"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-add">
            <span>+</span> Tambah
          </button>
        </div>

        {/* Opsi Ekstra Form: Prioritas & Due Date */}
        <div className="form-options">
          <div className="option-field">
            <span className="option-label">Prioritas:</span>
            <select
              className="option-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="high">🔴 Tinggi</option>
              <option value="medium">🟡 Sedang</option>
              <option value="low">🟢 Rendah</option>
            </select>
          </div>

          <div className="option-field">
            <span className="option-label">Deadline:</span>
            <input
              type="date"
              className="option-date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>
      </form>

      {/* Controls Bar (Filter & Counter) */}
      <div className="controls-bar">
        <div className="filter-group">
          <button
            className={`btn-filter ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Semua ({todos.length})
          </button>
          <button
            className={`btn-filter ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Aktif ({activeCount})
          </button>
          <button
            className={`btn-filter ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Selesai ({completedCount})
          </button>
        </div>

        <div className="stats-badge">
          Tersisa: <span>{activeCount} tugas</span>
        </div>
      </div>

      {/* Daftar Tugas Drag & Drop (@dnd-kit) */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredTodos.map((todo) => todo.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="todo-list">
            {filteredTodos.length > 0 ? (
              filteredTodos.map((todo) => (
                <SortableTodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                  onStartEdit={handleStartEdit}
                  editingId={editingId}
                  editingText={editingText}
                  setEditingText={setEditingText}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={handleCancelEdit}
                />
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">✨</div>
                <p className="empty-text">
                  {filter === 'active'
                    ? 'Semua tugas aktif sudah selesai! Bagus!'
                    : filter === 'completed'
                    ? 'Belum ada tugas yang diselesaikan.'
                    : 'Belum ada tugas. Tambahkan tugas pertamamu di atas!'}
                </p>
              </div>
            )}
          </ul>
        </SortableContext>
      </DndContext>

      {/* Footer Bar jika ada tugas selesai */}
      {completedCount > 0 && (
        <div className="footer-bar">
          <button className="btn-clear" onClick={handleClearCompleted}>
            Hapus {completedCount} tugas selesai
          </button>
        </div>
      )}
    </div>
  )
}

export default App
