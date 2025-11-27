import { createContext, useContext, ReactNode } from 'react'
import { useImmer } from 'use-immer'

export interface AppState {
  tick: number
}

const initialState: AppState = {
  tick: 0,
}

type AppStateContextType = {
  state: AppState
  updateState: (updater: (draft: AppState) => void) => void
}

const AppStateContext = createContext<AppStateContextType | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, updateState] = useImmer(initialState)

  return (
    <AppStateContext.Provider value={{ state, updateState }}>
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const context = useContext(AppStateContext)
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider')
  }
  return context
}
