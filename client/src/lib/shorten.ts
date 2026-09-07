const API_BASE = import.meta.env.VITE_API_URL ?? "";

export const isUrlValid = (value: string): boolean => {
    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
};

export const shortenUrl = async (longUrl: string): Promise<string> => {
    const response = await fetch(`${API_BASE}/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ longUrl }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data?.error || "Unable to shorten URL.");
    }

    return data.shortUrl;
};
