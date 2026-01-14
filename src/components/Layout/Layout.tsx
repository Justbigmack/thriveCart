import { PropsWithChildren } from "react";

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Acme Widget Co</h1>
          <p className="text-muted-foreground">
            Leading provider of made up widgets
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-1">{children}</main>

      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>© 2026 Acme Widget Co. Technical Assessment Implementation</p>
        </div>
      </footer>
    </div>
  );
};
