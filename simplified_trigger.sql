-- Simplified trigger that only manages your custom users table
-- This is the correct approach - let auth.users handle auth, your table handles display names

-- Update the trigger function to only handle your custom table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Ensure display_name is provided, otherwise raise an error
    IF NEW.raw_user_meta_data->>'display_name' IS NULL OR NEW.raw_user_meta_data->>'display_name' = '' THEN
        RAISE EXCEPTION 'Display name is required for user creation';
    END IF;
    
    -- Only insert into your custom users table
    INSERT INTO public.users (id, display_name, email, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'display_name',
        NEW.email,
        NOW(),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Success message
SELECT 'Simplified trigger created! Your custom users table is now the source of truth for display names.' as status; 