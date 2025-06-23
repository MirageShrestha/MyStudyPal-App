import { useUser } from '@clerk/clerk-expo';
import { useEffect, useState } from 'react';
import { createAnonymousSession, getCurrentUser } from '../appwrite';

export const useAppwriteAuth = () => {
  const { user } = useUser();
  const [isAppwriteAuthenticated, setIsAppwriteAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const syncAppwriteAuth = async () => {
      try {
        if (!user) {
          console.log('No Clerk user, clearing Appwrite auth state');
          setIsAppwriteAuthenticated(false);
          return;
        }

        console.log('Checking Appwrite session...');
        
        // Check if we already have a valid session
        try {
          const currentUser = await getCurrentUser();
          if (currentUser) {
            console.log('Found existing Appwrite session');
            setIsAppwriteAuthenticated(true);
            return;
          }
        } catch (e) {
          console.log('No existing Appwrite session found');
        }

        // Create a new anonymous session
        console.log('Creating new Appwrite session...');
        await createAnonymousSession();
        console.log('Successfully created Appwrite session');
        setIsAppwriteAuthenticated(true);

      } catch (error) {
        console.error('Failed to sync Appwrite auth:', error);
        setError(error);
        setIsAppwriteAuthenticated(false);
      }
    };

    syncAppwriteAuth();
  }, [user]);

  return { isAppwriteAuthenticated, error };
}; 