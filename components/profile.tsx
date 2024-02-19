import React, { useEffect, useState } from 'react';

interface Preference {
  id: number;
  title: string;
  preferredModel: string;
  temperature: number;
  active: boolean;
}

interface ProfileProps {
  userId: string;
}

const Profile: React.FC<ProfileProps> = ({ userId }) => {
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/preferences?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch preferences');
        }
        const data: Preference[] = await response.json();
        setPreferences(data);
      } catch (error) {
        console.error('Error fetching preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [userId]);

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
              {/* Include buttons or links for editing and deleting */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
