import { ReactNode } from 'react'
import Header from '@/components/ui/header'

const Layout = ({children} : Readonly<{children: ReactNode}>) => {
  return (
    <>
            <Header />
            {children}
    </>

  )
}

export default Layout