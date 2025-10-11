"use client"

import { useEffect, useState } from "react"
import Button from "./ui/button/Button"

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark")
      setDark(true)
    }
  }, [])

  const toggleTheme = () => {
    if (dark) {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
      setDark(false)
    } else {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
      setDark(true)
    }
  }

  return (
    <Button
      onClick={toggleTheme}
      className="px-4 py-2 rounded-lg border bg-background text-foreground transition"
    >
      {dark ? "🌞 Светлая тема" : "🌙 Тёмная тема"}
    </Button>
  )
}
