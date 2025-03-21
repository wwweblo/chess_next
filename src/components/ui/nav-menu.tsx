"use client"
import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import ToggleThemeButton from "../tiggleThemeButton"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet" // Import SheetTitle from Radix UI
import { cn } from "@/lib/utils"
import Link from "next/link"

interface NavMenuProps {
  items?: {
    title: string
    href: string
  }[]
  className?: string
}

export default function NavMenu({
  items = [
    { title: "Главная", href: "/" },
    { title: "Сыграть с ботом", href: "/play/bot" },
    { title: "Сыграть с другими игроками", href: "/play/online" },
    { title: "Дебюты", href: "/admin/openings" },
  ],
  className,
}: NavMenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className={cn("relative", className)}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="flex items-center justify-center"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[300px]">
          {/* Adding DialogTitle */}
          <SheetTitle className="sr-only">Menu</SheetTitle>  {/* Visible in screen readers but hidden visually */}
          <nav className="flex flex-col gap-4 mt-8">
            <ToggleThemeButton />
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-lg font-medium transition-colors hover:text-primary ml-5"
                onClick={() => setOpen(false)}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}
