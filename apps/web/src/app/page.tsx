'use client'

import { Button, Card } from '@fin/ui'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <Card>
        <h1 className="text-2xl font-semibold mb-4">Fintech Dashboard</h1>
        <Button onClick={() => alert('works!')}>
          Нажми меня
        </Button>
      </Card>
    </main>
  )
}
