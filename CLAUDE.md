# CLAUDE.md

This repo is an Obsidian vault. It's a task board: one note per task, five
status buckets rendered as Canvas cards, filtered by tag. `README.md` is the
install guide, `tasks/Task system.md` is the user-facing manual — keep it in
sync with any change you make here.

## Layout

```
Board.canvas                     geometry only: 6 file nodes with subpaths
tasks/Board.md                   all 5 queries + the filter widget
tasks/Task system.md             the manual
tasks/_templates/Task.md         new-task skeleton
.obsidian/plugins/quickadd/data.json
                                 the "New task" choice (folder + template)
.obsidian/hotkeys.json           ⌥⌘T new task, ⌘⇧E edit task
.obsidian/plugins/obsidian-tasks-plugin/data.json
                                 statuses, click chain, global filter + query
```

## Constraints that are easy to break

**Queries must live in a note.** A ` ```tasks ` block typed into a canvas
*text* card has no source path, so `query.file.*` and `TQ_*` frontmatter
resolve to nothing and the query fails ([obsidian-tasks#2971]). Canvas cards
are `{"type":"file","file":"tasks/Board.md","subpath":"#Backlog"}`. Obsidian's
UI cannot set `subpath` — edit `Board.canvas` as JSON.

**No JavaScript in queries.** Tasks 8 disables it by default. Use
`status.name regex matches /^Backlog$/`, never `filter by function`. Same for
the global query.

**Heading names are an interface.** Each `# Heading` in `Board.md` must match a
`subpath` in `Board.canvas` exactly, and each bucket's regex must match a
status `name` in `data.json`. Change one, change all three.

**`TQ_*` frontmatter applies to every query in the file** (Tasks calls these
Query File Defaults). An instruction inside a single query overrides it — that
is how the Done bucket re-enables `show done date`.

**The template is QuickAdd-only now.** Its first line carries `{{VALUE:…}}`
and `{{VDATE:…}}` prompts that only QuickAdd expands, so `Templates: Insert
template` would paste them literally. `{{title}}` is the one token both
understand (QuickAdd matches `{{TITLE}}` case-insensitively) — don't "fix" it
to `{{VALUE}}`.

**The global filter is `#task`.** Only lines carrying it are tasks, which is
what keeps checklist items inside task notes off the board. The global query
excludes `tasks/_templates` and `tasks/Task system` *by path* — rename either
file and you must update it in `data.json`.

## Editing Obsidian's config

Obsidian rewrites `.obsidian/*.json` from memory. After editing one, the user
must **Cmd+R** (*Reload app without saving*) before touching related settings
in the UI, or their in-memory copy overwrites yours. Quit-and-reopen is worse
than a reload: it flushes on exit. Tell them which reload is needed.

## Verifying

You cannot run Obsidian. Validate what you can in a script — `Board.canvas`
parses as JSON, every `subpath` matches a `# Heading`, every bucket regex
matches a status name — then give the user specific things to look at, not
"does it look right". A bucket that silently renders empty is the usual
symptom of a name mismatch.

[obsidian-tasks#2971]: https://github.com/obsidian-tasks-group/obsidian-tasks/issues/2971
