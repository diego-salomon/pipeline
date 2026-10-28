import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Keep each test isolated: unmount React trees and clear web storage.
afterEach(() => {
  cleanup()
  try {
    window.localStorage.clear()
    window.sessionStorage.clear()
  } catch {
    // storage may be unavailable in some environments; ignore.
  }
})
