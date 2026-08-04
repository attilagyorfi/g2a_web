import express, { type Express, type Request, type Response, type NextFunction } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  // Cache-Control per asset type — mirrors the old vercel.json `headers` so we
  // keep the same caching once Apache/Passenger (tarhely.eu) serves this
  // instead of Vercel's CDN.
  const setHeaders = (res: Response, filePath: string) => {
    if (/[\\/]assets[\\/]/.test(filePath)) {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    } else if (/\.(png|jpe?g|webp|avif|svg|ico|woff2?|pdf)$/i.test(filePath)) {
      res.setHeader("Cache-Control", "public, max-age=2592000, stale-while-revalidate=86400");
    } else if (/\.(html|xml)$/i.test(filePath)) {
      res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
    }
  };

  // Real files first (assets, PDFs, sitemap…). redirect:false so /path doesn't
  // get 301'd to /path/ (keeps our canonical, trailing-slash-free URLs).
  app.use(express.static(distPath, { redirect: false, setHeaders }));

  // Prerendered per-route HTML: prerender-meta writes dist/public/<route>/index.html.
  // Vercel resolved these automatically; here we serve them explicitly so
  // crawlers get the right <title>/OG per route — without a trailing-slash redirect.
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    if (req.path.startsWith("/api/")) return next();
    const rel = req.path.replace(/\/+$/, "");
    if (!rel) return next();
    const candidate = path.join(distPath, rel, "index.html");
    // path.join normalises away any ../ — the startsWith guard blocks traversal.
    if (candidate.startsWith(distPath + path.sep) && fs.existsSync(candidate)) {
      res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
      return res.sendFile(candidate);
    }
    next();
  });

  // SPA fallback → root index.html (client-side routing takes over).
  app.use("*", (_req, res) => {
    res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
