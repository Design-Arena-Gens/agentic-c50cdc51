#!/usr/bin/env node
import { processIncomingRequests } from "@/lib/request-processor";

async function main() {
  try {
    const result = await processIncomingRequests();
    console.log(
      JSON.stringify(
        {
          scanned: result.scanned,
          created: result.created.map((request) => ({
            requestId: request.requestId,
            sender: `${request.senderName} <${request.senderEmail}>`,
            subject: request.subject,
            priority: request.priority,
          })),
          skipped: result.skipped,
        },
        null,
        2,
      ),
    );
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}

void main();
