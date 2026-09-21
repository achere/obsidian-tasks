# Task system

How tasks work in this vault. One task = one note; the board is a canvas of
saved queries. Nothing is stored in a proprietary format — every task is a
plain checkbox line in a plain note.

## Where things live

```
Board.canvas            the board — open this
tasks/
  Board.md              the five queries and the filter widget
  Task system.md        this note
  _templates/Task.md    new-task skeleton
  <one note per task>
```

The canvas sits at the vault root because it's the daily entry point; the
machinery behind it stays in `tasks/`. Canvas cards reference notes by
vault-absolute path, so the two can be moved independently — but if you move
`Board.md`, update the six `file` entries in `Board.canvas` and the two path
exclusions in Tasks' global query.

## Statuses

| Symbol | Name | Tasks type | Clicking the checkbox |
|---|---|---|---|
| `[ ]` | Backlog | TODO | → Up Next |
| `[>]` | Up Next | TODO | → In Progress |
| `[/]` | In Progress | IN_PROGRESS | → Done |
| `[!]` | Blocked | TODO | → nothing |
| `[x]` | Done | DONE | → Backlog |
| `[-]` | Cancelled | CANCELLED | → Backlog |

Clicking a checkbox moves the task one bucket to the right. Blocked is off the
chain deliberately: clicking a blocked task does nothing, so you can't
accidentally unblock something by clicking it. Getting into and out of Blocked
is always a deliberate act — the ✏️ button on the task row, or right-click in
`Board.md`.

To jump anywhere (straight to Done, or into Blocked), use the **✏️ edit
button** on the task row: it opens a modal with a Status dropdown, plus
priority and dates. Prefer it to right-clicking *on the canvas* — Obsidian's
canvas leaves itself stuck panning after a context menu closes. Right-click
behaves normally inside `Board.md` itself.

Blocked is an explicit status, not derived from task dependencies. If you
later want real dependency tracking, Tasks supports `⛔ blocked by` / `🆔 id`
and an `is blocked` filter — that would be an addition to the Blocked bucket
query, not a replacement.

## Creating a task

1. New note in `tasks/`, named after the task.
2. `Templates: Insert template` → `Task`.
3. `Tasks: Create or edit task` on the first line to set priority and dates
   through the modal.

The note that comes out:

```markdown
- [ ] #task Migrate DNS to Cloudflare ⏫ 📅 2026-10-02 #ops

## Checklist

- [ ] Export current zone file
- [ ] Lower TTLs

## Notes

Registrar 2FA is on the old phone…
```

The `#task` tag is the plugin's global filter: only lines carrying it are
tasks. That is what keeps the checklist below from showing up on the board as
five loose tasks. Don't drop it — but you won't see it either. *Remove global
filter from description* is on, so Tasks strips it from the description it
renders in search results and shows in the edit modal. It stays in the file,
and it still shows if you read the task's own note.

Priority emoji, highest to lowest: 🔺 ⏫ 🔼 (none) 🔽 ⏬.
Dates: 🛫 start, ⏳ scheduled, 📅 due, ✅ done.

Tasks written anywhere else in the vault still appear on the board as long as
they carry `#task` — the `tasks/` folder is a convention, not a boundary.

## The board

`tasks/Board.md` holds all five queries under five headings. `Board.canvas`,
at the vault root, shows six cards, each embedding **one section** of that note (`#Backlog`,
`#Up Next`, …). Editing a bucket means editing `Board.md`.

The buckets match on status name with an anchored regex
(`status.name regex matches /^Backlog$/`) rather than `filter by function`,
because Tasks 8 disables JavaScript in queries by default and this design
doesn't need it. If you rename a status, update the matching regex. Should you
ever want function filters, the toggle is Tasks → Settings → enable JavaScript
— read the plugin's *JavaScript in Tasks Queries* page first.

The one non-obvious constraint: queries must live in a real `.md` file that
the canvas embeds. A `tasks` code block typed directly into a canvas text card
gets no file path, so `query.file.*` and the frontmatter below resolve to
nothing and the query fails — [obsidian-tasks#2971](https://github.com/obsidian-tasks-group/obsidian-tasks/issues/2971).
Section embeds were tested and do resolve correctly.

Card colours are cosmetic: Up Next cyan, In Progress yellow, Blocked red,
Done green.

## The filter

The dropdown on the top card writes to the `TQ_extra_instructions` property of
`Board.md`. Tasks prepends that property to *every* query in the file, so one
dropdown refilters all five buckets at once. It's a Tasks feature
([Query File Defaults](https://publish.obsidian.md/tasks/Queries/Query+File+Defaults)),
not a hack, and the widget is Meta Bind.

To add a tag to the dropdown, add another `option(...)` to the line under
`# Filter` in `Board.md`:

```
option(tags include #newtag, newtag)
```

The value is a literal Tasks instruction, so anything Tasks understands works
— `due before in two weeks`, `priority is above medium`. You can also just
edit the property directly in Obsidian's Properties panel; the dropdown is a
convenience, not a dependency.

The other frontmatter on `Board.md` is display settings, applied to all five
queries at once. Tasks calls these Query File Defaults. Rows show the
description, priority emoji, due date and tags; start/scheduled/created dates,
recurrence, dependencies and the postpone button are all hidden to keep rows
readable in a 360px column. The Done bucket re-enables the done date with a
`show done date` line in its own query — instructions inside a query override
the file defaults.

To show another field, flip its property (e.g. `TQ_show_scheduled_date: true`),
or add a `show scheduled date` line to just one bucket.

## The backlink icon

Each row ends with a 🔗 linking to the task's note. Tasks normally renders that
backlink as the filename in parentheses, which is pure duplication when the
filename *is* the task description — but the icon version only ships with
short mode, which also hides dates. So the CSS snippet
`.obsidian/snippets/tasks-board.css` collapses the backlink to the icon while
full mode keeps the due date visible.

It applies to every Tasks search in the vault. To limit it to canvases, prefix
each selector with `.canvas-node-content`.

## Settings this relies on

- Tasks → global filter: `#task`, with *Remove global filter from description* on
- Tasks → global query:

  ```
  path does not include tasks/_templates
  path does not include tasks/Task system
  ```

  These keep two files off the board: the template's own checkbox line, and
  the example task lines in this note. Rename either file and you must update
  this setting — it matches on path.
- Templates → folder: `tasks/_templates`
- Appearance → CSS snippets: `tasks-board` enabled
- Plugins: Tasks 8.4.0, Meta Bind 1.5.1

## Housekeeping

The five notes in `tasks/` that describe this setup are samples — delete them
once the board looks right.
