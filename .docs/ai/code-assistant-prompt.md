## MANDATORY SYNC PROTOCOL

1. Before making changes, analyze the [.docs/1.COLLABORATION.md] [.docs/designs/architecture.md] and [.docs/designs/use_cases.md] designs of the current system.

2. Read the [.docs/ai/state/plan.md] first.

3. Update the [.docs/ai/state/plan.md] based on a [.docs/templates/__plan.md] with the updated instructions as required.

4. Analyze remaining references in the [.docs/designs/use_cases.md] and [.docs/designs/architecture.md] to ensure all use cases are corrected updated.

5. Begin implementation as plan.

6. Follow validation steps to confirm everything works.

7. Once completing a change commit your changes as defined in [.docs/1.Collaboration.md] and update the [.docs/CHANGELOG.md], using the git commit id using git log -1. and a description of the change. And the date and time.

8. Run the debugging strategies defined in the [.docs/1.Collaboration.md] to ensure the system is functioning correctly.

9. Once no errors are found, update the [.docs/ai/state/plan.md] CURRENT STATUS sections.

10. Update the documents with the changes made by altering the [.docs/designs/architecture.md] and [.docs/designs/use_cases.md] designs of the current system.

🔄 CONTINUE THE SYNC PROTOCOL UNTIL THE PLAN IS FULLY AUTOMATED.

## Recovery Commands (For Context Loss)

**MANDATORY SEQUENCE** - Execute in this exact order:

1. `read_file ./.docs/ai/state/plan.md` - **FIRST PRIORITY** - Full project plan
2. `read_file .docs/designs/use_cases.md` - **SECOND PRIORITY** - All use cases for tracking
3. `read_file ./.docs/designs/*.md` - Design documents status
4. `list_dir src/` - Implementation status
5. `get_errors ["src/"]` - Current issues

**Plan & Use Case Sync Command**: Always run after context recovery:

```
[PLAN-SYNC] Read ./.docs/ai/state/plan.md and .docs/designs/use_cases.md, cross-reference with current session state, validate milestone progress and use case completion. Update the CHANGELOG.md.
```
