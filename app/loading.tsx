

export default function Loading() {
  return (
    <div className='flex flex-col items-center justify-center h-screen w-full gap-2'>
      <div className="border-primary mb-4 h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 ease-linear" />
      <h2 className=" text-2xl font-mono font-sans text-primary tracking-wider uppercase">Loading</h2>
      <p className=" text-sm font-light text-muted-foreground">Please wait</p>
    </div>
  )
}
