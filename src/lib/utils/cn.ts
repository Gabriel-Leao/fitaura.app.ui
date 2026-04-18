import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tw-merge'

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}
