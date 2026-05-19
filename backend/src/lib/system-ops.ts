import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const CONFIRM_MIGRATE = 'RUN-MIGRATE'
const CONFIRM_SEED = 'RUN-SEED'

export function systemOpsAllowed() {
  if (process.env.NODE_ENV !== 'production') return true
  return process.env.ADMIN_ALLOW_SYSTEM_OPS === 'true'
}

export function validateSystemConfirm(action: 'migrate' | 'seed', confirm?: string) {
  const expected = action === 'migrate' ? CONFIRM_MIGRATE : CONFIRM_SEED
  return confirm === expected
}

function backendRoot() {
  const here = path.dirname(fileURLToPath(import.meta.url))
  return path.resolve(here, '../..')
}

function runCommand(command: string, args: string[]) {
  return new Promise<{ stdout: string; stderr: string; code: number }>((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: backendRoot(),
      env: process.env,
      shell: false,
    })

    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString()
    })
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString()
    })
    child.on('error', reject)
    child.on('close', (code) => {
      resolve({ stdout, stderr, code: code ?? 1 })
    })
  })
}

export async function runMigrations() {
  return runCommand('npx', ['prisma', 'migrate', 'deploy'])
}

export async function runSeed() {
  return runCommand('npx', ['prisma', 'db', 'seed'])
}

export const systemConfirmHints = {
  migrate: CONFIRM_MIGRATE,
  seed: CONFIRM_SEED,
} as const
