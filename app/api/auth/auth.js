// app/api/auth/auth.js :

// app/api/auth/auth.js

import { createClient } from '@supabase/supabase-js';

// Supabase Client Initialization
const SUPABASE_URL = process.env.NEXT_PUBLIC_DATABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_DATABASE_API_KEY
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("Supabase URL: ", SUPABASE_URL);
console.log("Supabase Key: ", SUPABASE_KEY);

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