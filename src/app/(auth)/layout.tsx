import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row items-center justify-center w-full h-screen">
        {/* LEFT */}
        <div className="w-1/2 h-full bg-primary flex flex-col items-start justify-start px-16 py-8 relative gap-6">
          <div className="text-5xl font-bold text-primary-foreground w-full">GigWork</div>
          <div className="h-1 bg-primary-foreground w-full rounded-full"></div>
          <div className="h-1 bg-primary-foreground w-1/2 rounded-full"></div>
          <div className="text-5xl font-bold text-primary-foreground w-full">Job can’t be that flexible without our platform !</div>
          <Image 
            src="/jobs-finding.svg" 
            alt="Jobs Finding"
            width={600}
            height={500}
            className="absolute bottom-0"
          />
        </div>

        {/* RIGHT */}
        <div className="relative w-1/2 h-screen px-16 py-8 bg-[#f8f8f8] overflow-y-scroll">
            {children}
            <div className="w-full h-16 bg-transparent"></div>
        </div>
    </div>
  )
}