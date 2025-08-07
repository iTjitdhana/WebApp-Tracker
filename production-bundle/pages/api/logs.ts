import { NextApiRequest, NextApiResponse } from 'next'
import mysql from 'mysql2/promise'

const dbConfig = {
  host: '192.168.0.93',
  user: 'it.jitdhana',
  password: 'iT12345$',
  database: 'esp_tracker'
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { date } = req.query
      
      if (!date) {
        return res.status(400).json({ error: 'Date parameter is required' })
      }

      const connection = await mysql.createConnection({ ...dbConfig, dateStrings: true })
      
      // ดึงข้อมูล logs ตามวันที่
      const [rows] = await connection.execute(
        `SELECT * FROM logs WHERE DATE(timestamp) = ? ORDER BY timestamp DESC`,
        [date]
      )
      
      await connection.end()
      
      res.status(200).json(rows)
    } catch (error) {
      console.error('Database error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 