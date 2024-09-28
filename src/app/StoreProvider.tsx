'use client'
import { useEffect, useRef, useState } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from '../lib/store'
import { login } from '@/lib/features/authSlice'
import { userApiRequest } from './api-request/user.api'
import { getProducts } from '@/lib/features/productSlice'
import { getCategories } from '@/lib/features/categorySlice'
import { NEXT_SERVER_URL, NUM_PER_PAGE } from '@/config'
import { getCart } from '@/lib/features/cartSlice'
import { jwtDecode } from 'jwt-decode'
import { JwtPayload } from '@/lib/jwt.payload'
import { setNotify } from '@/lib/features/notifySlice'

export default function StoreProvider({
  refreshToken,
  children
}: {
  refreshToken: string | undefined,
  children: React.ReactNode
}) {
  let publish = true;

  if (refreshToken) {
    const decode: JwtPayload = jwtDecode(refreshToken);
    // TRƯỜNG HỢP LÀ ADMIN 
    if (decode.role.some(rl => rl === 'admin')) {
      publish = false;
    }
  }

  const [accessToken, setAccessToken] = useState(null)
 
  const storeRef = useRef<AppStore>()

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
  }

  useEffect(() => {
      if(refreshToken) {
          fetch(`${NEXT_SERVER_URL}/api/auth`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .then(async(res) => {
            if (!res.ok) {
              await userApiRequest.logOut()
              return window.location.href = '/auth'
            }
            const token = await res.json()
            setAccessToken(token)
          })
          .catch(async(error) => {
            console.log(error)
            await userApiRequest.logOut()
            window.location.href = '/auth'
          })
        }
  }, [refreshToken])

  useEffect(() => {
    if(accessToken) {
      fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/user/current`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      })
      .then(async(res) => {
        if (!res.ok) {
          await userApiRequest.logOut()
          return window.location.href = '/auth'
        }
        const data = await res.json()
        if (storeRef.current) {
          // Create the store instance the first time this renders
          storeRef.current.dispatch(login({ token: accessToken, user: data }))
        }
      })
      .catch(async(error) => {
        console.log(error)
        await userApiRequest.logOut()
        window.location.href = '/auth'
      })
    }
    
  },[accessToken])

  useEffect(() => {
    if(accessToken) {
      fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/cart`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      })
      .then(async(res) => {
        const data = await res.json()
        if (!res.ok) {
          await userApiRequest.logOut()
          throw Error(data)
        }
        if (storeRef.current) {
          // Create the store instance the first time this renders
          storeRef.current.dispatch(getCart(data))
        }
      })
      .catch(async(error) => {
        console.log(error)
        if (storeRef.current) {
          // Create the store instance the first time this renders
          storeRef.current.dispatch(setNotify({ error: 'Lỗi khi tải giỏ hàng'}))
        }
      })
    }
  },[accessToken])

  useEffect(() => {
      fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/products?limit=${NUM_PER_PAGE}&page=1${ publish ? '&isPublished=true' : ''}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(async(res) => {
        if (!res.ok) {
          throw Error("Fetch products failed.")
        }
        const productsData = await res.json()
        if (storeRef.current) {
          // Create the store instance the first time this renders
          storeRef.current.dispatch(getProducts({ data: productsData.data, total: productsData.total, page: Number(productsData.page) }))
        }
      })
      .catch(async(error) => {
        console.log(error)
        if (storeRef.current) {
          // Create the store instance the first time this renders
          storeRef.current.dispatch(setNotify({ error: 'Lỗi khi tải sản phẩm.'}))
        }
      })
  },[publish])

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/category`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(async(res) => {
      if (!res.ok) {
        throw Error("Fetch categories failed.")
      }
     
      const categoriesData: Category[] = await res.json()
     
      if (storeRef.current) {
        // Create the store instance the first time this renders
        storeRef.current.dispatch(getCategories(categoriesData))
      }
    })
    .catch(async(error) => {
      console.log(error)
      if (storeRef.current) {
        // Create the store instance the first time this renders
        storeRef.current.dispatch(setNotify({ error: 'Lỗi khi tải danh mục sản phẩm.'}))
      }
    })
  },[])

  return <Provider store={storeRef.current}>{children}</Provider>
}