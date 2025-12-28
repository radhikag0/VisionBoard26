import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Target, Trash2, Edit2, Check, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { goalsAPI } from '../services/api';

const Goals = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ title: '', category: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const data = await goalsAPI.getAll();
      setGoals(data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async () => {
    if (newGoal.title.trim() && newGoal.category.trim()) {
      try {
        const createdGoal = await goalsAPI.create(newGoal);
        setGoals([...goals, createdGoal]);
        setNewGoal({ title: '', category: '' });
        setShowAddForm(false);
      } catch (error) {
        console.error('Error creating goal:', error);
      }
    }
  };

  const handleToggleGoal = async (id) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    try {
      const updatedGoal = await goalsAPI.update(id, { completed: !goal.completed });
      setGoals(prevGoals =>
        prevGoals.map(g => g.id === id ? updatedGoal : g)
      );
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      await goalsAPI.delete(id);
      setGoals(prevGoals => prevGoals.filter(goal => goal.id !== id));
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const handleEditStart = (goal) => {
    setEditingId(goal.id);
    setEditText(goal.title);
  };

  const handleEditSave = async (id) => {
    if (editText.trim()) {
      try {
        const updatedGoal = await goalsAPI.update(id, { title: editText });
        setGoals(prevGoals =>
          prevGoals.map(goal => goal.id === id ? updatedGoal : goal)
        );
      } catch (error) {
        console.error('Error updating goal:', error);
      }
    }
    setEditingId(null);
    setEditText('');
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditText('');
  };

  const categories = [...new Set(goals.map(g => g.category))];
  const completedCount = goals.filter(g => g.completed).length;
  const progressPercentage = goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading goals...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
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
            2026 Goals Checklist
          </h1>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white gap-2 transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            Add Goal
          </Button>
        </div>

        {/* Progress Card */}
        <Card className="mb-8 border-2 border-pink-200 bg-gradient-to-r from-pink-100/50 to-fuchsia-100/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{progressPercentage}% Complete</h3>
                <p className="text-gray-600">{completedCount} of {goals.length} goals achieved</p>
              </div>
              <Target className="w-12 h-12 text-pink-400" />
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-pink-400 to-rose-400 h-4 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Add Goal Form */}
        {showAddForm && (
          <Card className="mb-6 border-2 border-pink-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">New Goal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Goal Title</label>
                <Input
                  placeholder="What do you want to achieve?"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  className="border-pink-200 focus:ring-pink-300"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Category</label>
                <Input
                  placeholder="e.g., Health, Career, Finance, Personal"
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                  className="border-pink-200 focus:ring-pink-300"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddGoal} className="bg-pink-400 hover:bg-pink-500 text-white">
                  <Check className="w-4 h-4 mr-2" />
                  Add Goal
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)} className="border-pink-300 hover:bg-pink-50">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Goals by Category */}
        <div className="space-y-6">
          {categories.map((category) => {
            const categoryGoals = goals.filter(g => g.category === category);
            const categoryCompleted = categoryGoals.filter(g => g.completed).length;

            return (
              <div key={category}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-2xl font-semibold text-gray-800">{category}</h2>
                  <span className="text-sm text-gray-500">
                    {categoryCompleted}/{categoryGoals.length} completed
                  </span>
                </div>
                <div className="space-y-3">
                  {categoryGoals.map((goal) => (
                    <Card
                      key={goal.id}
                      className={`border-2 transition-all duration-300 bg-white/80 backdrop-blur-sm group ${
                        goal.completed
                          ? 'border-green-200 bg-green-50/50'
                          : 'border-pink-100 hover:border-pink-300'
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Checkbox
                            checked={goal.completed}
                            onCheckedChange={() => handleToggleGoal(goal.id)}
                            className="border-pink-300 data-[state=checked]:bg-green-400"
                          />
                          {editingId === goal.id ? (
                            <div className="flex-1 flex items-center gap-2">
                              <Input
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="border-pink-200 focus:ring-pink-300"
                                autoFocus
                              />
                              <Button
                                size="sm"
                                onClick={() => handleEditSave(goal.id)}
                                className="bg-green-400 hover:bg-green-500 text-white"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleEditCancel}
                                className="border-gray-300"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <h3
                                className={`flex-1 text-lg font-medium ${
                                  goal.completed ? 'text-gray-500 line-through' : 'text-gray-800'
                                }`}
                              >
                                {goal.title}
                              </h3>
                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEditStart(goal)}
                                  className="hover:bg-pink-100 hover:text-pink-600"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteGoal(goal.id)}
                                  className="hover:bg-rose-100 hover:text-rose-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
          {goals.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <Target className="w-16 h-16 mx-auto mb-4" />
              <p className="text-xl">Start adding your 2026 goals!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Goals;