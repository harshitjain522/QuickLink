function Header() {
    return (
        <header className="flex items-center gap-2 py-5 text-sm font-semibold text-slate-500 dark:text-slate-400">
            <span
                className="grid h-7 w-7 place-items-center rounded-lg bg-blue-600 text-sm text-white dark:bg-blue-500"
                aria-hidden="true"
            >
                🔗
            </span>
            URL Shortener
        </header>
    );
}

export default Header;
