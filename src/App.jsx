import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/auth" element={<Auth />} />

                    <Route path="/" element={
                        <ProtectedRoute>
                            <TaskProvider>
                                <Layout />
                            </TaskProvider>
                        </ProtectedRoute>
                    }>
                        <Route index element={<Dashboard />} />
                        <Route path="tasks" element={<Tasks />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
