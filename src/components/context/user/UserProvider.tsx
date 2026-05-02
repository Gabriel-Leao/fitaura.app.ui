import { createContext, useCallback, useEffect, useState } from 'react'

import * as Crypto from 'expo-crypto'

import AsyncStorage from '@react-native-async-storage/async-storage'

import type { User } from '@/@types/user'
import { CUSTOM_FOODS_STORAGE_KEY, DIET_STORAGE_KEY } from '@/constants/diet'
import { CURRENT_USER_KEY, USERS_STORAGE_KEY } from '@/constants/usersKey'
import { CUSTOM_EXERCISES_KEY, CUSTOM_TEMPLATES_KEY, WORKOUT_LOGS_KEY } from '@/constants/workout'

type UserContextType = {
  users: User[]
  currentUser: User | null
  isLoading: boolean
  register: (userData: Omit<User, 'id'>) => Promise<User>
  login: (email: string, password: string) => Promise<User>
  logout: () => Promise<void>
  deleteUser: (id: string) => Promise<void>
  updateAvatar: (id: string, uri: string) => Promise<void>
  updateUser: (id: string, data: Partial<Omit<User, 'id' | 'password'>>) => Promise<void>
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: React.PropsWithChildren) => {
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const storeUsers = useCallback(async (data: User[]) => {
    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(data))
  }, [])

  const storeCurrentUser = useCallback(async (user: User | null) => {
    if (user) {
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
    } else {
      await AsyncStorage.removeItem(CURRENT_USER_KEY)
    }
  }, [])

  const loadUsers = useCallback(async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(USERS_STORAGE_KEY)
      setUsers(jsonValue ? JSON.parse(jsonValue) : [])
    } catch (e) {
      console.error('Erro ao carregar usuários:', e)
    }
  }, [])

  const loadCurrentUser = useCallback(async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(CURRENT_USER_KEY)
      setCurrentUser(jsonValue ? JSON.parse(jsonValue) : null)
    } catch (e) {
      console.error('Erro ao carregar usuário atual:', e)
    }
  }, [])

  useEffect(() => {
    const initialize = async () => {
      await loadUsers()
      await loadCurrentUser()
      setIsLoading(false)
    }
    initialize()
  }, [loadUsers, loadCurrentUser])

  useEffect(() => {
    if (!isLoading) storeUsers(users)
  }, [users, storeUsers, isLoading])

  useEffect(() => {
    if (!isLoading) storeCurrentUser(currentUser)
  }, [currentUser, storeCurrentUser, isLoading])

  const hashPassword = async (password: string): Promise<string> => {
    return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password)
  }

  const register = async (userData: Omit<User, 'id'>) => {
    const alreadyExists = users.some((u) => u.email.toLowerCase() === userData.email.toLowerCase())

    if (alreadyExists) {
      throw new Error('E-mail já está em uso')
    }

    const hashedPassword = await hashPassword(userData.password)

    const newUser: User = {
      id: String(Crypto.randomUUID()),
      ...userData,
      password: hashedPassword,
    }

    setUsers((prev) => [...prev, newUser])
    setCurrentUser(newUser)

    return newUser
  }

  const login = async (email: string, password: string) => {
    const hashedPassword = await hashPassword(password)

    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === hashedPassword,
    )

    if (!user) {
      throw new Error('Email ou senha incorretos')
    }

    setCurrentUser(user)
    return user
  }

  const logout = async () => {
    setCurrentUser(null)
  }

  const updateUser = async (id: string, data: Partial<Omit<User, 'id' | 'password'>>) => {
    const updatedUsers = users.map((u) => (u.id === id ? { ...u, ...data } : u))
    setUsers(updatedUsers)

    if (currentUser?.id === id) {
      setCurrentUser((prev) => (prev ? { ...prev, ...data } : prev))
    }
  }

  const deleteUser = async (id: string) => {
    const userExists = users.some((u) => u.id === id)

    if (!userExists) {
      throw new Error('Usuário não encontrado')
    }

    const updatedUsers = users.filter((u) => u.id !== id)
    setUsers(updatedUsers)
    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers))

    if (currentUser?.id === id) {
      setCurrentUser(null)
      await AsyncStorage.multiRemove([
        CURRENT_USER_KEY,
        `${DIET_STORAGE_KEY}:${id}`,
        `${CUSTOM_FOODS_STORAGE_KEY}:${id}`,
        `${WORKOUT_LOGS_KEY}:${id}`,
        `${CUSTOM_TEMPLATES_KEY}:${id}`,
        `${CUSTOM_EXERCISES_KEY}:${id}`,
        `@fitaura:cart:${id}`,
        `@fitaura:orders:${id}`,
      ])
    }
  }

  const updateAvatar = async (id: string, uri: string) => {
    const updatedUsers = users.map((u) => (u.id === id ? { ...u, avatar: uri } : u))
    setUsers(updatedUsers)

    if (currentUser?.id === id) {
      setCurrentUser((prev) => (prev ? { ...prev, avatar: uri } : prev))
    }
  }

  return (
    <UserContext.Provider
      value={{
        users,
        currentUser,
        isLoading,
        register,
        login,
        logout,
        deleteUser,
        updateAvatar,
        updateUser,
      }}>
      {children}
    </UserContext.Provider>
  )
}
