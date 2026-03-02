import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Mock client logic so app doesn't crash if keys are missing
export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        auth: {
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            getSession: async () => ({ data: { session: null } }),
            signInWithPassword: async () => ({ error: { message: "Supabase not configured" } }),
            signUp: async () => ({ error: { message: "Supabase not configured" } }),
            signOut: async () => ({ error: null }),
        },
        from: () => ({
            select: () => ({
                order: () => Promise.resolve({ data: [], error: null }),
                eq: () => ({
                    order: () => Promise.resolve({ data: [], error: null })
                })
            }),
            insert: () => ({
                select: () => ({
                    single: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } })
                })
            }),
            update: () => ({
                eq: () => ({
                    select: () => ({
                        single: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } })
                    })
                })
            }),
            delete: () => ({
                eq: () => Promise.resolve({ error: { message: "Supabase not configured" } })
            })
        }),
        channel: () => ({
            on: () => ({ subscribe: () => { } }),
            unsubscribe: () => { }
        })
    };

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);
