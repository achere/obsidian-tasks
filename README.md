# Obsidian task board

A kanban-style task board built from [Tasks](https://publish.obsidian.md/tasks/)
queries displayed on a Canvas. One task = one note, five status buckets, and a
dropdown that filters every bucket at once by tag.

No proprietary format: every task is a plain checkbox line in a plain note, and
the board is six saved searches.

## Requirements

- Obsidian **1.13.1+** (Meta Bind's minimum)
- Core plugins on: **Canvas**, **Templates**, **Properties**

Tasks 8.4.0, Meta Bind 1.5.1 and QuickAdd 2.27.0 are bundled in
`.obsidian/plugins/`, so there's nothing to download.

## Use it as its own vault

1. Open this folder as a vault.
2. Obsidian asks whether to trust the author and enable plugins — say yes. Both
   plugins and the CSS snippet are already enabled in the vault config, so
   that's the only prompt.
3. Open `Board.canvas`.

If you decline that prompt the vault stays in Restricted mode and the board
renders as plain code blocks with literal `INPUT[...]` text. Fix: Settings →
Community plugins → **Turn on community plugins**, then toggle **Tasks** and
**Meta Bind** on.

## Or merge it into an existing vault

1. Install and enable both community plugins there, if they aren't already.
2. **Quit Obsidian.** Settings live in JSON files the app rewrites from memory
   on exit, so copying into a running vault gets your changes overwritten.
3. Copy `Board.canvas`, `tasks/`, and the contents of `.obsidian/` in,
   overwriting when asked. Two of these are whole-file settings, so check them
   if the vault already had opinions:
   - `.obsidian/templates.json` — sets the template folder to `tasks/_templates`
   - `.obsidian/plugins/obsidian-tasks-plugin/data.json` — **all** Tasks
     settings, not only the ones this board needs. If that vault already uses
     Tasks, merge rather than overwrite: you want `statusSettings`,
     `globalFilter`, `globalQuery` and `removeGlobalFilter`.
4. Start Obsidian and enable the snippet: Settings → Appearance → CSS snippets →
   `tasks-board`.

Worth a look before you start: `tasks/Task system.md` explains how the pieces
fit, and it's written to stay in the vault as documentation.

## What's here

```
Board.canvas                     the board — six cards, each embedding one
                                 section of tasks/Board.md
tasks/
  Board.md                       the five queries and the filter dropdown
  Task system.md                 how it all works; keep it, it's the manual
  _templates/Task.md             new-task skeleton
  *.md                           five sample tasks — delete them
.obsidian/
  plugins/obsidian-tasks-plugin/
    data.json                    statuses, click chain, global filter + query
    main.js …                    bundled, v8.4.0
  plugins/obsidian-meta-bind-plugin/
    main.js …                    bundled, v1.5.1
  plugins/quickadd/
    data.json                    the "New task" choice
    main.js …                    bundled, v2.27.0
  hotkeys.json                   ⌘⇧T new task, ⌘⇧E edit task
  snippets/tasks-board.css       collapses the backlink to a 🔗
  templates.json                 template folder location
  types.json                     property types for the TQ_* fields
```

## Creating tasks

`⌘⇧T` prompts for a title and creates `tasks/<title>.md` from the template,
task line already written. `⌘⇧E` opens the Tasks modal for priority and dates.

`⌘⇧T` overrides Obsidian's *Undo close tab*; rebind it in Settings → Hotkeys if
you'd rather keep that.

Tasks written anywhere else in the vault still reach the board, as long as the
line carries `#task`.

## Statuses

| Symbol | Name | Click advances to |
|---|---|---|
| `[ ]` | Backlog | Up Next |
| `[>]` | Up Next | In Progress |
| `[/]` | In Progress | Done |
| `[!]` | Blocked | nothing — deliberate both ways |
| `[x]` | Done | Backlog |
| `[-]` | Cancelled | Backlog |

## Adapting it

The sample tags are `#code`, `#tech`, `#process`. To use your own, edit the
`option(...)` list on the line under `# Filter` in `tasks/Board.md`:

```
option(tags include #yourtag, yourtag)
```

The value is a literal Tasks instruction, so anything Tasks understands works
— `due before in two weeks`, `priority is above medium`.

## Known constraint

Queries have to live in a real note that the canvas embeds — a `tasks` code
block typed straight into a canvas *text card* has no file path, so
`query.file.*` and the `TQ_*` frontmatter resolve to nothing and the query
fails ([obsidian-tasks#2971](https://github.com/obsidian-tasks-group/obsidian-tasks/issues/2971)).
That's why `Board.canvas` holds only geometry and every card points at a
section of `tasks/Board.md`.

Obsidian's canvas also leaves itself stuck panning after a context menu closes,
so prefer the ✏️ button over right-click when you're on the board.
