import { VegaChart } from './VegaChart.jsx'

export const MainArea = ({ specBar, monate }) => {
  return (
    <main className="main-area">
      {specBar && monate && (
        <VegaChart spec={specBar} data={monate} name="monate" />
      )}
    </main>
  )
}
