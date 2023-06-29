import Link from 'next/link'
import SignInButton from '@/components/SignInButton'

export default function Home() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item active px-3">
              <Link href={'/'}>Home Page</Link>
            </li>
            <li className="nav-item px-3">
              <Link href={'/blog'}>Blogs Page</Link>
            </li>
            <li className="nav-item">
              <SignInButton />
            </li>
          </ul>
        </div>
      </nav>
    </>
  )
}
