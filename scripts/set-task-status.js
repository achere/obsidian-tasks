// QuickAdd macro script: pick a status for the task in the active note.
// Mirrors statusSettings in obsidian-tasks-plugin/data.json — keep in sync.
const STATUSES = [
  { name: "Backlog", symbol: " " },
  { name: "Up Next", symbol: ">" },
  { name: "In Progress", symbol: "/" },
  { name: "Blocked", symbol: "!" },
  { name: "Done", symbol: "x", stamp: "✅" },
  { name: "Cancelled", symbol: "-", stamp: "❌" },
];

const TASK_LINE = /^(\s*[-*+] \[)(.)(\] .*#task\b.*)$/;
const STAMPS = /\s*[✅❌]\s*\d{4}-\d{2}-\d{2}/g;

module.exports = async (params) => {
  const { app, quickAddApi } = params;
  const file = app.workspace.getActiveFile();
  if (!file || file.extension !== "md") return new Notice("No active note.");

  const text = await app.vault.read(file);
  const line = text.split("\n").findIndex((l) => TASK_LINE.test(l));
  if (line < 0) return new Notice("No #task line in this note.");

  const current = TASK_LINE.exec(text.split("\n")[line])[2];
  const picked = await quickAddApi.suggester(
    STATUSES.map((s) => `${s.name}${s.symbol === current ? "  (current)" : ""}`),
    STATUSES,
  );
  if (!picked) return;

  await app.vault.process(file, (data) => {
    const lines = data.split("\n");
    const m = TASK_LINE.exec(lines[line]);
    if (!m) return data; // note changed under us
    // Tasks stamps done/cancelled dates itself; do the same, and drop them on reopen.
    let rest = m[3].replace(STAMPS, "");
    if (picked.stamp) rest += ` ${picked.stamp} ${window.moment().format("YYYY-MM-DD")}`;
    lines[line] = `${m[1]}${picked.symbol}${rest}`;
    return lines.join("\n");
  });
};
