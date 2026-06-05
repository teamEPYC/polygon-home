<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Git Workflow

**Never commit directly to `master` or `main`.** All work happens on feature branches → PR → merge.

1. **Working branch:** Always start from `dev/aayush` (or a feature branch cut from it)
2. **Feature branches:** `git checkout -b feature/<name>` from `dev/aayush`
3. **When done:** Push the feature branch, open a PR to `master`
4. **Merge:** Only after the user reviews and approves the PR output
5. **Never force-push** to `master` or `dev/aayush`

If you are unsure which branch to use, ask before committing.
