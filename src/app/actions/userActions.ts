"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getDisplayNames(authorIds: string[]) {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, display_name')
      .in('id', authorIds);

    if (error) {
      console.error("Error fetching display names:", error);
      return new Map();
    }

    const displayNames = new Map<string, string>();
    
    // Use actual display names from your custom users table
    users?.forEach(user => {
      displayNames.set(user.id, user.display_name);
    });

    // Fallback for any missing users
    authorIds.forEach(authorId => {
      if (!displayNames.has(authorId)) {
        displayNames.set(authorId, `User ${authorId.slice(0, 8)}`);
      }
    });
    
    return displayNames;
  } catch (error) {
    console.error("Error fetching display names:", error);
    return new Map();
  }
}

export async function updateDisplayName(userId: string, displayName: string) {
  try {
    // Only update your custom users table - this is the source of truth
    const { error } = await supabase
      .from('users')
      .upsert({ 
        id: userId, 
        display_name: displayName,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error("Error updating display name:", error);
      return { success: false, error };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error updating display name:", error);
    return { success: false, error };
  }
}

export async function createUserProfile(userId: string, displayName: string) {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error("Error getting current user:", userError);
      return { success: false, error: userError };
    }

    const { error } = await supabase
      .from('users')
      .insert({ 
        id: userId, 
        display_name: displayName,
        email: user.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error("Error creating user profile:", error);
      return { success: false, error };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error creating user profile:", error);
    return { success: false, error };
  }
}

export async function populateExistingUsers() {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error("Error getting current user:", userError);
      return { success: false, error: userError };
    }

    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error("Error checking existing user:", checkError);
      return { success: false, error: checkError };
    }

    if (!existingUser) {
      const displayName = user.user_metadata?.display_name || `User ${user.id.slice(0, 8)}`;
      
      const { error: insertError } = await supabase
        .from('users')
        .insert({ 
          id: user.id, 
          display_name: displayName,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (insertError) {
        console.error("Error inserting user:", insertError);
        return { success: false, error: insertError };
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error populating existing users:", error);
    return { success: false, error };
  }
} 