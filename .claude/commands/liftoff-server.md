# Dev Server Manager

Manage the LiftOff dev server. Accepts one argument: `start`, `stop`, or `restart`.

**Usage:** `/server <start|stop|restart>`

Parse the user's argument to determine which action to run. If no argument is provided, ask which action they'd like to take.

## Subcommand: `start`

1. Check if a Next.js dev server is already running on port 3333 (`lsof -ti:3333`)
2. If running, tell the user and do nothing
3. If not running, start it in the background: `npm run dev -- -p 3333`
4. Wait a few seconds, then verify it's listening on port 3333
5. Report the URL: `http://localhost:3333`

## Subcommand: `stop`

1. Find the process on port 3333 (`lsof -ti:3333`)
2. If nothing is running, tell the user and do nothing
3. If running, kill the process (`kill $(lsof -ti:3333)`)
4. Verify the port is free
5. Report that the server is stopped

## Subcommand: `restart`

1. Run the `stop` flow
2. Run the `start` flow
