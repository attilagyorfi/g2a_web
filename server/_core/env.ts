export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  // Resend — transactional email (contact/audit lead notifications)
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  resendFromEmail: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
  resendNotifyEmail: process.env.RESEND_NOTIFY_EMAIL ?? "",
  // Resend webhook signing secret (Svix). Set in Resend dashboard
  // under Settings → Webhooks → Signing Secret. Without it the webhook
  // 401s in production; in dev it's accepted unsigned for easy testing.
  resendWebhookSecret: process.env.RESEND_WEBHOOK_SECRET ?? "",
  // Cloudinary — image hosting + auto WebP/AVIF
  cloudinaryUrl: process.env.CLOUDINARY_URL ?? "",
  cloudinaryCloudName: process.env.VITE_CLOUDINARY_CLOUD_NAME ?? "",
  // OpenAI — admin AI assist (blog draft, SEO meta, text improve)
  openaiApiKey: process.env.OPENAI_API_KEY ?? "",
  openaiModel: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
};
