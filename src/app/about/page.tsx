import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <nav
        className="sticky top-0 z-10 border-b border-[var(--glass-border)] px-6 py-4"
        style={{ background: "rgba(7,0,15,0.92)", backdropFilter: "blur(16px)" }}
      >
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link
            href="/"
            className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
          >
            ←
          </Link>
          <h1 className="text-lg font-bold text-white">About LiftOff</h1>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-10 space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-white mb-3">
            Learn by doing, not just reading
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
            LiftOff is built on a simple idea: you learn APIs best by working with them.
            Reading docs is useful, but actually building something is what makes it stick.{" "}
            <a
              href="https://www.pnas.org/doi/10.1073/pnas.1319030111"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--orange)] hover:underline"
            >
              The research backs this up
            </a>
            .
          </p>
        </section>

        <div className="section-divider" />

        <section>
          <h2 className="text-2xl font-bold text-white mb-3">
            How validation works
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
            Every step you complete in Postman is verified in real time using the{" "}
            <a
              href="https://www.postman.com/postman/postman-public-workspace/documentation/12946167/postman-api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--orange)] hover:underline"
            >
              Postman API
            </a>
            . When you click <strong className="text-white">Validate</strong>, LiftOff checks your
            Postman account to confirm you actually did the work — created the workspace, forked the
            collection, set the environment variables, wrote the scripts.
          </p>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
            This isn&apos;t a quiz. There are no multiple-choice questions. You build real things in
            Postman and LiftOff confirms they exist and are configured correctly. Points are awarded
            only when the API confirms your work.
          </p>

          <div className="glass-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">
              What we validate
            </h3>
            <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--green)] mt-0.5">✓</span>
                <span>Workspaces, collections, and environments exist with the right names and settings</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--green)] mt-0.5">✓</span>
                <span>Environment variables are set to the correct values (and marked sensitive when required)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--green)] mt-0.5">✓</span>
                <span>Post-response scripts exist on the right requests and reference the expected variables</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--green)] mt-0.5">✓</span>
                <span>Request URLs use collection variables instead of hardcoded values</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--green)] mt-0.5">✓</span>
                <span>Test scripts are present on all requests in a collection</span>
              </li>
            </ul>
          </div>
        </section>

        <div className="section-divider" />

        <section>
          <h2 className="text-2xl font-bold text-white mb-3">
            Steps marked &ldquo;Done&rdquo;
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
            Some steps involve tools or processes that run locally on your machine — like
            configuring an MCP server in Claude Code, running a CLI command, or verifying a
            connection in your terminal. The Postman API can&apos;t see your local environment,
            so these steps can&apos;t be validated automatically.
          </p>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            For these steps, the button says <strong className="text-white">Done</strong> instead
            of Validate. Clicking it marks the step complete on the honor system. We trust you
            did the work — and the skills you build in those steps are just as important as the
            ones we can verify.
          </p>
        </section>

        <div className="section-divider" />

        <section>
          <h2 className="text-2xl font-bold text-white mb-3">
            Open source
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
            LiftOff is built and maintained by the{" "}
            <a
              href="https://www.postman.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--orange)] hover:underline"
            >
              Postman
            </a>{" "}
            Developer Relations team. The source code is available on{" "}
            <a
              href="https://github.com/Postman-Devrel/liftoff"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--orange)] hover:underline"
            >
              GitHub
            </a>
            .
          </p>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Want to contribute a module? Check out the{" "}
            <a
              href="https://github.com/Postman-Devrel/liftoff/blob/main/docs/creating-a-module.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--orange)] hover:underline"
            >
              module creation guide
            </a>{" "}
            and open a PR. We welcome new learning content, feedback, and ideas.
          </p>
        </section>

        <p className="text-xs text-[var(--text-tertiary)] text-center pt-4">
          Originally created by{" "}
          <a
            href="https://github.com/quintonwall"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text-secondary)] hover:text-white transition-colors"
          >
            @quintonwall
          </a>
        </p>
      </main>
    </div>
  );
}
