import "./env.js";
import express, { type Request, type Response } from "express";
import cors from "cors";
import { nanoid } from "nanoid";
import { pool } from "./db.js";

const PORT = Number(process.env.PORT) || 5000;

const app = express();
app.use(cors());
app.use(express.json({ limit: "10kb" }));

const isValidUrl = (value: string): boolean => {
    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
};

const createShortCode = (): string => nanoid(7).toLowerCase();

app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", uptime: process.uptime() });
});

app.get("/", (_req: Request, res: Response) => {
    res.json({ message: "QuickLink API is running." });
});

interface ShortenRequestBody {
    longUrl?: unknown;
}

app.post(
    "/shorten",
    async (req: Request<Record<string, never>, unknown, ShortenRequestBody>, res: Response) => {
        const { longUrl } = req.body;
        const trimmedUrl = typeof longUrl === "string" ? longUrl.trim() : "";

        if (!trimmedUrl) {
            return res.status(400).json({ error: "URL is required." });
        }

        if (!isValidUrl(trimmedUrl)) {
            return res.status(400).json({ error: "Invalid URL format." });
        }

        try {
            let shortCode: string | undefined;
            let inserted = false;

            for (let attempt = 0; attempt < 5; attempt += 1) {
                shortCode = createShortCode();
                const result = await pool.query<{ short_code: string }>(
                    "INSERT INTO urls (short_code, long_url) VALUES ($1, $2) RETURNING short_code",
                    [shortCode, trimmedUrl],
                );

                if (result.rowCount === 1) {
                    inserted = true;
                    break;
                }
            }

            if (!inserted || !shortCode) {
                throw new Error("Could not generate a unique short code.");
            }

            return res.status(201).json({
                shortUrl: `${req.protocol}://${req.get("host")}/${shortCode}`,
            });
        } catch (error) {
            console.error("SHORTEN ERROR:", error);

            if (error instanceof Error && "code" in error && error.code === "23505") {
                return res
                    .status(500)
                    .json({ error: "Shortcode collision detected. Try again." });
            }

            return res.status(500).json({ error: "Unable to shorten URL." });
        }
    },
);

app.get("/:code", async (req: Request<{ code: string }>, res: Response) => {
    const { code } = req.params;

    if (!code) {
        return res.status(400).json({ error: "Code is required." });
    }

    try {
        const { rows } = await pool.query<{ long_url: string }>(
            "SELECT long_url FROM urls WHERE short_code = $1",
            [code],
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Short URL not found." });
        }

        return res.redirect(rows[0].long_url);
    } catch (error) {
        console.error("REDIRECT ERROR:", error);
        return res.status(500).json({ error: "Unable to redirect." });
    }
});

app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: "Not found." });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
