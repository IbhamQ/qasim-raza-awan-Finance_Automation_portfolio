# Restore point before the ThreeUI-inspired redesign

Backup branch: `backup/pre-threeui-redesign-2026-11-09`

Saved commit: `9fa43c55518ec80fd146d1982dc858b3cbfa1acb`

This captures the repository source, demos and tracked assets for both websites before this redesign. It does not back up Vercel account settings, environment variables or external services.

To restore: create a new commit on the current main branch using the saved commit’s tree (`3f1cbb3b6070dd4e76840f38de6faa7dcd0c47cc`) and the current main commit as its parent, then advance main with an expected-head check. The normal Vercel integration deploys that source state. Do not force-push or reset shared history. Verify the production deployment is READY and check both pages.

The backup branch must remain unchanged.
