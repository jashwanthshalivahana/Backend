# Deploying on Render

1. Create a new Web Service on Render
2. Connect your repo or upload the zip
3. Build Command: bun install && bun run db:generate && bun run db:push && bun run seed
4. Start Command: bun start
5. Add environment variable: DATABASE_URL=file:./dev.db
6. Port: 3001

# After deploy, add your product images:
Upload your product images to the `images/` folder in the project root.