## Car Intelligence Relay

Car Intelligence Relay aggregates fresh automotive news from renowned publications (Car and Driver, Carscoops, Autocar) and lets you relay highlights directly into a Telegram channel with a single click.

### Requirements

- Node.js 18.18 or newer
- Telegram Bot token and channel ID where the bot has posting permissions

### Environment Variables

Create a `.env.local` file and provide the Telegram credentials:

```bash
TELEGRAM_BOT_TOKEN=123456:ABCDEF
TELEGRAM_CHAT_ID=-1001234567890
```

`TELEGRAM_CHAT_ID` accepts user, group, or channel identifiers. For channels, prefix the numeric ID with `-100`.

### Development

Install dependencies and launch the development server:

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to explore the dashboard. Filter by publication, search for keywords, and push curated stories to Telegram using the provided action buttons.

### Production

Build and start the production bundle:

```bash
npm run build
npm run start
```

Deployments on Vercel only need the environment variables above configured through the dashboard or `vercel env`.
