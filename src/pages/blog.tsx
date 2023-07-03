import Link from 'next/link'
import React from 'react'

const Blog = () => {
  return (
    <div>
      <Link href={'/'}>Home Page</Link><br />
      Restricted Page
    </div>
  )
}

export default Blog
