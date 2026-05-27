import Link from "next/link";

type AppFrameProps = {
  active: "log" | "revision";
  children: React.ReactNode;
};

export function AppFrame({ active, children }: AppFrameProps) {
  return (
    <main className="shell">
      <div className="topbar">
        <div className="brand">
          <div className="brand-mark">R</div>
          <div>
            <h1>Recall</h1>
            <p>Practice the idea before rereading the answer.</p>
          </div>
        </div>
        <nav className="nav" aria-label="Primary navigation">
          <Link className={active === "log" ? "active" : ""} href="/log">
            Log Question
          </Link>
          <Link className={active === "revision" ? "active" : ""} href="/revision">
            Revision
          </Link>
        </nav>
      </div>
      {children}
    </main>
  );
}
