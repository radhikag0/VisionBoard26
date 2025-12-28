import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ListTodo, Target, ImageIcon, LayoutGrid } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const Dashboard = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Mood Board',
      description: 'Create your visual inspiration collage',
      icon: LayoutGrid,
      path: '/moodboard',
      color: 'from-pink-200 to-pink-300'
    },
    {
      title: 'To-Do Lists',
      description: 'Track your tasks with priorities',
      icon: ListTodo,
      path: '/todos',
      color: 'from-rose-200 to-rose-300'
    },
    {
      title: 'Goals Checklist',
      description: 'Set and achieve your 2026 goals',
      icon: Target,
      path: '/goals',
      color: 'from-pink-200 to-fuchsia-200'
    },
    {
      title: 'Memory Gallery',
      description: 'Store your precious photos and videos',
      icon: ImageIcon,
      path: '/gallery',
      color: 'from-fuchsia-200 to-pink-300'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-pink-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-400 bg-clip-text text-transparent">
              My 2026 Vision Board
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Welcome to your personal space for dreams, goals, and memories. Let's make 2026 your best year yet!
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="group cursor-pointer border-2 border-pink-100 hover:border-pink-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white/80 backdrop-blur-sm"
                onClick={() => navigate(feature.path)}
              >
                <CardHeader>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-gray-800">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white transition-all duration-300"
                  >
                    Open {feature.title}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

 
      </div>
    </div>
  );
};

export default Dashboard;