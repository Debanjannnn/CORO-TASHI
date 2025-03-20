export default function SkeletonLoader() {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-12 h-12 rounded-full border-4 border-orange-500 border-t-transparent animate-spin mb-4"></div>
        <div className="grid gap-4 w-full max-w-md">
          <div className="h-8 bg-zinc-800/50 rounded-lg animate-pulse"></div>
          <div className="h-24 bg-zinc-800/50 rounded-lg animate-pulse"></div>
          <div className="h-24 bg-zinc-800/50 rounded-lg animate-pulse"></div>
          <div className="h-24 bg-zinc-800/50 rounded-lg animate-pulse"></div>
        </div>
      </div>
    )
  }
  
  