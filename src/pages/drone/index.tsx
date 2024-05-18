import Spline from '@splinetool/react-spline';
import React from 'react'
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'

// drone 1 https://prod.spline.design/qly1Ojc82Mb-1aS7/scene.splinecode
// drone 2 'https://prod.spline.design/QnWl9cmpft2bN7gI/scene.splinecode'
export default function App() {
    const { width, height } = useWindowSize()
  return (
    <div className="w-screen h-screen bg-sky-500/50" >
      <Confetti
        width={width}
        height={1000}
      />
      <h1 className="text-red-400 w-full text-4xl font-bold text-center p-">Congratulations you found<br/> the 10T!</h1>
      <div className="z-10 w-screen absolute bottom-2 left-1/2 transform -translate-x-1/2  block sm:max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">10T - Drone</h5>
        <p class="font-normal text-gray-700 dark:text-gray-400">The 10T drone is a light weight transporter used to carry Patholgy samples between <strong>Guys</strong> and <strong>St Thomas Hospitals</strong></p>
        <button class="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Track it!</button>
      </div>
    <Spline  scene="https://prod.spline.design/QnWl9cmpft2bN7gI/scene.splinecode" />
    </div>
  );
}