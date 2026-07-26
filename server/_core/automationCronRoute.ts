/**
 * Automation (drip) processor cron — /api/cron/automations.
 *
 * Each run pulls active enrollments whose `nextRunAt` is due, sends the current
 * step's email, and advances the enrollment. Step timing is anchored to
 * `enrolledAt` (not to when the previous step actually fired), so a late cron
 * run doesn't drift the schedule.
 *
 * Auth: mirrors the digest cron — Vercel Cron sends `Authorization: Bearer
 * <CRON_SECRET>`. Without the secret in production the route refuses.
 *
 * Daily schedule is enough: the delays are in days (+2/+5/+9/+14), so a due
 * step goes out within 24h of its target. On cPanel (tarhely.eu) this can run
 * more frequently for tighter timing.
 *
 * Manual trigger:
 *   curl -X POST -H "Authorization: Bearer $CRON_SECRET" \
 *     https://g2amarketing.hu/api/cron/automations
 */
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getAutomation } from "./automations";
import { sendEmail, isEmailConfigured } from "./email";
import { runChurn } from "./churnCronRoute";

const ORIGIN = "https://g2amarketing.hu";
const BATCH = 200;

const DAY_MS = 24 * 60 * 60 * 1000;

export function registerAutomationCronRoute(app: Express): void {
  const handler = async (req: Request, res: Response) => {
    const secret = process.env.CRON_SECRET;
    if (secret) {
      const auth = req.headers.authorization || "";
      if (auth !== `Bearer ${secret}`) {
        return res.status(401).json({ error: "Unauthorized" });
      }
    } else if (process.env.NODE_ENV === "production") {
      return res.status(503).json({ error: "CRON_SECRET not set in production." });
    }

    if (!isEmailConfigured()) {
      return res.status(200).json({ ok: true, note: "email not configured — nothing sent", sent: 0 });
    }

    // Run churn first so freshly-enrolled win-backs (nextRunAt=now) go out in
    // this same pass. Cheap + idempotent (winbackSentAt guards re-enrolment).
    const churn = await runChurn();

    const due = await db.getDueEnrollments(BATCH);
    let sent = 0, completed = 0, cancelled = 0, failed = 0;

    for (const e of due) {
      const automation = getAutomation(e.automationKey);
      if (!automation) { await db.updateEnrollment(e.id, { status: "cancelled" }); cancelled++; continue; }

      // Skip / stop if the subscriber is gone or unsubscribed.
      const sub = await db.getNewsletterSubscriberByEmail(e.email);
      if (!sub || sub.isActive === false) { await db.updateEnrollment(e.id, { status: "cancelled" }); cancelled++; continue; }

      const step = automation.steps[e.currentStep];
      if (!step) { await db.updateEnrollment(e.id, { status: "completed", nextRunAt: null }); completed++; continue; }

      const unsubscribeUrl = `${ORIGIN}/api/newsletter/unsubscribe?token=${sub.unsubscribeToken ?? ""}`;
      const { subject, html } = step.build({ name: e.name ?? sub.name, band: e.band, unsubscribeUrl });
      const ok = await sendEmail({ to: e.email, subject, html });
      if (!ok) { failed++; continue; } // leave it due; retried next run
      sent++;

      const nextStep = e.currentStep + 1;
      const next = automation.steps[nextStep];
      if (next) {
        const nextRunAt = new Date(new Date(e.enrolledAt).getTime() + next.dayOffset * DAY_MS);
        await db.updateEnrollment(e.id, { currentStep: nextStep, nextRunAt });
      } else {
        await db.updateEnrollment(e.id, { currentStep: nextStep, status: "completed", nextRunAt: null });
        completed++;
      }
    }

    return res.status(200).json({ ok: true, processed: due.length, sent, completed, cancelled, failed, churn });
  };

  app.get("/api/cron/automations", handler);
  app.post("/api/cron/automations", handler);
}
