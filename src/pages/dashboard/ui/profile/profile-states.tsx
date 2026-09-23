/** Birinchi yuklanish paytidagi skelet — yakuniy layout bilan bir xil to'r. */
export function ProfileSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="mt-8 grid animate-pulse items-start gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] xl:gap-8"
    >
      <div className="bg-surface shadow-card border-line overflow-hidden rounded-3xl border">
        <div className="bg-surface-muted h-36" />
        <div className="space-y-4 p-7">
          <div className="bg-surface-muted mx-auto h-5 w-3/4 rounded" />
          <div className="bg-surface-muted mx-auto h-5 w-1/2 rounded" />
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="bg-surface-muted h-12 rounded-xl" />
          ))}
        </div>
      </div>
      <div className="bg-surface shadow-card border-line rounded-3xl border p-8">
        <div className="bg-surface-muted h-6 w-1/3 rounded" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <div key={index} className="bg-surface-muted h-14 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
