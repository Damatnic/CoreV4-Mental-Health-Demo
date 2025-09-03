import React from 'react';
import { motion } from 'framer-motion';
import { Heart, TrendingUp, Target, Brain, Shield } from 'lucide-react';
import { useWellnessStore } from '../../stores/wellnessStore';

export function MentalHealthDashboard() {
  const {
    currentMood,
    moodEntries,
    wellnessGoals,
    getMoodAverage,
    getMoodTrend,
    getCompletedGoalsCount
  } = useWellnessStore();

  const moodAverage = getMoodAverage(7);
  const moodTrend = getMoodTrend();
  const completedGoals = getCompletedGoalsCount();
  const totalGoals = wellnessGoals.length;

  const dashboardStats = [
    {
      title: 'Current Mood',
      value: `${currentMood}/10`,
      icon: <Heart className="h-6 w-6" />,
      color: currentMood >= 7 ? 'text-green-600' : currentMood >= 4 ? 'text-yellow-600' : 'text-red-600',
      bgColor: currentMood >= 7 ? 'bg-green-50' : currentMood >= 4 ? 'bg-yellow-50' : 'bg-red-50'
    },
    {
      title: '7-Day Average',
      value: `${moodAverage}/10`,
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Goals Completed',
      value: `${completedGoals}/${totalGoals}`,
      icon: <Target className="h-6 w-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Wellness Trend',
      value: moodTrend.charAt(0).toUpperCase() + moodTrend.slice(1),
      icon: <Brain className="h-6 w-6" />,
      color: moodTrend === 'improving' ? 'text-green-600' : 
             moodTrend === 'declining' ? 'text-red-600' : 'text-gray-600',
      bgColor: moodTrend === 'improving' ? 'bg-green-50' : 
               moodTrend === 'declining' ? 'bg-red-50' : 'bg-gray-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mental Health Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your wellness journey</p>
        </div>
        <div className="flex items-center space-x-2 text-green-600">
          <Shield className="h-5 w-5" />
          <span className="text-sm font-medium">HIPAA Compliant</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${stat.bgColor} rounded-xl p-6 border border-gray-200`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Mood Entries */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 border border-gray-200"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Mood Entries</h2>
        
        {moodEntries.length === 0 ? (
          <div className="text-center py-8">
            <Heart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No mood entries yet</p>
            <p className="text-sm text-gray-400 mt-1">Start tracking your mood to see insights</p>
          </div>
        ) : (
          <div className="space-y-3">
            {moodEntries.slice(0, 5).map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    entry.mood >= 7 ? 'bg-green-500' :
                    entry.mood >= 4 ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900">Mood: {entry.mood}/10</p>
                    {entry.notes && (
                      <p className="text-sm text-gray-600 mt-1">{entry.notes}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(entry.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Wellness Goals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl p-6 border border-gray-200"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Wellness Goals</h2>
        
        {wellnessGoals.length === 0 ? (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No wellness goals set</p>
            <p className="text-sm text-gray-400 mt-1">Set goals to track your progress</p>
          </div>
        ) : (
          <div className="space-y-4">
            {wellnessGoals.slice(0, 3).map((goal) => {
              const progressPercentage = (goal.currentValue / goal.targetValue) * 100;
              
              return (
                <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{goal.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      goal.completed
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {goal.completed ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">
                        {goal.currentValue}/{goal.targetValue} {goal.unit}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          goal.completed ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}