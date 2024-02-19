import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { PreferenceCard } from '@/components/preference-card'

// Define the interface for a preference object based on the Preferences model
interface Preference {
  id: number;
  title: string;
  preferredModel: string;
  temperature: number;
  active: boolean;
  userId: string;
}

export default async function ProfilePage() {
  const session = await auth()
  // redirect to sign-in if user is not logged in
  if (!session?.user) {
    redirect('/sign-in')
  }

  const response = await fetch(`/api/preferences?userId=${session.user.id}`)
  const preferences = await response.json()
  console.log(preferences)

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center py-10">
      {preferences.map((preference: Preference) => (
        <PreferenceCard key={preference.id} preference={preference} />
      ))}
    </div>
  )
}
