import Link from 'next/link'
import NavMenu from '@/components/ui/nav-menu'
import { auth, signIn, signOut } from "@/auth"
import { Button } from './button'

const Header = async() => {

  const session = await auth()

  return (
    <header className='flex flex-row px-5 py-3 items-center' >
      <NavMenu />
        <Link href={'/'}
        className='font-extrabold text-3xl
                    hover:text-purple-300
                    transition-[0.15s]'>
          ✨Chess
        </Link>
        
        <div className='ml-auto self-end'>
          {session && session?.user ? (
            //User logged in
            <div className='flex flex-row items-center gap-5'>
              <form action={async() => {
                'use server';
                await signOut();
              }}>
                <Button type='submit'>Выйти</Button>
              </form>

              <Link href={`/user/${session?.id}`}>
                <span className='text-[1.2rem] font-bold'>
                  {session?.user?.name}
                </span>
              </Link>
            </div>
          ) : (
            <>
              <form action={async() => {
                "use server";
                await signIn('github');
              }}>
                <Button type='submit'>Войти</Button>
              </form>
            </>
          )}
        </div>
      </header>
  )
}

export default Header