# Build 10: Background Music and Sound Atmosphere

Build 10 adds optional background music for Elizabeth's archive. Music is never forced: Elizabeth chooses whether to listen, can pause anytime, and can control volume/mute from a small floating player.

## New Admin Route

```text
/admin/music
```

Admin can:

- upload a background music file
- set track title
- add artist/source or licence notes
- preview uploaded tracks
- set the active track
- set default volume
- enable or disable the music permission prompt
- delete a track and optionally remove its storage file

Only upload music you own, created yourself, or have permission to use.

Music files are not sent through a Next.js Server Action. The admin browser asks the app for a signed Supabase upload token, uploads the file directly to private Supabase Storage, then sends a small JSON request to create the `music_tracks` row.

## Upload Flow

The direct upload flow uses two small admin-only API routes:

```text
/api/admin/music/create-upload-url
/api/admin/music/create-track
```

`create-upload-url` accepts small JSON only:

- filename
- content type
- file size
- title
- optional description
- optional default volume

It verifies the current user is an admin, validates file type/size, generates a path such as:

```text
music/{timestamp}-{random}.{ext}
```

Then it returns the private bucket name, storage path, signed upload URL, and token.

`create-track` accepts only metadata JSON after the browser upload succeeds:

- title
- description
- bucket
- storage path
- default volume
- active status

It verifies admin access again, checks the uploaded object exists, deactivates other tracks when needed, and inserts the `music_tracks` row.

## Database Migration

Run this migration on an existing Supabase project:

```sql
-- supabase/build-10-music-system.sql
```

It adds:

- `music_tracks`
- `archive_settings.music_prompt_enabled`
- private storage bucket `elizabeth-music`
- admin-only RLS policies for music metadata
- admin-only storage policies for the music bucket

The migration also creates a partial unique index so only one music track can be active at a time.

## Storage Rules

Bucket:

```text
elizabeth-music
```

Allowed files:

- mp3
- m4a
- wav
- webm

Maximum size:

```text
25MB
```

Music files are stored in private Supabase Storage. The archive receives a short-lived signed playback URL generated server-side.

## Elizabeth Experience

When an active track exists and the prompt is enabled, Elizabeth sees:

```text
Would you like music with your story?
```

Options:

- `Play music`
- `Continue quietly`

Her choice is saved as non-sensitive local preference data. The app also stores volume and muted state locally. It never stores auth, access codes, cookies, or secrets in localStorage.

If no active track exists:

- no prompt appears
- no player appears
- no broken controls render

## Floating Player

The archive music player appears only on archive experience routes, not on `/archive/locked` or the print-friendly keepsake view.

Controls:

- play/pause
- mute/unmute
- volume
- current track title
- optional source note

Playback can continue smoothly while navigating between archive subroutes because the provider is mounted in `app/archive/layout.tsx`.

## Accessibility Notes

- No loud autoplay.
- Audio starts only from a user action or browser-allowed prior preference.
- Controls are real buttons/inputs with labels.
- Pause is always visible when music is available.
- The prompt can be skipped with `Continue quietly`.
- Preference storage is non-sensitive.

## Testing Checklist

- [ ] Run `supabase/build-10-music-system.sql`.
- [ ] Open `/admin/music` as admin.
- [ ] Upload an mp3, m4a, wav, or webm under 25MB.
- [ ] Confirm the upload does not trigger a Next.js Server Action body-size error.
- [ ] Set the uploaded track active.
- [ ] Preview audio from the admin page.
- [ ] Enable the music prompt.
- [ ] Open `/archive` with access.
- [ ] Music prompt appears when an active track exists.
- [ ] `Play music` starts playback at low volume.
- [ ] `Continue quietly` hides the prompt and does not play audio.
- [ ] Floating player play/pause works.
- [ ] Mute/unmute works.
- [ ] Volume works and persists.
- [ ] `/archive/locked` does not auto-play music.
- [ ] No active track hides prompt and player.
- [ ] `npm run lint` passes.
- [ ] `npm run typecheck` passes.
- [ ] `npm run build` passes.

## Known Limitations

- The app does not provide licensed music. Admin must upload a permitted track.
- If the browser blocks restored playback after a full page reload, Elizabeth can press Play from the floating control.
- Signed URLs expire, so very long sessions may require a refresh if a track was not already loaded by the browser.
