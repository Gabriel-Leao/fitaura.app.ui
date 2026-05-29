import AsyncStorage from '@react-native-async-storage/async-storage'

export const storageGet = async <T>(key: string): Promise<T | null> => {
  try {
    const raw = await AsyncStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch (e) {
    console.error(`Erro ao ler "${key}":`, e)
    return null
  }
}

export const storageSet = async <T>(key: string, value: T): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error(`Erro ao salvar "${key}":`, e)
  }
}

export const storageRemove = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key)
  } catch (e) {
    console.error(`Erro ao remover "${key}":`, e)
  }
}
