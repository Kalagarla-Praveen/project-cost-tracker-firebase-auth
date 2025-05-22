import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/authContext'
import { doSignOut } from '../../firebase/auth'

const Header = () => {
    const navigate = useNavigate()
    const { userLoggedIn } = useAuth()

    return (
        <nav className='flex justify-between items-center px-6 h-14 w-full fixed top-0 left-0 z-20 bg-white border-b shadow-sm'>
            <div className='text-lg font-semibold text-gray-800'>
                Project Cost Tracker
            </div>
            <div className='flex gap-4 items-center'>
                {
                    userLoggedIn ? (
                        <button
                            onClick={() => {
                                doSignOut().then(() => {
                                    navigate('/login')
                                })
                            }}
                            
                            className=' bg-blue-600  text-white  px-4 py-1 rounded hover:text-blue-800 transition w-full'
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                        <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 w-full">
                            <Link
                                to='/login'
                                className='text-sm text-white-600 hover:text-blue-800 transition '
                            >
                                Login
                            </Link>
                            </button>
                            <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 w-full">
                            <Link
                                to='/register'
                                className='text-sm text-white-600 hover:text-blue-800 transition '
                            >
                                Register
                            </Link>
                            </button>
                        </>
                    )
                }
            </div>
        </nav>
    )
}

export default Header
