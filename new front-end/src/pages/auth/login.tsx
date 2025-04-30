import { GalleryVerticalEnd } from "lucide-react"
import { Player } from "@lottiefiles/react-lottie-player"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* First column - left side */}
      <div className="flex flex-col gap-4 p-6 md:p-10 bg-muted">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            ParkWise
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Second column - right side with white background */}
      <div className="relative hidden lg:flex items-center justify-center bg-white">
        <Player
          autoplay
          loop
          src="/login1.json"
          style={{ height: 500, width: 500, backgroundColor: "transparent" }}
        />
      </div>
    </div>
  )
}
