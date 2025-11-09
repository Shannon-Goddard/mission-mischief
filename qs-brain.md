# Amazon Q Troubleshooting and Context Management Guide

This document summarizes our conversation regarding efficient troubleshooting of the "Mission Mischief" project using Amazon Q in VS Code, focusing on achieving deep, persistent project context.

---

## 1. Achieving Deep Project Context ("Part of the Water Source")

The goal is to make Amazon Q an intrinsic, permanent part of the project's knowledge.

### Automatic and Persistent Context (.amazonq/rules)

To ensure Amazon Q automatically reads your project architecture file without manual prompting, place it in a designated folder:

1.  In the **root directory** of your project, create a hidden folder named: **`.amazonq`**
2.  Inside `.amazonq`, create a folder named: **`rules`**
3.  Place your architectural Markdown file (e.g., `MissionMischief_Flow.md`) into the **`.amazonq/rules`** folder.

**Result:** Amazon Q will automatically reference this file for every prompt in the workspace, making the architectural knowledge permanent.

---

## 2. Managing Long Conversations and Detail Preservation

To avoid losing valuable details during chat compaction, use these methods:

* **Proactive Compaction:** Before the chat gets too full, ask Q to generate a **detailed summary** of the session's findings. Then, use the `/compact` command. Q will use the high-quality, generated summary as the persistent context.
* **Export and Pin:** Use the **Export** feature in the Amazon Q chat panel to save the full history as a Markdown or HTML file. In a new session, use the context picker (`@`) to **pin** this file, making the full conversation history available as read-only context.

---

## 3. Structured Data for Troubleshooting

To significantly improve Amazon Q's analysis, organize troubleshooting data into a clear structure (e.g., for a session named `Troubleshooting_Scrape_Issue_20251109`):

| Folder/File | Purpose | Benefit for Amazon Q |
| :--- | :--- | :--- |
| **`01_Initial_State/`** | Stores the initial, broken state files and logs *before* changes. | Establishes a **clear baseline** for the error. |
| **`02_Changes_Made/`** | Contains the chronological record of changes attempted. | Provides a **diff history** so Q avoids suggesting previous failed fixes. |
| `02_Changes_Made/changes_log.md` | Markdown file detailing: **Timestamp, Files Modified, Rationale, and Result.** | (See template below) |
| **`03_Final_State/`** | Stores the working code and correct output once the fix is implemented. | Shows Q the **target state** and verifies the solution. |

---

## 4. `changes_log.md` Template

This template ensures consistency when documenting troubleshooting attempts:

```markdown
# 🛠️ Mission Mischief - Scraper Troubleshooting Session Log
**Date:** [YYYY-MM-DD]
**Problem Statement:** [A concise restatement of the core issue for this session.]

## Attempts Log

### Attempt 1
**Timestamp:** [HH:MM]
**Files Modified:** [List files and line numbers, e.g., parser.py (Lines 42-45)]
**Rationale for Change:** [Why was this specific change made?]
**Result:** [**FAIL**, **PARTIAL SUCCESS**, or **SUCCESS** with a brief description of the outcome.]
**Amazon Q Input:** [What question did you ask Q related to this attempt?]

### Attempt 2
... (Continue for all attempts)

### Final Fix (Attempt X)
**Timestamp:** [HH:MM]
**Files Modified:** [The files that contained the final, working code.]
**Rationale for Change:** [Briefly describe the final, working change.]
**Result:** **SUCCESS**. [Confirm the desired outcome.]

## 🔑 Key Learnings & Takeaways
* [Document any necessary updates to the core architecture or new understanding.]