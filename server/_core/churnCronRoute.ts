/**
 * Churn cron — /api/cron/churn.
 *
 * Two passes:
 *  1. Win-back: subscribers who WERE engaged but went quiet (lastEngagedAt >
 *     COLD_DAYS old) get enrolled into the "winback" sequence once.
 *  2. Sunset: subscribers who got the win-back GRACE_DAYS ago and still didn't
 *     re-engage are deactivated (isActive=false) — this protects sender
 *     reputation, which protects inbox placement and revenue.
 *
 * SAFE BY DESIGN: only subscribers with real engagement history are ever
 * touched (getChurnCandidates requires lastEngagedAt IS NOT NULL). Before the
 * Resend webhook is wired every lastEngagedAt is null, so nothing is churned —
 * no risk of mass-sunsetting an untracked list.
 *
 * Auth: CRON_SECRET Bearer, like the other crons. Weekly is plenty.
 */
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getAutomation } from "./automations";
import { isEmailConfigured } from "./email";

const COLD_DAYS = 60;
const GRACE_DAYS = 21; // win-back is 2 steps over 7 days; 21d total before sunset

/** The churn work — reusable so the daily automations cron can run it too
 *  (keeps us within the Vercel cron count). Returns a small summary. */
export async function runChurn(): Promise<{ winbackEnrolled: number; sunset: number }> {
  let winbackEnrolled = 0, sunset = 0;

  // 1) Enrol cold subscribers into win-back.
  if (isEmailConfigured() && getAutomation("winback")) {
    const cold = await db.getChurnCandidates(COLD_DAYS);
    for (const c of cold) {
      if (await db.hasActiveEnrollment(c.email, "winback")) continue;
      await db.createEnrollment({ email: c.email, automationKey: "winback", band: c.band, name: c.name, nextRunAt: new Date() });
      await db.markWinbackSent(c.email);
      winbackEnrolled++;
    }
  }

  // 2) Sunset the still-unresponsive.
  const toSunset = await db.getSunsetCandidates(GRACE_DAYS);
  for (const s of toSunset) {
    await db.sunsetSubscriber(s.id);
    await db.cancelEnrollmentsForEmail(s.email);
    sunset++;
  }

  return { winbackEnrolled, sunset };
}

export function registerChurnCronRoute(app: Express): void {
  const handler = async (req: Request, res: Response) => {
    const secret = process.env.CRON_SECRET;
    if (secret) {
      if ((req.headers.authorization || "") !== `Bearer ${secret}`) {
        return res.status(401).json({ error: "Unauthorized" });
      }
    } else if (process.env.NODE_ENV === "production") {
      return res.status(503).json({ error: "CRON_SECRET not set in production." });
    }
    const result = await runChurn();
    return res.status(200).json({ ok: true, ...result });
  };

  app.get("/api/cron/churn", handler);
  app.post("/api/cron/churn", handler);
}
