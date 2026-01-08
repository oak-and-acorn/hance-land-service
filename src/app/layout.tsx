import './globals.css'
import { draftMode } from 'next/headers'
import { cookies } from 'next/headers'

// Preview bar component
function PreviewBar({ branch }: { branch?: string }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-blue-600 text-white p-2 text-sm">
      <div className="container mx-auto flex justify-between items-center">
        <span>Preview mode - viewing branch: {branch || 'main'}</span>
        <a 
          href="/preview/end" 
          className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded text-sm"
        >
          Exit Preview
        </a>
      </div>
    </div>
  )
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isEnabled } = await draftMode()
  const cookieStore = await cookies()
  const branch = cookieStore.get('keystatic-branch')?.value

  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/assets/images/logo-no-bg.png" />
        <link rel="apple-touch-icon" href="/assets/images/logo-no-bg.png" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body text-gray-900 dark:text-white">
        {isEnabled && <PreviewBar branch={branch} />}
        <div style={isEnabled ? { marginTop: '48px' } : {}}>
          {children}
        </div>
      </body>
    </html>
  )
}