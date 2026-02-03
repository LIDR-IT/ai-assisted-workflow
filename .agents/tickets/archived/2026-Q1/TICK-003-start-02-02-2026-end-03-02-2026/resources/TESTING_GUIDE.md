# TICK-003 Manual Testing Guide

**Last Updated:** 2026-02-03
**Status:** Ready for Testing
**Hooks System:** Simplified 3-Hook System (576 lines, 59% reduction)

---

## Overview

This directory contains manual testing procedures for validating the **simplified 3-hook system** across 3 supported platforms. The system includes:

1. **notify.sh** - Desktop notifications (Notification event)
2. **auto-format.sh** - Auto-format with prettier (PostToolUse/AfterTool/postToolUse)
3. **protect-secrets.sh** - Block sensitive file edits (PreToolUse/BeforeTool/preToolUse)

**Total:** 576 lines (59% reduction from 1,390 lines previously)

---

## Testing Files

### 1. `test-claude-code-manual-validation.md`

**Platform:** Claude Code CLI
**Hook Support:** ✅ Full support (ALL 3 hooks)
**Duration:** ~45-60 minutes
**Tests:** 5 comprehensive test scenarios

**Hooks Tested:**

- ✅ notify.sh (Notification event)
- ✅ auto-format.sh (PostToolUse event)
- ✅ protect-secrets.sh (PreToolUse event)

**Start here if you use:** Claude Code CLI for development

### 2. `test-cursor-manual-validation.md`

**Platform:** Cursor IDE
**Hook Support:** ⚠️ Partial support (2 of 3 hooks)
**Duration:** ~30-45 minutes
**Tests:** 5 test scenarios

**Hooks Tested:**

- ❌ notify.sh (NOT supported - Cursor lacks Notification event)
- ✅ auto-format.sh (postToolUse event)
- ✅ protect-secrets.sh (preToolUse event)

**Start here if you use:** Cursor as your primary IDE

### 3. `test-gemini-manual-validation.md`

**Platform:** Gemini CLI (Antigravity)
**Hook Support:** ✅ Full support (ALL 3 hooks)
**Duration:** ~45-60 minutes
**Tests:** 7 test scenarios + PURE JSON requirement verification

**Hooks Tested:**

- ✅ notify.sh (Notification event)
- ✅ auto-format.sh (AfterTool event)
- ✅ protect-secrets.sh (BeforeTool event)

**Start here if you use:** Gemini CLI (Antigravity)

---

## Testing Order (Recommended)

### Step 1: Claude Code (Most Complete)

Start with Claude Code because it has full support for all 3 hooks and establishes the baseline.

```bash
# Open and follow:
open resources/test-claude-code-manual-validation.md
```

**Why first?**

- Full hook system support (ALL 3 hooks)
- Most straightforward event naming (PreToolUse, PostToolUse, Notification)
- Establishes baseline for other platforms
- No platform-specific quirks

### Step 2: Cursor (Partial Support)

Test on Cursor to validate the 2 hooks that work and confirm notify.sh is excluded.

```bash
# Open and follow:
open resources/test-cursor-manual-validation.md
```

**Why second?**

- Tests 2 of 3 hooks (auto-format, protect-secrets)
- Confirms Notification event limitation
- Validates camelCase event format
- Tests Cursor-specific format (version: 1, flat structure)

### Step 3: Gemini CLI (Complete but Different)

Complete testing on Gemini CLI last, validating PURE JSON requirement.

```bash
# Open and follow:
open resources/test-gemini-manual-validation.md
```

**Why last?**

- Full support but different event names (BeforeTool, AfterTool)
- CRITICAL: PURE JSON stdout requirement
- Timeout in milliseconds (×1000)
- Benefits from lessons learned in previous tests

---

## Platform Comparison

| Feature                | Claude Code             | Cursor               | Gemini CLI              |
| ---------------------- | ----------------------- | -------------------- | ----------------------- |
| **Hooks Supported**    | 3/3 ✅                  | 2/3 ⚠️               | 3/3 ✅                  |
| **notify.sh**          | ✅ Notification         | ❌ Not supported     | ✅ Notification         |
| **auto-format.sh**     | ✅ PostToolUse          | ✅ postToolUse       | ✅ AfterTool            |
| **protect-secrets.sh** | ✅ PreToolUse           | ✅ preToolUse        | ✅ BeforeTool           |
| **Event Format**       | PascalCase              | camelCase            | PascalCase              |
| **Timeout Units**      | seconds                 | seconds              | milliseconds            |
| **Stdout**             | Normal                  | Normal               | PURE JSON ONLY          |
| **Config Location**    | `.claude/settings.json` | `.cursor/hooks.json` | `.gemini/settings.json` |

---

## Testing Checklist

### Before Starting Any Test

- [ ] Ensure you're on branch: `feature/TICK-006-ticket-enricher`
- [ ] Verify hook files exist:
  ```bash
  ls -la .agents/hooks/scripts/
  # Should see: notify.sh, auto-format.sh, protect-secrets.sh
  ```
- [ ] Verify hooks.json is valid:
  ```bash
  jq . .agents/hooks/hooks.json
  ```
- [ ] Verify prettier is installed:
  ```bash
  which prettier  # Should show path to prettier
  npm install -g prettier  # If not installed
  ```
- [ ] Have at least 60 minutes available per platform
- [ ] No critical work in progress (testing involves file operations)

### During Testing

- [ ] Follow test procedures exactly as written
- [ ] Document any unexpected behavior
- [ ] Take screenshots of outputs (especially errors)
- [ ] Note execution times for each hook
- [ ] Mark checklists as you complete tests

### After Each Platform

- [ ] Complete results summary table
- [ ] Document platform-specific issues
- [ ] Clean up test artifacts
- [ ] Update TICK-003 ticket with findings

---

## What Each Hook Validates

### Hook 1: Notification Hook (notify.sh)

**Purpose:** Desktop notifications when AI needs attention

**Platforms:**

- ✅ Claude Code (Notification event)
- ❌ Cursor (NOT supported - no Notification event)
- ✅ Gemini CLI (Notification event)

**Tests:**

- Notification appears when AI waits for input
- OS-native notification (not terminal)
- Correct title and message
- No errors or delays

**Duration:** ~5 minutes

### Hook 2: Auto-Format Hook (auto-format.sh)

**Purpose:** Automatically format files after Edit/Write operations

**Platforms:**

- ✅ Claude Code (PostToolUse event)
- ✅ Cursor (postToolUse event)
- ✅ Gemini CLI (AfterTool event)

**Tests:**

- JSON formatting works
- Markdown formatting works
- JavaScript/TypeScript formatting works
- Gracefully skips unsupported file types

**Duration:** ~15 minutes

### Hook 3: Protect Secrets Hook (protect-secrets.sh)

**Purpose:** Block edits to sensitive files before execution

**Platforms:**

- ✅ Claude Code (PreToolUse event)
- ✅ Cursor (preToolUse event)
- ✅ Gemini CLI (BeforeTool event)

**Tests:**

- .env file edits blocked
- .key and .pem file edits blocked
- Normal files allowed
- Protected directories blocked

**Duration:** ~15 minutes

### Integration Tests

**Purpose:** Verify hooks work together without conflicts

**Tests:**

- Multiple hooks on same operation
- Performance acceptable
- Error handling graceful
- Platform-specific format correct

**Duration:** ~10 minutes

---

## Expected Time Investment

| Platform        | Setup      | notify.sh  | auto-format.sh | protect-secrets.sh | Integration | Cleanup    | Total        |
| --------------- | ---------- | ---------- | -------------- | ------------------ | ----------- | ---------- | ------------ |
| **Claude Code** | 5 min      | 5 min      | 15 min         | 15 min             | 10 min      | 5 min      | **~60 min**  |
| **Cursor**      | 5 min      | N/A        | 15 min         | 15 min             | 10 min      | 5 min      | **~50 min**  |
| **Gemini CLI**  | 5 min      | 5 min      | 15 min         | 15 min             | 15 min\*    | 5 min      | **~65 min**  |
| **Total**       | **15 min** | **10 min** | **45 min**     | **45 min**         | **35 min**  | **15 min** | **~3 hours** |

\*Gemini CLI includes additional PURE JSON verification test

**Can be done in parallel if multiple testers available.**

---

## Common Issues & Solutions

### Issue: Hook doesn't execute automatically

**Symptoms:**

- No hook output after Edit/Write operations
- Files not auto-formatted
- Sensitive files not blocked

**Solutions:**

1. Check hook system is enabled in platform settings
2. Verify scripts are executable:
   ```bash
   chmod +x .agents/hooks/scripts/*.sh
   ```
3. Test manual execution:
   ```bash
   echo '{"tool_name": "Write", "tool_input": {"file_path": "test.json"}}' | \
     bash .agents/hooks/scripts/auto-format.sh
   ```
4. Verify configuration files exist:
   - Claude Code: `.claude/settings.json` should have `"hooks"` section
   - Cursor: `.cursor/hooks.json` should exist with `"version": 1`
   - Gemini CLI: `.gemini/settings.json` should have `"hooks"` section

### Issue: Permission denied errors

**Symptoms:**

- "Permission denied" when hook tries to run
- Exit code 126

**Solutions:**

```bash
# Make all scripts executable
chmod +x .agents/hooks/scripts/notify.sh
chmod +x .agents/hooks/scripts/auto-format.sh
chmod +x .agents/hooks/scripts/protect-secrets.sh
chmod +x .agents/hooks/scripts/lib/platform-detect.sh
```

### Issue: Prettier not found

**Symptoms:**

- "prettier: command not found"
- Files not being formatted

**Solutions:**

```bash
# Install prettier globally
npm install -g prettier

# Verify installation
which prettier
prettier --version
```

### Issue: Gemini CLI - Invalid JSON output

**Symptoms:**

- Hook fails on Gemini CLI
- "Invalid JSON" errors
- Works on Claude Code and Cursor

**Cause:** Gemini CLI requires PURE JSON ONLY in stdout (no text allowed)

**Solutions:**

1. Check hook scripts don't use `echo` for debug messages
2. Ensure only JSON is output to stdout
3. All text output must go to stderr: `echo "Debug" >&2`
4. Test JSON output:
   ```bash
   echo '{}' | bash script.sh | jq .
   ```

### Issue: Cursor - notify.sh not working

**Symptoms:**

- notify.sh hook doesn't trigger on Cursor
- No desktop notifications

**Cause:** Cursor does NOT support Notification events

**Solution:** This is expected behavior (not a bug)

- notify.sh only works on Claude Code and Gemini CLI
- Test notification hook on those platforms instead
- Cursor testing should focus on auto-format and protect-secrets

### Issue: Timeout errors

**Symptoms:**

- Hook times out
- "Operation timed out" message

**Configured Timeouts:**

- notify.sh: 5 seconds (Claude/Cursor) / 5000ms (Gemini)
- auto-format.sh: 30 seconds (Claude/Cursor) / 30000ms (Gemini)
- protect-secrets.sh: 10 seconds (Claude/Cursor) / 10000ms (Gemini)

**Solutions:**

1. This is expected for large files (not a bug)
2. Hook should gracefully skip formatting on timeout
3. If timeouts are frequent, check prettier performance
4. Consider excluding large files from formatting

---

## Test Data Locations

All test files created during testing:

```
# Auto-format tests
test-format.json                  # JSON formatting test
test-format.md                    # Markdown formatting test
test-format.js                    # JavaScript formatting test
test.bin                          # Unsupported file type test

# Protect-secrets tests
.env                              # Sensitive file (should be blocked)
test.key                          # Private key (should be blocked)
test.pem                          # Certificate (should be blocked)
README.md                         # Normal file (should be allowed)
config.json                       # Normal file (should be allowed)
normal.json                       # Integration test file
secrets/api-key.txt               # Protected directory test
credentials/database.json         # Protected directory test
```

**IMPORTANT:** Remember to run cleanup steps at end of each test file!

```bash
# Cleanup command (run after each platform test)
rm -f test-format.json test-format.md test-format.js test.bin
rm -f .env test.key test.pem
rm -f README.md config.json normal.json
rm -rf secrets/ credentials/
```

---

## Reporting Results

### After Completing All Tests

1. **Update TICK-003 ticket:**
   - Mark DoD checkbox: `[x] Hooks tested on Claude Code`
   - Mark DoD checkbox: `[x] Hooks tested on Cursor`
   - Mark DoD checkbox: `[x] Hooks tested on Gemini CLI`
   - Add notes section with findings

2. **Document platform-specific findings:**
   - Cursor: Confirm only 2/3 hooks work (notify.sh excluded)
   - Gemini CLI: Confirm PURE JSON requirement met
   - Claude Code: Confirm full support

3. **Run /validate-pr:**
   ```bash
   # Validate ticket is ready for PR
   /validate-pr
   ```

---

## Emergency Contacts

**If you encounter critical issues:**

1. **Blocking bugs:** Stop testing, document issue, notify team
2. **Script errors:** Check logs, try manual execution
3. **Data loss concerns:** Don't proceed, backup first
4. **Platform crashes:** Restart, check logs, report to platform team

**Always have a backup before testing:**

```bash
# Create backup branch before testing
git checkout -b backup/before-hook-testing
git push origin backup/before-hook-testing
```

---

## Success Criteria

Testing is complete and successful when:

- [ ] All 3 platforms tested (Claude Code, Cursor, Gemini CLI)
- [ ] Claude Code: ALL 3 hooks tested and working
- [ ] Cursor: 2 hooks tested and working (notify.sh correctly excluded)
- [ ] Gemini CLI: ALL 3 hooks tested and working (PURE JSON verified)
- [ ] Results documented in summary tables
- [ ] Platform-specific issues documented
- [ ] All test artifacts cleaned up
- [ ] TICK-003 ticket updated with results
- [ ] No critical blocking issues found
- [ ] Ready to proceed with `/validate-pr`

---

## System Statistics

**Current Hooks System:**

- **Total lines:** 576 (vs 1,390 before) = 59% reduction
- **Plat support:** 3 (Claude Code, Gemini CLI, Cursor\*)
- **Hooks:** 3 simple, practical hooks
- **Conversors:** 2 (Gemini, Cursor)

\*Cursor supports 2 of 3 hooks (Notification event not supported)

---

## Next Steps After Testing

1. ✅ Complete all platform testing
2. ✅ Clean up test artifacts
3. ✅ Document results in test files
4. ✅ Update TICK-003 ticket with findings
5. ⏭️ Run `/validate-pr`
6. ⏭️ Create PR with test results
7. ⏭️ Merge after approval
8. ⏭️ Archive ticket with complete documentation

---

## Additional Resources

- **Implementation:** `.agents/hooks-readme.md` - Complete system documentation
- **Source:** `.agents/hooks/hooks.json` - Master configuration
- **Scripts:** `.agents/hooks/scripts/` - Hook implementations
- **Sync:** `.agents/hooks/sync-hooks.sh` - Platform synchronization

---

**Good luck with testing! 🚀**

If you find any issues with the testing procedures themselves, please update this guide and the individual test files.
