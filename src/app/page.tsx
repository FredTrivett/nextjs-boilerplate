import { auth } from '@/auth'
import HomeClient from '@/components/home-client'
import { Nav } from '@/components/nav'

export default async function Home() {
  const session = await auth()
  return (
    <>
      <Nav />
      <HomeClient session={session} />
    </>
  )
}
