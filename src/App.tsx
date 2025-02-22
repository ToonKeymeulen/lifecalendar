import { useMemo } from 'react'

const WEEKS_IN_YEAR = 52
const LIFE_EXPECTANCY = 90

function App() {
  const currentDate = new Date()
  const birthDate = new Date('1990-01-01') // You'll need to change this to your birth date

  const weeksLived = useMemo(() => {
    const diffTime = Math.abs(currentDate.getTime() - birthDate.getTime())
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7))
    return diffWeeks
  }, [currentDate, birthDate])

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center bg-black">
      <h1 className="text-2xl font-bold mb-8 text-white">Life Calendar</h1>
      <div className="grid grid-cols-52 gap-[2px] max-w-[1400px]">
        {Array.from({ length: LIFE_EXPECTANCY * WEEKS_IN_YEAR }).map((_, index) => (
          <div
            key={index}
            className={`w-[12px] h-[12px] rounded-sm ${
              index < weeksLived
                ? 'bg-white'
                : 'bg-gray-800'
            }`}
            title={`Week ${index + 1}`}
          />
        ))}
      </div>
      <div className="mt-8 text-white">
        <p>Weeks lived: {weeksLived}</p>
        <p>Weeks remaining: {LIFE_EXPECTANCY * WEEKS_IN_YEAR - weeksLived}</p>
      </div>
    </div>
  )
}

export default App
