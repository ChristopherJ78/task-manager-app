import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Circle, Clock, CheckSquare, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { tasks, loading } = useTasks();
    const { user } = useAuth();

    if (loading) {
        return <div className="flex h-[50vh] items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>;
    }

    const completedTasks = tasks.filter(t => t.completed);
    const pendingTasks = tasks.filter(t => !t.completed);
    const totalTasks = tasks.length;

    const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks.length / totalTasks) * 100);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.email?.split('@')[0]}!
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Here is a summary of your tasks for today.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition-transform hover:scale-[1.02]">
                    <div className="p-4 bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 rounded-xl">
                        <CheckSquare size={32} />
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Tasks</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalTasks}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition-transform hover:scale-[1.02]">
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 rounded-xl">
                        <Clock size={32} />
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Pending</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{pendingTasks.length}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition-transform hover:scale-[1.02]">
                    <div className="p-4 bg-green-50 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-xl">
                        <CheckCircle2 size={32} />
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Completed</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{completedTasks.length}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

                {/* Productivity Card */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Productivity Task</h2>
                    <div className="flex flex-col items-center justify-center p-8">
                        <div className="relative h-40 w-40 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90 pointer-events-none">
                                <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-100 dark:text-gray-700" />
                                <circle
                                    cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="8" fill="none"
                                    className="text-primary-500"
                                    strokeDasharray={`${completionRate * 2.8} 280`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-4xl font-extrabold text-gray-900 dark:text-white">{completionRate}%</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Done</span>
                            </div>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 mt-4 text-center">
                            {completionRate === 100 ? "Amazing! You've completed all tasks." : completionRate > 50 ? "Great job, keep it up!" : "Let's get some things done!"}
                        </p>
                    </div>
                </div>

                {/* Recent Tasks */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Tasks</h2>
                        <Link to="/tasks" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">View All</Link>
                    </div>

                    <div className="space-y-4">
                        {tasks.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                <p>No tasks yet.</p>
                                <Link to="/tasks" className="text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1 mt-2">
                                    <Plus size={16} /> Create one
                                </Link>
                            </div>
                        ) : (
                            tasks.slice(0, 4).map(task => (
                                <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                                    <div className="text-gray-400 mt-0.5">
                                        {task.completed ? <CheckCircle2 className="text-green-500" size={20} /> : <Circle size={20} />}
                                    </div>
                                    <div className="flex-1 truncate">
                                        <p className={`text-sm font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-gray-100'}`}>
                                            {task.title}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {format(new Date(task.created_at), 'MMM d, h:mm a')}
                                        </p>
                                    </div>
                                    {task.category && (
                                        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                                            {task.category}
                                        </span>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
