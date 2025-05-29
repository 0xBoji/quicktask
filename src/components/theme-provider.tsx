"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { LOCAL_STORAGE_KEYS } from "@/constants/app"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey={LOCAL_STORAGE_KEYS.THEME}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
} 