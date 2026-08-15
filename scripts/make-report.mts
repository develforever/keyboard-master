/**
 * Generator raportu sesji.
 *
 * Składa jeden samowystarczalny plik HTML: zrzuty ekranu trafiają do środka jako
 * `data:` URL, więc raport można wysłać albo otworzyć gdziekolwiek bez folderu
 * z zasobami. Wyjście ląduje w gitignorowanym `reports/` — raport jest
 * regenerowalny, nie wersjonujemy go.
 *
 * Nie parsuje markdownu w ogólności. Wyciąga ze śledzonych plików konkretne
 * struktury (wiersze tabel, nagłówki bugów, pozycje listy) — jest to odporniejsze
 * niż renderowanie dowolnego markdownu i daje czytelniejszy wynik.
 *
 * Wymaga Node ≥ 22.18 (usuwanie typów bez flagi).
 *
 * Użycie:
 *   node scripts/make-report.mts --feature F-005 --title "Stan sesji"
 *   node scripts/make-report.mts --feature F-005 --title "Stan sesji" --shots reports/.shots
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = fileURLToPath(new URL('.', import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, '..');

const MIME_BY_EXT: Readonly<Record<string, string>> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

interface CliOptions {
  readonly feature: string;
  readonly title: string;
  readonly shotsDir: string;
  readonly outDir: string;
}

interface FeatureRow {
  readonly id: string;
  readonly name: string;
  readonly status: string;
}

interface Phase {
  readonly name: string;
  readonly rows: readonly FeatureRow[];
}

interface BugEntry {
  readonly id: string;
  readonly priority: string;
  readonly title: string;
  readonly fixed: boolean;
}

interface TodoItem {
  readonly group: string;
  readonly text: string;
  readonly done: boolean;
}

interface Screenshot {
  readonly name: string;
  readonly caption: string;
  readonly dataUrl: string;
}

class ReportError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'ReportError';
  }
}

/* -------------------------------------------------------------------------- */
/* Wejście                                                                     */
/* -------------------------------------------------------------------------- */

function parseArgs(argv: readonly string[]): CliOptions {
  const values = new Map<string, string>();

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (!arg.startsWith('--')) {
      continue;
    }

    const next = argv[i + 1];

    if (next === undefined || next.startsWith('--')) {
      throw new ReportError(`Parametr ${arg} wymaga wartości.`);
    }

    values.set(arg.slice(2), next);
    i += 1;
  }

  const feature = values.get('feature');
  const title = values.get('title');

  if (!feature || !title) {
    throw new ReportError(
      'Wymagane parametry: --feature <ID> --title <tytuł>. ' +
        'Opcjonalne: --shots <katalog> --out <katalog>.',
    );
  }

  return {
    feature,
    title,
    shotsDir: resolve(REPO_ROOT, values.get('shots') ?? 'reports/.shots'),
    outDir: resolve(REPO_ROOT, values.get('out') ?? 'reports'),
  };
}

function readRepoFile(relativePath: string): string {
  const absolute = join(REPO_ROOT, relativePath);

  try {
    return readFileSync(absolute, 'utf8');
  } catch (error) {
    throw new ReportError(`Nie udało się odczytać ${relativePath}.`, { cause: error });
  }
}

/* -------------------------------------------------------------------------- */
/* Parsowanie plików śledzących                                                */
/* -------------------------------------------------------------------------- */

/** Wyciąga fazy i wiersze tabel z `features.md`. */
function parseFeatures(markdown: string): readonly Phase[] {
  const phases: Phase[] = [];
  let currentName: string | null = null;
  let currentRows: FeatureRow[] = [];

  const flush = (): void => {
    if (currentName !== null && currentRows.length > 0) {
      phases.push({ name: currentName, rows: currentRows });
    }
  };

  for (const line of markdown.split('\n')) {
    const heading = /^##\s+(.*)$/.exec(line);

    if (heading) {
      flush();
      currentName = heading[1].trim();
      currentRows = [];
      continue;
    }

    const row = /^\|\s*(F-\d+)\s*\|([^|]*)\|([^|]*)\|/.exec(line);

    if (row && currentName !== null) {
      currentRows.push({
        id: row[1],
        name: row[2].trim(),
        status: row[3].trim(),
      });
    }
  }

  flush();

  return phases;
}

/** Wyciąga wpisy z `bugs.md` wraz z informacją, czy są w sekcji naprawionych. */
function parseBugs(markdown: string): readonly BugEntry[] {
  const entries: BugEntry[] = [];
  let fixedSection = false;

  for (const line of markdown.split('\n')) {
    if (/^##\s+/.test(line)) {
      fixedSection = /naprawione/i.test(line);
      continue;
    }

    const match = /^###\s+(B-\d+)\s*·\s*(P\d)\s*·\s*(.+?)\s*$/.exec(line);

    if (match) {
      entries.push({
        id: match[1],
        priority: match[2],
        title: match[3].replace(/—\s*✅.*$/, '').trim(),
        fixed: fixedSection,
      });
    }
  }

  return entries;
}

/** Wyciąga pozycje list zadań z `todo.md` wraz z nagłówkiem grupującym. */
function parseTodo(markdown: string): readonly TodoItem[] {
  const items: TodoItem[] = [];
  let group = 'Bez grupy';

  for (const line of markdown.split('\n')) {
    const heading = /^##\s+(.*)$/.exec(line);

    if (heading) {
      group = heading[1].trim();
      continue;
    }

    const item = /^\s*-\s*\[([ xX])\]\s*(.+)$/.exec(line);

    if (item) {
      items.push({
        group,
        text: item[2].trim(),
        done: item[1].toLowerCase() === 'x',
      });
    }
  }

  return items;
}

/** Wyciąga pierwszy blok kodu z `docs/NEXT-SESSION.md` — prompt na następną sesję. */
function parseNextPrompt(markdown: string): string {
  const match = /```[a-z]*\n([\s\S]*?)```/.exec(markdown);

  return match ? match[1].trim() : '';
}

/* -------------------------------------------------------------------------- */
/* Git i zrzuty ekranu                                                         */
/* -------------------------------------------------------------------------- */

function git(args: readonly string[]): string {
  try {
    return execFileSync('git', [...args], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      // stderr wyciszone: brak repo albo brak origin/main to obsłużone przypadki,
      // a nie awaria — komunikaty gita tylko zaśmiecałyby wyjście.
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    // Brak gita, brak repo albo brak zdalnej gałęzi — raport ma powstać mimo to.
    return '';
  }
}

function currentBranch(): string {
  return git(['rev-parse', '--abbrev-ref', 'HEAD']) || 'nieznana';
}

/**
 * Commity gałęzi względem `origin/main`. Gdy zdalna gałąź nie istnieje,
 * spada na ostatnie 20 commitów.
 */
function branchCommits(): readonly string[] {
  const scoped = git(['log', '--oneline', '--no-decorate', 'origin/main..HEAD']);
  const output = scoped || git(['log', '--oneline', '--no-decorate', '-20']);

  return output ? output.split('\n') : [];
}

/**
 * Wczytuje zrzuty ekranu i wkleja je jako `data:` URL. Podpis pochodzi
 * z pliku `.txt` o tej samej nazwie bazowej, a gdy go nie ma — z nazwy pliku.
 */
function loadScreenshots(shotsDir: string): readonly Screenshot[] {
  if (!existsSync(shotsDir)) {
    return [];
  }

  const shots: Screenshot[] = [];

  for (const entry of readdirSync(shotsDir).sort()) {
    const ext = extname(entry).toLowerCase();
    const mime = MIME_BY_EXT[ext];

    if (!mime) {
      continue;
    }

    const stem = basename(entry, ext);
    const captionPath = join(shotsDir, `${stem}.txt`);

    let caption = stem.replace(/[-_]+/g, ' ');

    if (existsSync(captionPath)) {
      try {
        caption = readFileSync(captionPath, 'utf8').trim() || caption;
      } catch {
        // Podpis jest opcjonalny — brak dostępu do pliku nie przerywa raportu.
      }
    }

    try {
      const bytes = readFileSync(join(shotsDir, entry));
      shots.push({
        name: entry,
        caption,
        dataUrl: `data:${mime};base64,${bytes.toString('base64')}`,
      });
    } catch (error) {
      throw new ReportError(`Nie udało się wczytać zrzutu ${entry}.`, { cause: error });
    }
  }

  return shots;
}

/* -------------------------------------------------------------------------- */
/* Render                                                                      */
/* -------------------------------------------------------------------------- */

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function slugify(value: string): string {
  const from = 'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ';
  const to = 'acelnoszzACELNOSZZ';

  const transliterated = [...value]
    .map((char) => {
      const index = from.indexOf(char);
      return index === -1 ? char : to[index];
    })
    .join('');

  return (
    transliterated
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'raport'
  );
}

function statusClass(status: string): string {
  if (/gotowe/i.test(status)) return 'ok';
  if (/w toku/i.test(status)) return 'wip';
  return 'todo';
}

function renderHtml(options: {
  readonly cli: CliOptions;
  readonly date: string;
  readonly branch: string;
  readonly phases: readonly Phase[];
  readonly bugs: readonly BugEntry[];
  readonly todo: readonly TodoItem[];
  readonly commits: readonly string[];
  readonly shots: readonly Screenshot[];
  readonly prompt: string;
}): string {
  const { cli, date, branch, phases, bugs, todo, commits, shots, prompt } = options;

  const openBugs = bugs.filter((bug) => !bug.fixed);
  const fixedBugs = bugs.filter((bug) => bug.fixed);
  const doneTodo = todo.filter((item) => item.done).length;

  const todoGroups = [...new Set(todo.map((item) => item.group))];

  return `<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Raport ${escapeHtml(cli.feature)} — ${escapeHtml(cli.title)}</title>
<style>
  :root {
    color-scheme: dark;
    --bg: #0e0e11;
    --panel: #17171c;
    --line: #26262e;
    --text: #e6e6ea;
    --muted: #8f8f9a;
    --accent: #3b82f6;
    --ok: #34d399;
    --wip: #fbbf24;
    --err: #f87171;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 32px 20px 80px;
    background: var(--bg);
    color: var(--text);
    font: 15px/1.6 ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  }
  .wrap { max-width: 940px; margin: 0 auto; }
  header { border-bottom: 1px solid var(--line); padding-bottom: 20px; margin-bottom: 28px; }
  h1 { margin: 0 0 6px; font-size: 26px; letter-spacing: -0.02em; }
  h2 { margin: 36px 0 14px; font-size: 17px; letter-spacing: -0.01em; }
  h3 { margin: 22px 0 10px; font-size: 14px; color: var(--muted); font-weight: 600; }
  .meta { color: var(--muted); font-size: 13px; }
  .meta code { color: var(--text); }
  .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin: 24px 0; }
  .card { background: var(--panel); border: 1px solid var(--line); border-radius: 10px; padding: 14px 16px; }
  .card .n { font-size: 24px; font-weight: 650; letter-spacing: -0.02em; }
  .card .l { color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
  table { width: 100%; border-collapse: collapse; margin: 10px 0 4px; font-size: 14px; }
  th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid var(--line); vertical-align: top; }
  th { color: var(--muted); font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
  td.id { font-family: ui-monospace, "Cascadia Code", monospace; color: var(--accent); white-space: nowrap; }
  .tag { display: inline-block; padding: 1px 8px; border-radius: 999px; font-size: 12px; border: 1px solid var(--line); }
  .tag.ok { color: var(--ok); border-color: #1f5c47; }
  .tag.wip { color: var(--wip); border-color: #6b5119; }
  .tag.todo { color: var(--muted); }
  .tag.p1 { color: var(--err); border-color: #6b2626; }
  .tag.p2 { color: var(--wip); border-color: #6b5119; }
  .tag.p3 { color: var(--muted); }
  ul.checks { list-style: none; padding: 0; margin: 6px 0; }
  ul.checks li { padding: 3px 0 3px 24px; position: relative; }
  ul.checks li::before { content: '☐'; position: absolute; left: 0; color: var(--muted); }
  ul.checks li.done { color: var(--muted); text-decoration: line-through; }
  ul.checks li.done::before { content: '☑'; color: var(--ok); text-decoration: none; }
  figure { margin: 0 0 22px; }
  figure img { width: 100%; border: 1px solid var(--line); border-radius: 10px; display: block; background: #000; }
  figcaption { color: var(--muted); font-size: 13px; padding-top: 8px; }
  pre {
    background: var(--panel); border: 1px solid var(--line); border-radius: 10px;
    padding: 14px 16px; overflow-x: auto; font-size: 13px; line-height: 1.55;
    font-family: ui-monospace, "Cascadia Code", monospace; white-space: pre-wrap;
  }
  .commits { font-family: ui-monospace, "Cascadia Code", monospace; font-size: 13px; }
  .commits li { padding: 2px 0; }
  .empty { color: var(--muted); font-style: italic; }
  footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid var(--line); color: var(--muted); font-size: 12px; }
</style>
</head>
<body>
<div class="wrap">

<header>
  <h1>${escapeHtml(cli.feature)} — ${escapeHtml(cli.title)}</h1>
  <p class="meta">Keyboard Master · ${escapeHtml(date)} · gałąź <code>${escapeHtml(branch)}</code></p>
</header>

<div class="cards">
  <div class="card"><div class="n">${doneTodo}/${todo.length}</div><div class="l">Kroki fazy</div></div>
  <div class="card"><div class="n">${commits.length}</div><div class="l">Commity</div></div>
  <div class="card"><div class="n">${openBugs.length}</div><div class="l">Otwarte bugi</div></div>
  <div class="card"><div class="n">${fixedBugs.length}</div><div class="l">Naprawione</div></div>
  <div class="card"><div class="n">${shots.length}</div><div class="l">Zrzuty</div></div>
</div>

<h2>Zrzuty ekranu</h2>
${
  shots.length === 0
    ? '<p class="empty">Brak zrzutów. Wrzuć pliki PNG do katalogu zrzutów i wygeneruj raport ponownie.</p>'
    : shots
        .map(
          (shot) => `<figure>
  <img src="${shot.dataUrl}" alt="${escapeHtml(shot.caption)}">
  <figcaption>${escapeHtml(shot.caption)}</figcaption>
</figure>`,
        )
        .join('\n')
}

<h2>Postęp fazy</h2>
${todoGroups
  .map(
    (group) => `<h3>${escapeHtml(group)}</h3>
<ul class="checks">
${todo
  .filter((item) => item.group === group)
  .map((item) => `  <li class="${item.done ? 'done' : ''}">${escapeHtml(item.text)}</li>`)
  .join('\n')}
</ul>`,
  )
  .join('\n')}

<h2>Roadmapa</h2>
${phases
  .map(
    (phase) => `<h3>${escapeHtml(phase.name)}</h3>
<table>
  <thead><tr><th>ID</th><th>Ficzer</th><th>Status</th></tr></thead>
  <tbody>
${phase.rows
  .map(
    (row) => `    <tr>
      <td class="id">${escapeHtml(row.id)}</td>
      <td>${escapeHtml(row.name)}</td>
      <td><span class="tag ${statusClass(row.status)}">${escapeHtml(row.status)}</span></td>
    </tr>`,
  )
  .join('\n')}
  </tbody>
</table>`,
  )
  .join('\n')}

<h2>Bugi otwarte</h2>
${
  openBugs.length === 0
    ? '<p class="empty">Brak otwartych bugów.</p>'
    : `<table>
  <thead><tr><th>ID</th><th>Priorytet</th><th>Opis</th></tr></thead>
  <tbody>
${openBugs
  .map(
    (bug) => `    <tr>
      <td class="id">${escapeHtml(bug.id)}</td>
      <td><span class="tag ${bug.priority.toLowerCase()}">${escapeHtml(bug.priority)}</span></td>
      <td>${escapeHtml(bug.title)}</td>
    </tr>`,
  )
  .join('\n')}
  </tbody>
</table>`
}

<h2>Commity gałęzi</h2>
${
  commits.length === 0
    ? '<p class="empty">Brak commitów względem origin/main.</p>'
    : `<ul class="commits">
${commits.map((line) => `  <li>${escapeHtml(line)}</li>`).join('\n')}
</ul>`
}

<h2>Prompt na następną sesję</h2>
${
  prompt.length === 0
    ? '<p class="empty">Brak promptu — uzupełnij docs/NEXT-SESSION.md.</p>'
    : `<pre>${escapeHtml(prompt)}</pre>`
}

<footer>
  Wygenerowane przez <code>scripts/make-report.mts</code>. Plik jest samowystarczalny —
  zrzuty są wklejone jako data: URL. Katalog <code>reports/</code> jest w .gitignore.
</footer>

</div>
</body>
</html>
`;
}

/* -------------------------------------------------------------------------- */
/* Główne wejście                                                              */
/* -------------------------------------------------------------------------- */

function main(): void {
  const cli = parseArgs(process.argv.slice(2));
  const date = new Date().toISOString().slice(0, 10);

  const phases = parseFeatures(readRepoFile('features.md'));
  const bugs = parseBugs(readRepoFile('bugs.md'));
  const todo = parseTodo(readRepoFile('todo.md'));
  const prompt = parseNextPrompt(readRepoFile('docs/NEXT-SESSION.md'));
  const shots = loadScreenshots(cli.shotsDir);

  const html = renderHtml({
    cli,
    date,
    branch: currentBranch(),
    phases,
    bugs,
    todo,
    commits: branchCommits(),
    shots,
    prompt,
  });

  const fileName = `raport-${date}-${cli.feature}-${slugify(cli.title)}.html`;
  const outPath = join(cli.outDir, fileName);

  try {
    mkdirSync(cli.outDir, { recursive: true });
    writeFileSync(outPath, html, 'utf8');
  } catch (error) {
    throw new ReportError(`Nie udało się zapisać raportu do ${outPath}.`, { cause: error });
  }

  const sizeKb = Math.round(Buffer.byteLength(html, 'utf8') / 1024);
  console.log(`Raport zapisany: ${outPath} (${sizeKb} kB, ${shots.length} zrzutów)`);
}

try {
  main();
} catch (error) {
  if (error instanceof ReportError) {
    console.error(`Błąd generowania raportu: ${error.message}`);

    if (error.cause instanceof Error) {
      console.error(`  Przyczyna: ${error.cause.message}`);
    }

    process.exit(1);
  }

  throw error;
}
