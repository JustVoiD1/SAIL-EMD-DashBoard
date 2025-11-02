'use client'
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import React, { FormEvent, useEffect, useState } from 'react'
import { Todo, TodoFormData } from '@/lib/types'
import { Button } from '@/components/ui/button';
import MyLoader from './MyLoader';
import { toast } from 'sonner';

interface TodoManagerProps {
    projectId: string,
    className?: string
}

const TodoManager = ({ projectId, className }: TodoManagerProps) => {
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

        const currTodoId = Math.floor(Math.random() * 10000)
        try {
            const currTodo: Todo = {
                id: currTodoId,
                title: formData.title,
                description: formData.description,
                priority: formData.priority,
                due_date: formData.due_date,
                is_done: false,
                project_id: parseInt(projectId),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }

            setTodos(todos => [currTodo, ...todos])
            const resetFormData = {
                title: '',
                description: '',
                priority: 'medium' as 'low' | 'medium' | 'high',
                due_date: new Date().toISOString().split('T')[0]
            };
            setFormData(resetFormData);
            setShowAddForm(false);

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
                setTodos(prevTodos =>
                    prevTodos.map(t => t.id === currTodo.id ? data.todo : t)
                );

            }
            else {
                setTodos(prevTodos => prevTodos.filter(t => t.id !== currTodoId));
                throw new Error('error adding todo')

            }



        } catch (err) {
            console.error('Error adding todo: ', err);
            setTodos(prevTodos => prevTodos.filter(t => t.id !== currTodoId));
            setFormData(formData); // Restore form data
            setShowAddForm(true); // Show form again
            toast.error('Failed to add todo. Please try again.');

        }
    }

    const toggleTodo = async (todoId: number, currentStatus: boolean) => {
        try {
            const token = localStorage.getItem('token');
            const todo = todos.find(t => t.id === todoId);
            setTodos(todos.map(t => t.id === todoId ? { ...t, is_done: !currentStatus } : t));


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

            if (!response.ok) {
                setTodos(todos.map(t => t.id === todoId ? { ...t, is_done: currentStatus } : t));
                console.error('Failed to update todo');
                toast.error('Failed to update todo. Please try again.');
            }
        } catch (err) {
            setTodos(todos.map(t => t.id === todoId ? { ...t, is_done: currentStatus } : t));
            console.error('Error Updating todo: ', err);
            toast.error('Failed to update todo. Please try again.');
        }
    }

    const handleUpdateTodo = async (e: FormEvent) => {
        e.preventDefault();
        if (!editingTodo || !editFormData.title.trim()) return;

        const originalTodo = editingTodo

        const updatedTodo = {
            ...editingTodo,
            title: editFormData.title,
            description: editFormData.description || '',
            priority: editFormData.priority,
            due_date: editFormData.due_date || '',
            updated_at: new Date().toISOString()
        };
        try {

            setTodos(prevTodos =>
                prevTodos.map(t => t.id === editingTodo.id ? updatedTodo : t)
            );

            cancelEdit()
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
            }
            else {
                console.error('Todo update failed')
                setTodos(prevTodos =>
                    prevTodos.map(t => t.id === editingTodo.id ? originalTodo : t)
                );
                setEditingTodo(originalTodo);
                setEditFormData({
                    title: originalTodo.title,
                    description: originalTodo.description || '',
                    priority: originalTodo.priority,
                    due_date: originalTodo.due_date || ''
                });
            }

        } catch (err) {
            console.error('Error updating todo: ', err);
            setTodos(prevTodos =>
                prevTodos.map(t => t.id === editingTodo.id ? originalTodo : t)
            );
            setEditingTodo(originalTodo);
            setEditFormData({
                title: originalTodo.title,
                description: originalTodo.description || '',
                priority: originalTodo.priority,
                due_date: originalTodo.due_date || ''
            });
            toast.error('Failed to update todo. Please try again.');

        }
    }

    const deleteTodo = async (todoId: number) => {
        const wish = window.confirm('Are you sure you want to delete the todo? this action cannot be undone.')
        if (!wish) return;
        const todoToDelete = todos.find(t => t.id === todoId)
        if (!todoToDelete) return;
        try {
            setTodos(prevTodos => prevTodos.filter(t => t.id !== todoId))
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/projects/${projectId}/todos/${todoId}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-type': 'application/json'
                }
            })
            if (!response.ok) {
                // setTodos(todos.filter(t => t.id !== todoId));
                toast.error('Failed to delete todo')
                setTodos(prevTodos => [...prevTodos, todoToDelete].sort((a, b) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                ));
            }
        } catch (err) {
            console.error('Error deleting todo: ', err);
            setTodos(prevTodos => [...prevTodos, todoToDelete].sort((a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            ));
            toast.error('Failed to delete todo')
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
        <div className={className}>
            <div className="flex justify-between items-center h-full">
                <div>
                    <h3 className="text-lg font-semibold">Project Todos</h3>
                    <p className="text-sm text-foreground">
                        {todos.filter(t => t.is_done).length} of {todos.length} done ({calculateProgress()}%)
                    </p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className={`px-4 py-2 transition-none ${showAddForm ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg `}
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
                            <label>
                                <span className="block text-sm font-medium mb-1">Title</span>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-lg"
                                    placeholder="Enter todo title"
                                    required
                                />
                            </label>
                        </div>
                        <div>
                            <label>

                                <span className="block text-sm font-medium mb-1">Description</span>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-lg"
                                    placeholder="Enter description (optional)"
                                    rows={3}
                                />
                            </label>

                        </div>
                        <div>
                            <label>

                            <span className="block text-sm font-medium mb-1">Priority</span>
                            <Select
                                value={formData.priority}
                                onValueChange={(value) => setFormData({ ...formData, priority: value as 'low' | 'medium' | 'high' })}
                            // className="w-full px-3 py-2 border border-border rounded-lg"
                            >
                                <SelectTrigger className='w-full bg-background border-2 border-accent shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50'>
                                    <SelectValue placeholder='Priority' />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                            </label>

                        </div>
                        <div>
                            <label>

                            <span className="block text-sm font-medium mb-1">Due Date</span>
                            <input
                                type="date"
                                value={formData.due_date}
                                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-lg"
                            />
                            </label>

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
                                        description: '',
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
            <div className="space-y-2 overflow-y-auto max-h-[40vh]">
                {isLoading ? (
                    <MyLoader content='Loading Todos...' />
                ) : todos.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">No todos yet. Add your first todo!</div>
                ) : (
                    todos.map((todo) => (
                        <div key={todo.id} className={`rounded-lg p-3 ${todo.is_done ? 'bg-blue-100/15 border border-blue-400/50 ' : 'bg-card border border-border'}`}>
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
                                    <div className="flex gap-2 w-full">
                                        <Select
                                            value={editFormData.priority}
                                            onValueChange={(value) => setEditFormData({ ...editFormData, priority: value as 'low' | 'medium' | 'high' })}
                                        // className="px-3 py-2 border border-border rounded-lg"
                                        >
                                            <SelectTrigger className='w-full px-3 py-2 border border-border bg-background'>
                                                <SelectValue placeholder='Priority' />
                                            </SelectTrigger>
                                            <SelectContent>

                                                <SelectItem value="low">Low</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="high">High</SelectItem>
                                            </SelectContent>
                                        </Select>
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