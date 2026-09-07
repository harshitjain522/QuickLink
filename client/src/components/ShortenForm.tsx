import type { FormEvent, KeyboardEvent } from "react";

interface ShortenFormProps {
    longUrl: string;
    onLongUrlChange: (value: string) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    loading: boolean;
}

function ShortenForm({
    longUrl,
    onLongUrlChange,
    onSubmit,
    loading,
}: ShortenFormProps) {
    const length = longUrl.trim().length;

    // A textarea wraps long URLs instead of hiding them, so Enter has to submit.
    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            event.currentTarget.form?.requestSubmit();
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <label htmlFor="url-input" className="sr-only">
                Long URL
            </label>
            <div className="border-b-2 border-rule pb-3 transition-colors focus-within:border-link">
                <textarea
                    id="url-input"
                    rows={2}
                    value={longUrl}
                    onChange={(event) => onLongUrlChange(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="https://example.com/2026/quarterly-report/final-v3.pdf?utm_source=newsletter"
                    autoComplete="off"
                    spellCheck={false}
                    className="block max-h-[40vh] w-full resize-none bg-transparent font-mono text-[1.0625rem] leading-[1.7] text-ink outline-none [field-sizing:content] placeholder:text-faint"
                />
            </div>

            <div className="mt-4 flex items-center justify-between gap-6">
                <span className="font-mono text-xs text-mute">
                    {length > 0 ? `${length} characters` : ""}
                </span>
                <button
                    type="submit"
                    disabled={loading || length === 0}
                    className="h-10 shrink-0 rounded-md bg-ink px-5 text-sm font-medium text-paper transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-30"
                >
                    {loading ? "Shortening" : "Shorten"}
                </button>
            </div>
        </form>
    );
}

export default ShortenForm;
