import { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { CheckCircle2, Circle, Trash2, Edit2, Plus, Search, Filter, X } from 'lucide-react';
import { format } from 'date-fns';

const MODES = {
    ALL: 'All',
    PENDING: 'Pending',
    COMPLETED: 'Completed'
};

const CATEGORIES = ['Personal', 'Work', 'Study', 'Shopping', 'Other'];

const Tasks = () => {
    const { tasks, loading, addTask, toggleTaskStatus, updateTask, deleteTask } = useTasks();
    const [filterMode, setFilterMode] = useState(MODES.ALL);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Derived state
    const filteredTasks = tasks.filter(task => {
        const matchesMode =
            filterMode === MODES.ALL ? true :
                filterMode === MODES.COMPLETED ? task.completed :
                    !task.completed;

        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesMode && matchesSearch;
    });

    const openModal = (task = null) => {
        if (task) {
            setEditingTask(task);
            setTitle(task.title);
            setDescription(task.description || '');
            setCategory(task.category || CATEGORIES[0]);
        } else {
            setEditingTask(null);
            setTitle('');
            setDescription('');
            setCategory(CATEGORIES[0]);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTask(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsSubmitting(true);
        if (editingTask) {
            await updateTask(editingTask.id, { title, description, category });
        } else {
            await addTask({ title, description, category });
        }
        setIsSubmitting(false);
        closeModal();
    };

    if (loading) {
        return <div className="flex h-[50vh] items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>;
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Tasks</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your day-to-day work.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-lg shadow-primary-500/30"
                >
                    <Plus size={20} />
                    <span>New Task</span>
                </button>
            </header>

            {/* Controls: Search & Filter */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
                    />
                </div>

                <div className="flex items-center bg-gray-100 dark:bg-gray-900 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
                    {Object.values(MODES).map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setFilterMode(mode)}
                            className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filterMode === mode
                                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                }`}
                        >
                            {mode}
                        </button>
                    ))}
                </div>
            </div>

            {/* Task List */}
            <div className="space-y-4">
                {filteredTasks.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-700 shadow-sm border-dashed">
                        <div className="mx-auto h-12 w-12 text-gray-400 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-4">
                            <CheckSquare size={24} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No tasks found</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            {searchQuery ? "Try adjusting your search or filters." : "Get started by creating a new task."}
                        </p>
                    </div>
                ) : (
                    filteredTasks.map(task => (
                        <div
                            key={task.id}
                            className={`bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border transition-all hover:shadow-md flex flex-col sm:flex-row gap-4 sm:items-center justify-between ${task.completed ? 'border-gray-100 dark:border-gray-800 opacity-75 bg-gray-50/50 dark:bg-gray-800/50' : 'border-gray-200 dark:border-gray-700'
                                }`}
                        >
                            <div className="flex items-start gap-4 flex-1">
                                <button
                                    onClick={() => toggleTaskStatus(task.id, task.completed)}
                                    className={`mt-0.5 shrink-0 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${task.completed ? 'text-green-500 hover:text-green-600' : 'text-gray-300 dark:text-gray-600 hover:text-primary-500'
                                        }`}
                                >
                                    {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                                </button>
                                <div className="flex-1">
                                    <h3 className={`text-base font-semibold transition-colors ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-white'}`}>
                                        {task.title}
                                    </h3>
                                    {task.description && (
                                        <p className={`text-sm mt-1 line-clamp-2 ${task.completed ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                            {task.description}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-3 mt-3">
                                        <span className="text-xs text-gray-400 font-medium">
                                            {format(new Date(task.created_at), 'MMM d, yyyy')}
                                        </span>
                                        {task.category && (
                                            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 border border-primary-100 dark:border-primary-900/50">
                                                {task.category}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center sm:flex-col gap-2 shrink-0">
                                <button
                                    onClick={() => openModal(task)}
                                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 dark:hover:text-primary-400 rounded-lg transition-colors"
                                    aria-label="Edit task"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to delete this task?')) {
                                            deleteTask(task.id);
                                        }
                                    }}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 dark:hover:text-red-400 rounded-lg transition-colors"
                                    aria-label="Delete task"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create / Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm transition-opacity">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {editingTask ? 'Edit Task' : 'Create New Task'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-1 bg-gray-100 dark:bg-gray-700 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <form id="task-form" onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                                        placeholder="E.g., Complete project report"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={3}
                                        className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                                        placeholder="Add details about this task..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors appearance-none"
                                    >
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </form>
                        </div>

                        <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3 mt-auto">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="task-form"
                                disabled={isSubmitting || !title.trim()}
                                className="px-6 py-2 font-medium text-white bg-primary-600 border border-transparent rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors shadow-lg shadow-primary-500/20"
                            >
                                {isSubmitting ? 'Saving...' : (editingTask ? 'Save Changes' : 'Create Task')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Tasks;
