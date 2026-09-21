---
TQ_extra_instructions: "# no tag filter"
TQ_short_mode: false
TQ_show_postpone_button: false
TQ_show_start_date: false
TQ_show_scheduled_date: false
TQ_show_created_date: false
TQ_show_cancelled_date: false
TQ_show_done_date: false
TQ_show_recurrence_rule: false
TQ_show_on_completion: false
TQ_show_id: false
TQ_show_depends_on: false
---

# Filter

Tag: `INPUT[inlineSelect(option(# no tag filter, all), option(tags include #code, code), option(tags include #tech, tech), option(tags include #process, process)):TQ_extra_instructions]`

# Backlog

```tasks
status.name regex matches /^Backlog$/
sort by priority
sort by due
```

# Up Next

```tasks
status.name regex matches /^Up Next$/
sort by priority
sort by due
```

# In Progress

```tasks
status.name regex matches /^In Progress$/
sort by priority
sort by due
```

# Blocked

```tasks
status.name regex matches /^Blocked$/
sort by priority
sort by due
```

# Done

```tasks
status.name regex matches /^Done$/
show done date
sort by done reverse
limit 20
```

