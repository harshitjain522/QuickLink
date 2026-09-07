import { useCallback, useState, type FormEvent } from "react";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ShortenForm from "./components/ShortenForm";
import StatusMessage from "./components/StatusMessage";
import ShortUrlResult from "./components/ShortUrlResult";
import { isUrlValid, shortenUrl } from "./lib/shorten";
import type { Status } from "./types";

function App() {
    const [longUrl, setLongUrl] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [sourceLength, setSourceLength] = useState(0);
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<Status>("idle");
    const [loading, setLoading] = useState(false);

    const handleSubmit = useCallback(
        async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setShortUrl("");
            setMessage("");

            const url = longUrl.trim();
            if (!url) {
                setStatus("error");
                setMessage("Enter a URL to shorten.");
                return;
            }

            if (!isUrlValid(url)) {
                setStatus("error");
                setMessage("That is not a URL. Include the https:// prefix.");
                return;
            }

            setLoading(true);
            try {
                const result = await shortenUrl(url);
                setShortUrl(result);
                setSourceLength(url.length);
                setStatus("success");
            } catch (error) {
                setStatus("error");
                setMessage(
                    error instanceof Error
                        ? error.message
                        : "The server did not respond. Try again.",
                );
            } finally {
                setLoading(false);
            }
        },
        [longUrl],
    );

    const copyToClipboard = useCallback(async () => {
        if (!shortUrl) {
            return;
        }

        try {
            await navigator.clipboard.writeText(shortUrl);
            setStatus("success");
            setMessage("Copied.");
        } catch {
            setStatus("error");
            setMessage("Copying failed. Select the link and copy it manually.");
        }
    }, [shortUrl]);

    return (
        <div className="mx-auto flex min-h-svh max-w-[68ch] flex-col px-6 font-sans text-ink antialiased sm:px-10">
            <Header />

            <main className="flex flex-1 flex-col justify-center py-8">
                <h1 className="mb-10 max-w-[30ch] text-[1.375rem] font-medium leading-snug tracking-tight">
                    Paste a long link. Get a short one.
                </h1>

                <ShortenForm
                    longUrl={longUrl}
                    onLongUrlChange={setLongUrl}
                    onSubmit={handleSubmit}
                    loading={loading}
                />

                <ShortUrlResult
                    shortUrl={shortUrl}
                    sourceLength={sourceLength}
                    onCopy={copyToClipboard}
                />

                <StatusMessage status={status} message={message} />

                <p className="sr-only" role="status" aria-live="polite">
                    {shortUrl ? `Short link ready: ${shortUrl}` : ""}
                </p>
            </main>

            <Footer />
        </div>
    );
}

export default App;
