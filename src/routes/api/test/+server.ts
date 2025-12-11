// src/routes/api/get-data/+server.js
import { json } from '@sveltejs/kit';

export async function GET() {
  return json({
    data:"Hello"
  }, {
    headers: {
      'Cache-Control': 'public, max-age=3600'
    }
  });
}