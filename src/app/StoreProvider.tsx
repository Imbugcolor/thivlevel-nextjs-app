'use client'
import { useEffect, useRef, useState } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from '../lib/store'
import { login } from '@/lib/features/authSlice'

export default function StoreProvider({
  refreshToken,
  children
}: {
  refreshToken: string | undefined,
  children: React.ReactNode
}) {
  const [accessToken, setAccessToken] = useState(null)
  const [isLoading, setLoading] = useState(true)
 
  const storeRef = useRef<AppStore>()

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
  }

  useEffect(() => {
    if(refreshToken) {
      setLoading(true)
      fetch('api/auth', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(async(res) => {
        const token = await res.json()
        setAccessToken(token)
      })
    }
  }, [refreshToken])

  useEffect(() => {
    if(accessToken) {
      fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/user/infor`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': accessToken
        },
      })
      .then((res) => res.json())
      .then((data) => {
        if (storeRef.current) {
          // Create the store instance the first time this renders
          storeRef.current.dispatch(login({ token: accessToken, user: data }))
        }
        setLoading(false)
      })
    }
    
  },[accessToken])

  return <Provider store={storeRef.current}>{children}</Provider>
}