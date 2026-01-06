import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/assets/images/logo-no-bg.png" />
        <link rel="apple-touch-icon" href="/assets/images/logo-no-bg.png" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body text-gray-900 dark:text-white">
        {children}
      </body>
    </html>
  )
}