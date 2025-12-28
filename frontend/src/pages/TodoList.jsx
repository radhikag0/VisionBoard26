import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Calendar, Flag, Check, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { todosAPI } from '../services/api';

const TodoList = () => {
  const navigate = useNavigate();
  const [todos, setTodos] = useState(mockTodos);
  const [newTodo, setNewTodo] = useState({ title: '', priority: 'medium', dueDate: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  const priorityColors = {
    high: 'bg-rose-400 text-white',
    medium: 'bg-pink-300 text-white',
    low: 'bg-fuchsia-200 text-gray-700'
  };

  const handleAddTodo = () => {
    if (newTodo.title.trim()) {
      const todo = {
        id: Date.now().toString(),
        title: newTodo.title,
        priority: newTodo.priority,
        dueDate: newTodo.dueDate,
        completed: false,
        createdAt: new Date().toISOString()
      };
      setTodos([...todos, todo]);
      setNewTodo({ title: '', priority: 'medium', dueDate: '' });
      setShowAddForm(false);
    }
  };

  const handleToggleTodo = (id) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  const activeTodos = todos.filter(t => !t.completed);
  const completedTodos = todos.filter(t => t.completed);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="gap-2 hover:bg-pink-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-400 bg-clip-text text-transparent">
            To-Do Lists
          </h1>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white gap-2 transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </Button>
        </div>

        {/* Add Todo Form */}
        {showAddForm && (
          <Card className="mb-6 border-2 border-pink-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">New Task</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="What needs to be done?"
                value={newTodo.title}
                onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                className="border-pink-200 focus:ring-pink-300"
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Priority</label>
                  <select
                    value={newTodo.priority}
                    onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-pink-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Due Date</label>
                  <Input
                    type="date"
                    value={newTodo.dueDate}
                    onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
                    className="border-pink-200 focus:ring-pink-300"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddTodo} className="bg-pink-400 hover:bg-pink-500 text-white">
                  <Check className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)} className="border-pink-300 hover:bg-pink-50">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Todos */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Flag className="w-6 h-6 text-pink-400" />
              Active Tasks ({activeTodos.length})
            </h2>
            <div className="space-y-3">
              {activeTodos.map((todo) => (
                <Card key={todo.id} className="border-2 border-pink-100 hover:border-pink-300 transition-all duration-300 bg-white/80 backdrop-blur-sm group">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => handleToggleTodo(todo.id)}
                        className="mt-1 border-pink-300 data-[state=checked]:bg-pink-400"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-800 mb-2">{todo.title}</h3>
                        <div className="flex items-center gap-3 text-sm">
                          <Badge className={priorityColors[todo.priority]}>
                            {todo.priority.toUpperCase()}
                          </Badge>
                          {todo.dueDate && (
                            <span className="flex items-center gap-1 text-gray-500">
                              <Calendar className="w-4 h-4" />
                              {new Date(todo.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteTodo(todo.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-100 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {activeTodos.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-lg">No active tasks. Great job!</p>
                </div>
              )}
            </div>
          </div>

          {/* Completed Todos */}
          {completedTodos.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Check className="w-6 h-6 text-green-400" />
                Completed ({completedTodos.length})
              </h2>
              <div className="space-y-3">
                {completedTodos.map((todo) => (
                  <Card key={todo.id} className="border-2 border-green-100 bg-green-50/50 backdrop-blur-sm group">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={todo.completed}
                          onCheckedChange={() => handleToggleTodo(todo.id)}
                          className="mt-1 border-green-300 data-[state=checked]:bg-green-400"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-600 line-through mb-2">{todo.title}</h3>
                          <div className="flex items-center gap-3 text-sm">
                            <Badge className={priorityColors[todo.priority]}>
                              {todo.priority.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteTodo(todo.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-100 hover:text-rose-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoList;