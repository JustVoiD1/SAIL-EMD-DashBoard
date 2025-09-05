'use client'
import React, { FormEvent, useEffect, useState } from 'react'
import { Todo, TodoFormData } from '@/lib/types'

interface TodoManagerProps {
    projectId: string
}

const TodoManager = ({ projectId }: TodoManagerProps) => {
    const [todos, setTodos] = useState<Todo[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showAddForm, setShowAddForm] = useState(false)
    const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
    const [editFormData, setEditFormData] = useState<TodoFormData>({
        title: '',
        description: '',
        priority: 'medium'
    })

    const [formData, setFormData] = useState<TodoFormData>({
        title: '',
        description: '',
        priority: 'medium',
        due_date: new Date().toISOString().split('T')[0]
    })

    const startEdit = (todo: Todo) => {
        setEditingTodo(todo);
        setEditFormData({
            title: todo.title,
            description: todo.description || '',
            priority: todo.priority,
            due_date: todo.due_date || ''
        })
    }

    const cancelEdit = () => {
        setEditingTodo(null);
        setEditFormData({
            title: '',
            description: '',
            priority: 'medium',
            due_date: '',
        })
    }
    const fetchTodos = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/projects/${projectId}/todos`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            if (response.ok) {
                const data = await response.json();
                setTodos(data.todos);

            }
        } catch (err) {
            console.error('Error fetching todos: ', err);

        } finally {
            setIsLoading(false);
        }
    }

    const handleAddTodo = async (e: FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim()) return;

        try {

            const token = localStorage.getItem('token');
            const response = await fetch(`/api/projects/${projectId}/todos`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                setTodos([data.todo, ...todos]);
                setFormData({ title: '', description: '', priority: 'medium' , due_date: new Date().toISOString().split('T')[0]});
                setShowAddForm(false);
            }



        } catch (err) {
            console.error('Error adding todo: ', err);
        }
    }

    const toggleTodo = async (todoId: number, currentStatus: boolean) => {
        try {
            const token = localStorage.getItem('token');
            const todo = todos.find(t => t.id === todoId);

            const response = await fetch(`/api/projects/${projectId}/todos/${todoId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...todo,
                    is_done: !currentStatus
                })
            });

            if (response.ok) {
                setTodos(todos.map(t => t.id === todoId ? { ...t, is_done: !currentStatus } : t));
            }
        } catch (err) {
            console.error('Error updating todo: ', err);
        }
    }

    const handleUpdateTodo = async (e: FormEvent) => {
        e.preventDefault();
        if (!editingTodo || !editFormData.title.trim()) return;

        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`/api/projects/${projectId}/todos/${editingTodo.id}`, {
                method: 'PUT',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    ...editFormData,
                    is_done: editingTodo.is_done
                })
            })
            if (response.ok) {
                const data = await response.json();
                setTodos(todos.map(t => t.id === editingTodo.id ? data.todo : t));
                cancelEdit();
            }

        } catch (err) {
            console.error('Error updating todo: ', err);
        }
    }

    const deleteTodo = async (todoId: number) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/projects/${projectId}/todos/${todoId}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-type': 'application/json'
                }
            })
            if (response.ok) {
                setTodos(todos.filter(t => t.id !== todoId));
            }
        } catch (err) {
            console.error('Error deleting todo: ', err);
        }

    }


    // Calculate progress from todos
    const calculateProgress = (): number => {
        if (todos.length === 0) return 0
        const done = todos.filter(todo => todo.is_done).length
        return Math.round((done / todos.length) * 100)
    }

    useEffect(() => {
        fetchTodos();
    }, [projectId])

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Project Todos</h3>
                    <p className="text-sm text-muted-foreground">
                        {todos.filter(t => t.is_done).length} of {todos.length} done ({calculateProgress()}%)
                    </p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    {showAddForm ? 'Cancel' : 'Add Todo'}
                </button>
            </div>

            {/* Add Todo Form */}
            {showAddForm && (
                <div className="bg-card border border-border rounded-lg p-4">
                    <h4 className="text-md font-medium mb-4">Add New Todo</h4>
                    <form onSubmit={handleAddTodo} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-lg"
                                placeholder="Enter todo title"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-lg"
                                placeholder="Enter description (optional)"
                                rows={3}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Priority</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                                className="w-full px-3 py-2 border border-border rounded-lg"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Due Date</label>
                            <input
                                type="date"
                                value={formData.due_date}
                                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-lg"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Add Todo
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAddForm(false);
                                    setFormData({
                                        title: '',
                                        description : '',
                                        priority: 'medium',
                                        due_date: new Date().toISOString().split('T')[0]
                                    })
                                }}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Todo List */}
            <div className="space-y-2">
                {isLoading ? (
                    <div className="text-center py-4">Loading todos...</div>
                ) : todos.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">No todos yet. Add your first todo!</div>
                ) : (
                    todos.map((todo) => (
                        <div key={todo.id} className={`rounded-lg p-3 ${todo.is_done ? 'bg-blue-100/50 border border-blue-400/50 ' : 'bg-card border border-border'}`}>
                            {editingTodo?.id === todo.id ? (
                                // Edit Form
                                <form onSubmit={handleUpdateTodo} className="space-y-3">
                                    <input
                                        type="text"
                                        value={editFormData.title}
                                        onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-border rounded-lg"
                                        placeholder='Todo title'
                                        required
                                    />
                                    <textarea
                                        value={editFormData.description}
                                        onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                        className="w-full min-h-[5vh] px-3 py-2 border border-border rounded-lg"
                                        placeholder='Todo description'
                                        rows={2}
                                    />
                                    <div className="flex gap-2">
                                        <select
                                            value={editFormData.priority}
                                            onChange={(e) => setEditFormData({ ...editFormData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                                            className="px-3 py-2 border border-border rounded-lg"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                        <input
                                            type="date"
                                            value={editFormData.due_date}
                                            onChange={(e) => setEditFormData({ ...editFormData, due_date: e.target.value })}
                                            className="px-3 py-2 border border-border rounded-lg"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                                        >
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            onClick={cancelEdit}
                                            className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                // Display Mode
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            checked={todo.is_done}
                                            onChange={() => toggleTodo(todo.id, todo.is_done)}
                                            className="h-4 w-4"
                                        />
                                        <div className={`flex-1 ${todo.is_done ? 'line-through text-muted-foreground/50' : ''}`}>
                                            <h5 className="font-medium">{todo.title}</h5>
                                            {todo.description && (
                                                <p className="text-sm">{todo.description}</p>
                                            )}
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`text-xs px-2 py-1 rounded ${todo.priority === 'high' ? 'bg-red-100 text-red-700' :
                                                        todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-green-100 text-green-700'
                                                    }`}>
                                                    {todo.priority}
                                                </span>
                                                {todo.due_date && (
                                                    <span className="text-xs">
                                                        Due: {new Date(todo.due_date).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => startEdit(todo)}
                                            className="text-blue-600 hover:text-blue-800 text-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteTodo(todo.id)}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default TodoManager