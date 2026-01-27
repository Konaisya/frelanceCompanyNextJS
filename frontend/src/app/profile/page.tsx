import ProfilePage from '@/components/ui/profile/ProfilePage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Профиль пользователя',
  description: 'Личный кабинет пользователя',
};

export default function ProfileRoute() {
  return <ProfilePage />;
}