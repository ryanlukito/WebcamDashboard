// app/api/auth/auth.js :

// app/api/auth/auth.js

import { createClient } from '@supabase/supabase-js';

// Supabase Client Initialization
const SUPABASE_URL = "postgresql://postgres.ugwdbqsmhqdakqnjeszn:PeeplyticsAI@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnd2RicXNtaHFkYWtxbmplc3puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1NDIwMTQsImV4cCI6MjA0NjExODAxNH0.86YSn_o8GKskNgAUq6abMpVaJsOubOKL0z0OKP7o-GE"
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Login Function
async function login(email, password) {
    try {
        let { data, error } = await supabase
            .from('Account')
            .select('id, name, password')
            .eq('email', email)
            .single();

        if (error) throw new Error('User not found or wrong email');
        
        if (data.password === password) {
            return {
                success: true,
                userId: data.id,
                userName: data.name
            };
        } else {
            throw new Error('Incorrect password');
        }
    } catch (error) {
        console.error('Error logging in:', error.message);
        return {
            success: false,
            message: error.message
        };
    }
}

export default login;