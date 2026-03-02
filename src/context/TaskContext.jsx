import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from './AuthContext';

const TaskContext = createContext({});

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchTasks = async () => {
        if (!user || !isSupabaseConfigured) {
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTasks(data || []);
        } catch (error) {
            console.error('Error fetching tasks:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();

        if (user && isSupabaseConfigured) {
            const tasksSubscription = supabase
                .channel('custom-all-channel')
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'tasks', filter: `user_id=eq.${user.id}` },
                    (payload) => {
                        console.log('Realtime change received!', payload);
                        fetchTasks(); // Simplest way to ensure consistent state is re-fetching.
                        // A more optimized approach would be to update the state based on payload.eventType
                        // ('INSERT', 'UPDATE', 'DELETE') without a full re-fetch.
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(tasksSubscription);
            };
        }
    }, [user]);

    const addTask = async (taskData) => {
        if (!isSupabaseConfigured) return { data: null, error: "Not configured" };
        try {
            const { data, error } = await supabase
                .from('tasks')
                .insert([{ ...taskData, user_id: user.id }])
                .select()
                .single();

            if (error) throw error;
            // Optimistic update
            setTasks([data, ...tasks]);
            return { data, error: null };
        } catch (error) {
            console.error('Error adding task:', error.message);
            return { data: null, error };
        }
    };

    const updateTask = async (id, updates) => {
        if (!isSupabaseConfigured) return { error: "Not configured" };
        try {
            const { error } = await supabase
                .from('tasks')
                .update(updates)
                .eq('id', id);

            if (error) throw error;
            // Optimistic update
            setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
            return { error: null };
        } catch (error) {
            console.error('Error updating task:', error.message);
            return { error };
        }
    };

    const deleteTask = async (id) => {
        if (!isSupabaseConfigured) return { error: "Not configured" };
        try {
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', id);

            if (error) throw error;
            // Optimistic update
            setTasks(tasks.filter(t => t.id !== id));
            return { error: null };
        } catch (error) {
            console.error('Error deleting task:', error.message);
            return { error };
        }
    };

    const toggleTaskStatus = async (id, currentStatus) => {
        return updateTask(id, { completed: !currentStatus });
    };

    const value = {
        tasks,
        loading,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        refreshTasks: fetchTasks // Expose if needed
    };

    return (
        <TaskContext.Provider value={value}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTasks = () => useContext(TaskContext);
