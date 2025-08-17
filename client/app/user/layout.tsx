import React from 'react'

const UserLayout = ({ children } : { children: React.ReactNode }) => {
  return (
    <div>
        <p>
            header
        </p>
        <p>
            sidebar
        </p>
        {children}
    </div>
  )
}

export default UserLayout