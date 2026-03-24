import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import AdminDashboard from '@/components/admin/AdminDashboard';

export const metadata = { title: 'Admin | Villa Jurina' };

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect('/admin/login');

  return <AdminDashboard />;
}
