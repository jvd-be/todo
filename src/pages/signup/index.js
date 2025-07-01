import React from 'react'
import { useForm } from 'react-hook-form'
import Validations from '../../../Validations/RulesForm'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function index () {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  const onSubmit = async data => {
    try {
      const res = await fetch('/api/todos/signup/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      alert("res not ok")
      if (res.ok) {
        reset()
        router.push('/')
      }
    } catch (error) {
      console.log('error:', error)
    }
  }

  return (
    <div className='flex flex-col justify-center items-center min-h-screen bg-gray-100 '>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='w-full max-w-md bg-white p-4 rounded-xl shadow-lg space-y-2'
      >
        <div className='flex flex-col'>
          <label className='text-md text-gray-600 mb-1'>firstName</label>
          <input
            {...register('firstName', Validations.firstName)}
            type='text'
            placeholder='firstName'
            className='p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 text-md'
          />
          {errors.firstName && (
            <p className='text-xs text-red-500 h-2 mt-1'>
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div className='flex flex-col'>
          <label className='text-md text-gray-600 mb-1'>lastName</label>
          <input
            {...register('lastName', Validations.lastName)}
            type='text'
            placeholder='lastName'
            className='p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 text-md'
          />
          {errors.lastName && (
            <p className='text-xs text-red-500 h-2 mt-1'>
              {errors.lastName.message}
            </p>
          )}
        </div>
        <div className='flex flex-col'>
          <label className='text-md text-gray-600 mb-1'>userName</label>
          <input
            {...register('userName', Validations.userName)}
            type='text'
            placeholder='userName'
            className='p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 text-md'
          />
          {errors.userName && (
            <p className='text-xs text-red-500 h-2 mt-1'>
              {errors.userName.message}
            </p>
          )}
        </div>
        <div className='flex flex-col'>
          <label className='text-md text-gray-600 mb-1'>email</label>
          <input
            {...register('email', Validations.email)}
            type='text'
            placeholder='email'
            className='p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 text-md'
          />
          {errors.email && (
            <p className='text-xs text-red-500 h-2 mt-1'>
              {errors.email.message}
            </p>
          )}
        </div>
        <div className='flex flex-col'>
          <label className='text-md text-gray-600 mb-1'>password</label>
          <input
            {...register('password', Validations.password)}
            type='text'
            placeholder='password'
            className='p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 text-md'
          />
          {errors.password && (
            <p className='text-xs text-red-500 h-2 mt-1'>
              {errors.password.message}
            </p>
          )}
        </div>
        <div className='flex justify-center'>
          <button className='w-56 mt-3 cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out'>
            Sign Up
          </button>
        </div>
        <div className="flex items-center justify-center space-x-2  ">
        <span className='text-gray-600  text-md'>are you alredy account?</span>
        <Link
          className='text-blue-600 hover:text-blue-800 underline'
          href='/login'
        >
          Login
        </Link>

        </div>
      </form>
    </div>
  )
}
