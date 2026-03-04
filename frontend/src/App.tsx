import QueryProvider from "@/api/QueryProvider"
import AppRouter from "@/routes"
import { useEffect } from "react"
import { useAuthStore } from "@/store/authStore"
import api from "@/api/axios"

function App() {
  const { token, login, logout, finishInitialLoad, isLoading } = useAuthStore()

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await api.get("/auth/me")
          const responseData = res.data
          if (responseData.status === "success" || responseData.code === 200) {
            const userData = responseData.data
            login(
              {
                id: userData.id,
                name: userData.fullName,
                email: userData.email,
                avatar: userData.avatarUrl,
              },
              token
            )
          } else {
            logout()
          }
        } catch (error) {
          console.error("Session verification failed:", error)
          logout()
        }
      } else {
        finishInitialLoad()
      }
    }

    initAuth()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <QueryProvider>
      <AppRouter />
    </QueryProvider>
  )
}


export default App
