import { cookies } from "next/headers"

export default async function Profile() {
    // Initialize the store with the product information
  const cookieStore = cookies()
  const token = cookieStore.get('accesstoken')

  if (!token) return null;
  
  const profile = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/user/infor`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token.value
          },
          credentials: 'include',
      })
      .then((res) => {
          return res.json()
      })
      .catch (error => {
          throw error.msg
      })

  console.log(profile)

  return (
    <div>
      Profile
    </div>
  )
}

