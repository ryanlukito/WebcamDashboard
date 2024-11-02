// 1. Import Supabase client library (npm install @supabase/supabase-js) if you're using Node.js or include in HTML script tag.
import { createClient } from '@supabase/supabase-js';

// 2. Initialize Supabase client with URL and API key
const SUPABASE_URL = env(DATABASE_URL);
const SUPABASE_KEY = env(DATABASE_API_KEY);
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 3. Login Function
async function login(email, password) {
  try {
    // Fetch the user account based on the email provided
    let { data, error } = await supabase
      .from('Account')
      .select('id, name, password')
      .eq('email', email)
      .single(); // Fetches only a single row
    
    if (error) {
      throw new Error('User not found or wrong email');
    }

    // 4. Check if password matches (ensure your passwords are hashed when storing)
    // In production, never store plain text passwords; use bcrypt or another secure hashing library
    if (data.password === password) {
      console.log('Login successful!');
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
