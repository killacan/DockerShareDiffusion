import AuthButton from './AuthButton'
import LinkComponent from './link'
import { type LoaderFunctionArgs } from '@remix-run/node'
import { createServerClient, parse, serialize } from '@supabase/ssr'
import { useLoaderData } from '@remix-run/react'

export async function loader({ request }: LoaderFunctionArgs) {
  const cookies = parse(request.headers.get('Cookie') ?? '')
  const headers = new Headers()

  const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      get(key) {
        return cookies[key]
      },
      set(key, value, options) {
        headers.append('Set-Cookie', serialize(key, value, options))
      },
      remove(key, options) {
        headers.append('Set-Cookie', serialize(key, '', options))
      },
    },
  })

  const { data: session, error } = await supabase.auth.getSession();

  return new Response(
    JSON.stringify({ session }), 
  {
    headers,
    status: 200,
    statusText: 'OK',
  })
}

export default function Nav() {

  const session = useLoaderData<typeof loader>();

  return (
    <nav className="w-full flex flex-col justify-center items-center border-b border-b-foreground/10 h-17">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          <div className='flex gap-2'>
            <LinkComponent href={"/"}>Share Diffusion</LinkComponent>
            {session && <LinkComponent href={"/createpost"}>Post!</LinkComponent>}
          </div>
          <AuthButton session={session}/>
        </div>
        <div className="w-full max-w-4xl flex items-center p-3 text-sm">
          <LinkComponent href={"/models"}>Models</LinkComponent>
          <LinkComponent href={"/photos"}>Photos</LinkComponent>
        </div>
    </nav>
  )
}
