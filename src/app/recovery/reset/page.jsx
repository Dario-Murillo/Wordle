// app/recovery/reset/page.tsx

'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ResetForm from '../../../components/ResetForm';

export default async function ResetPasswordPage() {
  const cookieStore = await cookies();
  const allowReset = cookieStore.get('allow_password_reset');

  if (!allowReset) {
    redirect('/');
  }

  return <ResetForm />;
}
