
'use client'
import { useEffect, useState } from "react";
import Chart from "./components/chart";

export type DataJSON = {
  time: string
  data: string
}

export default function Home() {
  const [connectToLK, setConnectToLK] = useState<Record<string, DataJSON>[]>()
  const [firstRequest, setFirstRequest] = useState<boolean>(false)

  const sendApiRequest = async () => {
    // Здесь вызываем функцию, которая отправляет запрос к вашему API
    try {
      const response = await fetch('http://localhost:5000/connections', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    
      if (response.status !== 200) {
        throw new Error
      }

      const test = await response.json()
      setConnectToLK(test)
    }
    catch(err) {
      console.log('error', err)
    }
  }

  // useEffect(() => {
  //   // Вызываем функцию каждые 8 минут (8 * 60 * 1000 миллисекунд)
  //   // const timeInterval = firstRequest ? 8 * 60 * 1000 : 1000
  //   const interval = setInterval(sendApiRequest, 1000000);

  //   // Очищаем интервал перед размонтированием компонента
  //   return () => clearInterval(interval);
  // }, []);

  console.log(connectToLK, 'connectToLK')

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button className="py-2 px-5 bg-blue-400 rounded-xl text-white" onClick={() => sendApiRequest()}>Get connections</button>
      <Chart data={connectToLK} />
    </main>
  )
}
