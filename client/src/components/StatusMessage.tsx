import type { Status } from "../types";

interface StatusMessageProps {
    status: Status;
    message: string;
}

function StatusMessage({ status, message }: StatusMessageProps) {
    return (
        <div role="status" aria-live="polite">
            {message && (
                <p
                    className={`mt-4 font-mono text-sm ${
                        status === "error" ? "text-warn" : "text-mute"
                    }`}
                >
                    {message}
                </p>
            )}
        </div>
    );
}

export default StatusMessage;
