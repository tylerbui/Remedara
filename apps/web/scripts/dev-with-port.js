#!/usr/bin/env node

const { spawn } = require('child_process')
const net = require('net')

async function findAvailablePort(startPort = 3000) {
  return new Promise((resolve) => {
    const server = net.createServer()
    
    server.listen(startPort, () => {
      const port = server.address().port
      server.close(() => resolve(port))
    })
    
    server.on('error', () => {
      findAvailablePort(startPort + 1).then(resolve)
    })
  })
}

async function main() {
  const port = await findAvailablePort(3000)
  
  // Set environment variables
  process.env.NEXTAUTH_URL = `http://localhost:${port}`
  process.env.NEXT_PUBLIC_APP_URL = `http://localhost:${port}`
  process.env.PORT = port.toString()
  
  console.log(`🚀 Starting development server on http://localhost:${port}`)
  console.log(`📝 NEXTAUTH_URL set to: http://localhost:${port}`)
  
  // Start Next.js dev server
  const child = spawn('npx', ['next', 'dev', '-p', port.toString()], {
    stdio: 'inherit',
    env: { ...process.env }
  })
  
  child.on('exit', (code) => {
    process.exit(code)
  })
}

main().catch(console.error)