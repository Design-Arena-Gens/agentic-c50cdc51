## Agentic Request Automation

This Next.js application monitors a Gmail inbox for new request-oriented emails, logs them to a Google Sheet, and notifies Omar on WhatsApp with a concise summary.

### Features

- Gmail ingestion with keyword-based filtering and duplicate protection
- Automatic classification (type, priority) and summarisation of email content
- Google Sheets integration using the schema `Request ID | Date | Sender Name | Sender Email | Subject | Summary | Type | Priority | Status | Approval Time | Notes`
- WhatsApp alert via Twilio to notify Omar with the key request details
- Dashboard view of the latest captured requests
- CLI + API entrypoints suitable for cron scheduling (e.g. Vercel Cron)

### Prerequisites

- Google Cloud project with Gmail API OAuth credentials (web app) and refresh token for the monitored inbox
- Google Service Account with Sheets API access to the destination sheet
- Twilio account with WhatsApp messaging enabled

### Environment Variables

Copy `.env.local.example` to `.env.local` and provide real values:

```bash
cp .env.local.example .env.local
```

Ensure the sheet contains a `Requests` tab with the expected headers in the first row. The `Notes` column is used internally to store the Gmail message ID (`GMAIL_ID:<id>`) for de-duplication.

### Running Locally

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) for the dashboard.

### Processing Emails Manually

Run the ingestion script whenever needed:

```bash
npm run process:emails
```

### Scheduling (Production)

Deploy to Vercel and configure a [Vercel Cron](https://vercel.com/docs/cron-jobs) to call the API:

- URL: `https://YOUR-DEPLOYMENT.vercel.app/api/process-emails`
- Method: `POST`
- Frequency: recommended every 5 minutes

### Deployment

Build and deploy:

```bash
npm run build
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-c50cdc51
```

After deployment, verify the production health endpoint by visiting the dashboard or hitting `/api/process-emails`.
