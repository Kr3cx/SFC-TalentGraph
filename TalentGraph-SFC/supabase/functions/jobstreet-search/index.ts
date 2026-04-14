
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { job_role, skills, location, salary_min, salary_max } = await req.json()

    // 1. Generate Dynamic Query
    // Rules: lowercase, clean spacing, avoid generic words like "engineer"
    const cleanRole = job_role
      .toLowerCase()
      .replace(/engineer/g, '')
      .trim()
    
    const cleanSkills = (skills || [])
      .map((s: string) => s.toLowerCase().trim())
      .join(' ')

    const dynamicQuery = `${cleanRole} ${cleanSkills}`.replace(/\s+/g, ' ').trim()

    // 2. Map Country Code
    const countryMap: Record<string, string> = {
      'indonesia': 'id',
      'malaysia': 'my',
      'singapore': 'sg',
      'philippines': 'ph',
      'thailand': 'th',
      'vietnam': 'vn'
    }
    const countryCode = countryMap[location?.toLowerCase()] || 'id'

    // 3. Salary Range (Optional)
    let salaryParam = ''
    if (salary_min && salary_max) {
      salaryParam = `${salary_min}-${salary_max}`
    }

    // Call JobStreet API
    const RAPIDAPI_KEY = Deno.env.get("RAPIDAPI_KEY")
    const RAPIDAPI_HOST = "jobstreet.p.rapidapi.com"

    const url = new URL(`https://${RAPIDAPI_HOST}/search`)
    url.searchParams.append('query', dynamicQuery)
    url.searchParams.append('countryCode', countryCode)
    if (salaryParam) {
      url.searchParams.append('salary', salaryParam)
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY || '',
        'x-rapidapi-host': RAPIDAPI_HOST,
      },
    })

    const data = await response.json()

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
