import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, CheckSquare, LogOut, Moon, Sun, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const Layout = () => {
    const { signOut, user } = useAuth();
    const location = useLocation();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const handleSignOut = async () => {
        await signOut();
    };

    const navLinks = [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
        { name: 'Tasks', path: '/tasks', icon: <CheckSquare size={20} /> },
    ];

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex flex-col md:flex-row">

            {/* Mobile Top Bar */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
                <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">TaskMaster</h1>
                <div className="flex items-center gap-4">
                    <button onClick={toggleTheme} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg dark:text-gray-400 transition-colors">
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg dark:text-gray-400 transition-colors"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Sidebar Navigation */}
            <aside className={`
        ${isMobileMenuOpen ? 'fixed inset-0 z-50 flex flex-col bg-white dark:bg-gray-800' : 'hidden'}
        md:flex md:flex-col md:w-64 md:border-r md:dark:border-gray-700 md:bg-white md:dark:bg-gray-800
        transition-all duration-300 shadow-sm md:shadow-none
      `}>
                {isMobileMenuOpen && (
                    <div className="flex justify-end p-4 md:hidden">
                        <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg dark:text-gray-400">
                            <X size={24} />
                        </button>
                    </div>
                )}

                <div className="px-6 pb-6 pt-6 hidden md:block">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400">
                        TaskMaster
                    </h2>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4 md:mt-0">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-100'
                                    }`}
                            >
                                {link.icon}
                                <span className="font-medium">{link.name}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t dark:border-gray-700">
                    <div className="hidden md:flex items-center justify-between mb-4 px-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Theme</span>
                        <button onClick={toggleTheme} className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    </div>

                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 font-medium"
                    >
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>

                    <div className="mt-4 px-2 text-xs text-gray-400 dark:text-gray-500 text-center truncate">
                        {user?.email || 'Not logged in'}
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto w-full">
                <div className="container mx-auto max-w-5xl px-4 py-8 md:px-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
