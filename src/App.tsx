import { useMemo, useState, useEffect } from 'react'

const WEEKS_IN_YEAR = 52
const LIFE_EXPECTANCY = 90

type WeekData = {
  isLived: boolean
  isHighlighted: boolean
  date: Date
  year: number
}

function App() {
  const [birthDate, setBirthDate] = useState(() => {
    const saved = localStorage.getItem('birthDate')
    return saved || '1990-01-01'
  })
  const [highlightedWeeks, setHighlightedWeeks] = useState<number[]>(() => {
    const saved = localStorage.getItem('highlightedWeeks')
    return saved ? JSON.parse(saved) : []
  })

  const currentDate = new Date()
  const birthDateObj = new Date(birthDate)

  const weeksData = useMemo(() => {
    const diffTime = Math.abs(currentDate.getTime() - birthDateObj.getTime())
    const weeksLived = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7))
    
    return Array.from({ length: LIFE_EXPECTANCY }).map((_, yearIndex) => {
      const yearStart = new Date(birthDateObj.getFullYear() + yearIndex, birthDateObj.getMonth(), birthDateObj.getDate())
      const weeksInThisYear = Array.from({ length: WEEKS_IN_YEAR }).map((_, weekIndex) => {
        const weekNumber = yearIndex * WEEKS_IN_YEAR + weekIndex
        const weekDate = new Date(yearStart.getTime() + weekIndex * 7 * 24 * 60 * 60 * 1000)
        return {
          isLived: weekNumber < weeksLived,
          isHighlighted: highlightedWeeks.includes(weekNumber),
          date: weekDate,
          year: yearStart.getFullYear()
        }
      })
      return weeksInThisYear
    })
  }, [currentDate, birthDateObj, highlightedWeeks])

  useEffect(() => {
    localStorage.setItem('birthDate', birthDate)
  }, [birthDate])

  useEffect(() => {
    localStorage.setItem('highlightedWeeks', JSON.stringify(highlightedWeeks))
  }, [highlightedWeeks])

  const toggleWeekHighlight = (weekNumber: number) => {
    setHighlightedWeeks(prev => 
      prev.includes(weekNumber) 
        ? prev.filter(i => i !== weekNumber)
        : [...prev, weekNumber]
    )
  }

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center bg-[#111111]">
      <h1 className="text-4xl font-light mb-4 text-white tracking-wide">Life Calendar</h1>
      
      <div className="mb-12">
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="px-4 py-2 rounded bg-[#222222] text-white border border-[#333333] focus:outline-none focus:border-[#444444] hover:border-[#444444] transition-colors"
        />
      </div>

      <div className="flex gap-1">
        <div className="flex flex-col justify-between py-2 pr-4 text-[#666666] text-sm">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="text-right">{Math.floor(i * 10)}</span>
          ))}
        </div>
        
        <div className="grid grid-cols-52 auto-rows-fr gap-[1px] max-w-[1300px] bg-[#222222] p-1 rounded-lg">
          {weeksData.flat().map((week, index) => (
            <div
              key={index}
              onClick={() => week.isLived && toggleWeekHighlight(index)}
              className={`aspect-square rounded-sm cursor-pointer transition-all duration-200 group relative
                ${week.isHighlighted 
                  ? 'bg-blue-500 hover:bg-blue-400' 
                  : week.isLived
                    ? 'bg-[#ffffff] hover:bg-[#cccccc]'
                    : 'bg-[#333333]'
                }`}
            >
              <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 
                             bg-black text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity z-10">
                {week.year}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 text-[#666666] space-y-2 text-center">
        <p className="text-lg">
          <span className="text-white">{weeksData.flat().filter(w => w.isLived).length}</span> weeks lived
        </p>
        <p className="text-lg">
          <span className="text-white">{weeksData.flat().filter(w => !w.isLived).length}</span> weeks remaining
        </p>
        {highlightedWeeks.length > 0 && (
          <p className="text-sm">
            {highlightedWeeks.length} highlighted {highlightedWeeks.length === 1 ? 'week' : 'weeks'}
          </p>
        )}
      </div>
    </div>
  )
}

export default App
