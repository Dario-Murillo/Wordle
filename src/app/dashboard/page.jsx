import { redirect } from 'next/navigation';
import createClient from '@/utils/supabase/server';
import { CircleUserRound } from 'lucide-react';
import LogoutButton from '../../components/LogOutButton';
import ChangePasswordButton from '../../components/ChangePasswordButton';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }
  return (
    <div className="grid grid-cols-5 grid-rows-5 gap-16 min-h-screen p-8 pb-20 sm:p-20-grid-cols-1 font-[family-name:var(--font-karla)] bg-[#121213]">
      <div className="col-span-4 row-span-4 col-start-2 row-start-2">
        <h1 className="text-7xl font-bold mb-5 font-[family-name:var(--font-alfaslabone)] ">
          Dashboard
        </h1>
        <div className="flex flex-row gap-2 items-center text-4xl">
          <CircleUserRound className="w-15 h-15 text-white" />
          <p> {user.email} </p>
        </div>
        <div className="flex flex-row gap-2 items-center text-4xl mt-5">
          <LogoutButton />
          <ChangePasswordButton />
        </div>
      </div>
    </div>
  );
}
