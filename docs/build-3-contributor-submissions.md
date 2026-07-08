# Build 3 Contributor Submissions

Build 3 makes `/contribute/[token]` fully functional for private birthday submissions while keeping admin moderation and final archive rendering out of scope.

## How Contributor Links Work

Each private link maps to one row in `contributors`.

The app validates:

- token exists
- token shape is safe
- token is not expired
- `archive_settings.contributions_open` is true
- current submission count is below `contributors.max_submissions`
- `contributors.is_used` is not already true

When the max submission count is reached, the token is marked `is_used = true`.

## Test Token

Seed data includes:

```text
test-elizabeth-invite
```

Visit:

```text
/contribute/test-elizabeth-invite
```

The seed file sets the local test invite to `max_submissions = 10` when rerun, so it is easier to test multiple form submissions locally. Production invite links can still use `max_submissions = 1`.

## Submission Storage

Successful submissions create a pending row in `birthday_submissions`:

- `contributor_id`
- `name`
- `relationship`
- `birthday_message`
- `memory`
- `one_word`
- `future_wish`
- `permission_given = true`
- `status = pending`

Nothing is approved or shown in Elizabeth's final archive during Build 3.

## Media Uploads

Files upload through the server route at:

```text
/api/contributor/submit
```

The browser never receives the Supabase service-role key.

Storage paths use:

```text
contributors/{contributor_id}/submissions/{submission_id}/photos/{filename}
contributors/{contributor_id}/submissions/{submission_id}/voice/{filename}
contributors/{contributor_id}/submissions/{submission_id}/videos/{filename}
```

Filenames are sanitized and replaced with unique server-generated names before upload.

Each uploaded object gets a pending `media_assets` row:

- `submission_id`
- `contributor_id`
- `type`
- `bucket`
- `storage_path`
- `status = pending`

## File Limits

Photos:

- allowed: jpg, jpeg, png, webp
- max size: 8MB each
- max count: 5

Voice notes:

- allowed: mp3, m4a, wav, webm
- max size: 25MB
- max count: 1

Videos:

- allowed: mp4, mov, webm
- max size: 80MB
- max count: 1

## Security Notes

- Contributor token validation happens server-side.
- Form fields are validated with Zod at runtime.
- File count, type, and size are validated before upload.
- Public users cannot list contributors, submissions, or media.
- Upload buckets remain private.
- Submitted content defaults to `pending`.
- The submit route uses the service-role key only on the server.
- The UI disables submit while sending to prevent obvious double-click duplicates.

## Testing Checklist

1. Visit `/contribute/test-elizabeth-invite` and confirm the form renders.
2. Visit `/contribute/not-a-real-token` and confirm the invalid invite screen renders.
3. Set a token `expires_at` in the past and confirm the expired screen renders.
4. Set a token `is_used = true` and confirm the already-submitted screen renders.
5. Submit empty required fields and confirm inline errors.
6. Submit without media and confirm a pending `birthday_submissions` row.
7. Submit with valid photos and confirm objects in `elizabeth-photos`.
8. Submit an invalid file type and confirm a friendly error.
9. Submit an oversized file and confirm a friendly error.
10. Confirm media rows are pending in `media_assets`.
11. Confirm `/admin` intake counts update.

## Known Limitations

- There is no admin approve/reject screen yet.
- Media previews are not shown in admin yet.
- Final Elizabeth archive rendering still uses placeholder chapter content.
- Upload progress is represented by a clear submitting state, not a byte-level progress bar.
- Large uploads may need platform-specific request-size tuning before production deployment.

## Build 4 Will Add

- Admin moderation queue.
- Approve/reject flows for submissions and media.
- Admin media previews.
- More detailed contributor invite management.
- Approved-content preparation for archive rendering.
