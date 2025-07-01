import React, { useEffect, useState } from 'react'
import Cart from '@/component/cart'
import { TiTickOutline } from 'react-icons/ti'
import { AiOutlineAlignLeft } from 'react-icons/ai'
import TodoRow from '@/component/TodoRow'
import DeleteModal from '@/component/DeleteModal'
import VerifyUserToken from '../../lib/VerifyUserToken'
import Sidebar from '@/component/Sidbar'

export async function getServerSideProps (context) {
  const user = VerifyUserToken(context.req)


  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }
  return {
    props: user
  }
}

export default function index (user) {
  
  const [showCart, setShowCart] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectTodo, setSelectTodo] = useState(null)
  const [todoValue, setTodoValue] = useState('')
  const [data, setData] = useState([])
  const [inShowSidebar, setInShowSidebar] = useState(false)
  
  

  const handeleShowDeletedModal = () => {
    setShowDeleteModal(!showDeleteModal)
  }
  const handeleShowCart = () => {
    setShowCart(!showCart)
  }
  const handleSelect = todo => {
    setSelectTodo(todo)
  }

  const todoObj = {
    title: todoValue,
    status: 'Not-Done',
    description: '',
    user:user.id
  }
  const deleteHandler = async itemId => {
    try {
      const res = await fetch(`/api/todos/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (res.ok) {
        setData(prev => prev.filter(todo => todo._id !== itemId))
        alert('Todo deleted successfully')
      }
    } catch (error) {
      console.log('error:', error)
    }
  }

  useEffect(() => {
    const getTodoHandeler = async () => {
      const res = await fetch(`/api/todos/`)

      if (res.ok) {
        const data = await res.json()
        setData(data.todos)
      }
    }

    getTodoHandeler()
  }, [])

  const addTodoHandeler = async () => {
    const res = await fetch('/api/todos/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(todoObj)
    })
    if (res.ok) {
      const newTodo = await res.json()

      setData(prev => [...prev, { ...todoObj, _id: newTodo._id }])

      setTodoValue('')
    }
  }

  const handleUpdateTodo = updatedTodo => {
    setData(prev =>
      prev.map(todo =>
        todo._id === updatedTodo._id
          ? {
              ...todo,
              title: updatedTodo.title,
              description: updatedTodo.description
            }
          : todo
      )
    )
  }

  const closeSidebar=()=>{
    setInShowSidebar(false)
    
  }
  return (
    <div className='relative min-h-screen bg-gradient-to-bl from-emerald-400 to-blue-500 text-center  text-white '>
      <div className='py-8 text-center'>
        <h1 className='text-2xl sm:text-4xl md:text-5xl font-serif font-bold uppercase tracking-wider text-stone-800 border-y-2 border-stone-400 inline-block px-6 py-2'>
          JUST DO IT
        </h1>
      </div>
      <div className="flex justify-end">
  <button
    onClick={() => setInShowSidebar(!inShowSidebar)}
    className="p-2 m-4 cur rounded-md bg-white text-gray-700 shadow-md hover:shadow-lg hover:text-white hover:bg-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95"
  >
    <AiOutlineAlignLeft className="w-6 h-6 transition-transform duration-300 hover:rotate-180" />
  </button>
</div>
  

      <Sidebar isOpen={inShowSidebar} onClose={closeSidebar} data={user} />
      
      <div className='bg-white/30 backdrop-blur-md border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-md mx-auto w-10/12 md:w-8/12 max-h-[520px] h-7/12 overflow-y-auto p-1 sm:p-2 md:p-4 space-y-4 transition-all duration-300'>
        {/* inputbar */}

        <div className='flex items-center justify-center my-4 w-full sm:gap-3 gap-1'>
          <input
            type='text'
            value={todoValue}
            onChange={e => setTodoValue(e.target.value)}
            placeholder="What's on your mind?"
            className='flex-1 max-w-md px-2 sm:px-4 py-2 text-[12px] sm:text-sm md:text-[16px] text-gray-900 bg-white border border-gray-300 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200'
          />
          <button
            onClick={addTodoHandeler}
            className='p-2 cursor-pointer bg-primary text-white rounded-full shadow-md hover:bg-primary/80 focus:outline-none transition-all duration-200'
          >
            <TiTickOutline className='w-5 h-5' />
          </button>
        </div>

        <>
          {data.map((todo, index) => (
            <TodoRow
              key={todo._id}
              title={todo.title}
              num={index}
              condition={todo.status}
              id={todo._id}
              onSelect={() => handleSelect(todo)}
              onShowDeleteModal={handeleShowDeletedModal}
              onShowCart={handeleShowCart}
            />
          ))}
        </>
      </div>
      {showCart && (
        <Cart
          onUpdate={handleUpdateTodo}
          onShowCart={handeleShowCart}
          data={selectTodo}
        />
      )}
      {showDeleteModal && (
        <DeleteModal
          data={selectTodo}
          onShowDeleteModal={handeleShowDeletedModal}
          onDeleted={() => deleteHandler(selectTodo._id)}
        />
      )}
    </div>
  )
}
