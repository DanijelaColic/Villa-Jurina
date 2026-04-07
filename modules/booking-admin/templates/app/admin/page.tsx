/**
 * TEMPLATE: kopiraj kao src/app/admin/page.tsx
 * Zamijeni MODULE_ROOT s putanjom do modula, npr. '@/modules/booking-admin'
 */
import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from 'MODULE_ROOT/lib/admin-auth';
import AdminDashboard from 'MODULE_ROOT/components/admin/AdminDashboard';
import { SITE_NAME } from 'MODULE_ROOT/booking.config';

export const metadata = { title: `Admin | ${SITE_NAME}` };

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect('/admin/login');

  return <AdminDashboard />;
}
