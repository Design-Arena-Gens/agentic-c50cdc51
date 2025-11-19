import { fetchRecentRequests } from "@/lib/sheets";
import styles from "./page.module.css";

async function loadRequests() {
  try {
    return {
      data: await fetchRecentRequests(25),
      error: null,
    };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export default async function Home() {
  const { data: requests, error } = await loadRequests();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Automation Agent Control Center</h1>
        <p>
          Monitor and triage incoming request emails, sync them to Google Sheets, and
          alert Omar on WhatsApp automatically.
        </p>
      </header>

      <section className={styles.section}>
        <h2>Workflow Status</h2>
        <div className={styles.metaGrid}>
          <div>
            <span className={styles.label}>Requests on Sheet</span>
            <strong>{requests.length}</strong>
          </div>
          <div>
            <span className={styles.label}>Latest Request</span>
            <strong>{requests[0]?.requestId ?? "—"}</strong>
          </div>
          <div>
            <span className={styles.label}>Latest Priority</span>
            <strong>{requests[0]?.priority ?? "—"}</strong>
          </div>
        </div>
        {error ? (
          <p className={styles.error}>
            Unable to load Google Sheet. Confirm credentials &mdash; {error}
          </p>
        ) : null}
      </section>

      <section className={styles.section}>
        <h2>Most Recent Requests</h2>
        {requests.length === 0 ? (
          <p className={styles.empty}>No requests have been captured yet.</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Date</th>
                  <th>Sender</th>
                  <th>Subject</th>
                  <th>Type</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.requestId}>
                    <td>{request.requestId}</td>
                    <td>{request.date}</td>
                    <td>
                      <div className={styles.sender}>
                        <span>{request.senderName}</span>
                        <small>{request.senderEmail}</small>
                      </div>
                    </td>
                    <td>
                      <div className={styles.subject}>
                        <span>{request.subject}</span>
                        <small>{request.summary}</small>
                      </div>
                    </td>
                    <td>{request.type}</td>
                    <td>
                      <span className={`${styles.tag} ${styles[`priority${request.priority}`]}`}>
                        {request.priority}
                      </span>
                    </td>
                    <td>{request.status || "Pending"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2>How It Works</h2>
        <ol className={styles.steps}>
          <li>
            Schedule a cron to call <code>POST /api/process-emails</code> every few
            minutes (Vercel Cron or GitHub Actions work well).
          </li>
          <li>
            The API parses Gmail for request-related keywords, classifies the email,
            and appends a row to Google Sheets with the required schema.
          </li>
          <li>
            A WhatsApp alert is sent to Omar summarizing the incoming request, ready
            for rapid triage.
          </li>
        </ol>
      </section>
    </div>
  );
}
