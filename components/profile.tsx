import React, { useEffect, useState } from 'react';
import { auth } from '@/auth';

interface Preference {
  id: number;
  title: string;
  preferredModel: string;
  temperature: number;
  active: boolean;
}

const Profile = () => {
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setLoading(true);
        const session = await auth();
        if (session && session.user && session.user.id) {
          const response = await fetch(`/api/preferences?userId=${session.user.id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch preferences');
          }
          const data: Preference[] = await response.json();
          setPreferences(data);
        } else {
          throw new Error('User not authenticated');
        }
      } catch (error) {
        console.error('Error fetching preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  if (isLoading) {
    return <div>Loading preferences...</div>;
  }

  return (
    <div>
      <h1>User Preferences</h1>
      <div className="preferences-gallery">
        {preferences.length === 0 ? (
          <p>No preferences found.</p>
        ) : (
          preferences.map(preference => (
            <div key={preference.id} className="preference-card">
              <h3>{preference.title}</h3>
              <p>Model: {preference.preferredModel}</p>
              <p>Temperature: {preference.temperature}</p>
              <p>Status: {preference.active ? 'Active' : 'Inactive'}</p>
              {/* TODO: BUTTONS FOR PUT / DELETE */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
