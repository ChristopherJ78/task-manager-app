import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Lock, Mail, UserPlus, LogIn, AlertCircle } from 'lucide-react';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { signIn, signUp, user, isSupabaseConfigured } = useAuth();

    if (user) {
        return <Navigate to="/" />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isSupabaseConfigured) {
            setError("Please configure Supabase credentials in .env first.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await signIn({ email, password });
                if (error) throw error;
            } else {
                const { error } = await signUp({ email, password });
                if (error) throw error;
                // Supabase sets user automatically on signup if autoConfirm is true
                // Otherwise, they might need to verify email.
                alert('Check your email for the confirmation link if required, or you are now logged in!');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                        {isLogin ? 'Welcome back to TaskMaster' : 'Create your account'}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        {isLogin ? 'Sign in to access your tasks' : 'Join us and get organized today'}
                    </p>
                </div>

                {!isSupabaseConfigured && (
                    <div className="bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-lg p-4 flex items-start gap-3 text-orange-800 dark:text-orange-200">
                        <AlertCircle className="shrink-0 mt-0.5" size={20} />
                        <div className="text-sm">
                            <p className="font-semibold">Setup Required</p>
                            <p>You need to connect to Supabase. Please copy <code className="bg-white/50 dark:bg-black/20 px-1 rounded">.env.example</code> to <code className="bg-white/50 dark:bg-black/20 px-1 rounded">.env</code> and add your URL and Anon Key.</p>
                        </div>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl py-3 border transition-colors focus:outline-none focus:ring-2"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl py-3 border transition-colors focus:outline-none focus:ring-2"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/50">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 transition-colors shadow-lg shadow-primary-500/30"
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                {isLogin ? <LogIn className="h-5 w-5 text-primary-500 group-hover:text-primary-400" /> : <UserPlus className="h-5 w-5 text-primary-500 group-hover:text-primary-400" />}
                            </span>
                            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                        </button>
                    </div>
                </form>

                <div className="text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                    >
                        {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;
