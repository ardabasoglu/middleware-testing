import { NextRequest, NextResponse } from "next/server"

export default async function middleware(req: NextRequest) {
  const endpoint: Endpoint | undefined = endpoints.find(
    endPoint => endPoint.path === req.nextUrl.pathname
  )
  if (!endpoint) {
    return forbid("Path not found")
  }
  if (endpoint.requiredFields) {
    const hasFields = await hasRequiredFields(req, endpoint)
    if (!hasFields) {
      return forbid("Missing required fields")
    }
  }
  return allow()
}

const hasRequiredFields = async (req: NextRequest, endpoint: Endpoint) => {
  // When this is called, the API route (req.nextUrl) which is transferred by allow() method receives an empty body
  // This only happens on Netlify, not on localhost
  const body = await req.json()
  return !endpoint.requiredFields || endpoint.requiredFields.every(field => field in body)
}

const forbid = (message: string) => {
  return new NextResponse(JSON.stringify({ message }), {
    status: 403,
    headers: {
      "content-type": "application/json"
    }
  })
}

const allow = () => {
  return NextResponse.next({
    headers: {
      "content-type": "application/json"
    }
  })
}

export const config = {
  matcher: ["/api/foo/:path*"]
}

interface Endpoint {
  path: string
  requiredFields?: string[]
}

const endpoints: Endpoint[] = [
  {
    path: "/api/foo/bar",
    requiredFields: ["foo"]
  }
]
