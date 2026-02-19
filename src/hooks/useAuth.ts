import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/config';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface AuthUser {
  uid: string;
  email: string | null;
  role: 'admin' | 'visitor' | null;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        try {
          // Fetch the user's role from Firestore
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: userData.role || 'visitor', // Default to visitor if no role
            });
          } else {
            // User exists in Auth but not in Firestore
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: 'visitor',
            });
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUser(null);
        }
      } else {
        // No user is signed in
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}