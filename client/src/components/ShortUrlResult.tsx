interface ShortUrlResultProps {
    shortUrl: string;
    sourceLength: number;
    onCopy: () => void;
}

const splitShortUrl = (shortUrl: string) => {
    try {
        const url = new URL(shortUrl);
        return { origin: `${url.host}/`, code: url.pathname.slice(1) };
    } catch {
        return { origin: "", code: shortUrl };
    }
};

function ShortUrlResult({ shortUrl, sourceLength, onCopy }: ShortUrlResultProps) {
    if (!shortUrl) {
        return null;
    }

    const { origin, code } = splitShortUrl(shortUrl);

    return (
        <div key={shortUrl} className="mt-12">
            <div className="fold h-0.5 bg-ink" />

            <a
                href={shortUrl}
                target="_blank"
                rel="noreferrer"
                className="land mt-8 block no-underline"
            >
                <span className="block font-mono text-base text-mute">
                    {origin}
                </span>
                <span className="block break-all font-mono text-[clamp(2.5rem,13vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.045em] text-mark">
                    {code}
                </span>
            </a>

            <div className="land mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <button
                    type="button"
                    onClick={onCopy}
                    className="h-10 rounded-md border border-rule px-5 text-sm font-medium text-ink transition-colors hover:border-ink"
                >
                    Copy
                </button>
                <span className="font-mono text-xs text-mute">
                    {sourceLength} &rarr; {shortUrl.length} characters
                </span>
            </div>
        </div>
    );
}

export default ShortUrlResult;
