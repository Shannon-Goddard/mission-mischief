# 🧠 Mission Mischief - Amazon Q Troubleshooting Directory

## Purpose
This directory contains structured troubleshooting sessions following the Q's Brain framework for systematic problem-solving and context preservation.

## Directory Structure
```
troubleshooting/
├── [YYYYMMDD]_[issue_name]/          # Individual troubleshooting sessions
│   ├── 01_initial_state/             # Files/logs before changes
│   ├── 02_changes_made/              # Chronological change attempts
│   │   └── changes_log.md            # Detailed attempt log
│   └── 03_final_state/               # Working solution files
├── templates/                        # Reusable templates
└── README.md                         # This file
```

## Usage Guidelines

### Starting a New Session
1. Create folder: `[YYYYMMDD]_[descriptive_issue_name]`
2. Copy initial broken files to `01_initial_state/`
3. Use `templates/changes_log_template.md` in `02_changes_made/`
4. Document every attempt with timestamps and rationale

### Amazon Q Integration
- Reference `.amazonq/rules/` files for automatic context
- Use structured data format for clear problem analysis
- Follow page-specific troubleshooting rules
- Validate against success criteria after fixes

### Best Practices
- **One Issue Per Session**: Keep sessions focused on single problems
- **Preserve Context**: Save all relevant files and logs
- **Document Rationale**: Explain why each change was attempted
- **Test Thoroughly**: Validate fixes before marking as final
- **Learn and Update**: Update framework based on new insights

## Current Active Issues
- None (system stable as of last update)

## Completed Sessions
- [List will be populated as sessions are completed]

---
*This system ensures Amazon Q maintains deep project context and systematic troubleshooting approach across all Mission Mischief development.*