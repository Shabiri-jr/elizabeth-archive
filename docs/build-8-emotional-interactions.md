# Build 8: Emotional Interaction Layer

Build 8 adds replayable and personal archive interactions without changing the core architecture or the lilac soft luxury direction.

## New Routes

- `/archive/open-when` - protected Open When letter drawer.
- `/archive/from-me` - protected Private From Me Room.
- `/archive/favourites` - protected favourites collection.
- `/admin/open-when` - admin editor for Open When letters.

## Database Migration

Run this migration on an existing Supabase project:

```sql
-- supabase/build-8-emotional-interactions.sql
```

It creates:

- `open_when_letters`
- `elizabeth_favourites`
- the `private-from-me-room` chapter seed
- default Open When letters
- admin/Elizabeth RLS policies

The application still reads Open When letters and favourites through server-side access checks. Public users cannot list these tables directly.

## Open When Letters

Elizabeth can open visible letters for moods such as tired, unsure, needing peace, or needing encouragement.

Admin controls live at `/admin/open-when`:

- create a letter
- edit title, subtitle, mood, body, sort order
- toggle visibility
- delete with confirmation

Only `is_visible = true` letters appear in Elizabeth's archive and `/archive/open-when`.

## Animated Word Wall

The Girl We Know section now:

- trims and cleans approved one-word values
- removes duplicates visually
- shows repeated words with `xN`
- gives frequent words stronger visual weight
- uses the existing GSAP archive reveal targets

Pending and rejected submissions are still excluded because the archive query only reads approved submissions.

## Birthday Trailer

The archive opening now uses the birthday trailer sequence:

```text
Every person has a story.
Some people make the room softer.
Some people make ordinary moments feel warmer.
Some people are remembered by how they make others feel.
This one is for Elizabeth.
A Story Called Elizabeth
```

It is:

- skippable
- replayable from inside the archive
- stored as a non-sensitive local preference
- disabled for reduced-motion users
- non-blocking when JavaScript fails

## Private From Me Room

`/archive/from-me` shows a protected private room for the personal message.

The copy comes from the `archive_chapters` row with slug:

```text
private-from-me-room
```

Admin can edit this from `/admin/chapters`. If the chapter has not been customized, polished fallback sections render safely.

## Favourites

Elizabeth can save:

- messages
- memories
- future wishes
- gallery photos
- voice notes
- videos
- Open When letters

Favourites are stored in `elizabeth_favourites`.

Server-side protections:

- favourite mutations require Elizabeth archive access
- admin preview cannot create/delete favourites
- item IDs are validated as UUIDs
- saved items are rechecked against approved/visible content
- `/archive/favourites` only renders approved submissions/media and visible letters

## Easter Eggs

Tasteful hidden notes were added:

- pastry babe
- lilac signature colour
- fashion empire
- graduation era
- soft-life CEO

Unlock state is stored only as local, non-sensitive UI preference data. Easter eggs use the shared lilac toast style.

## Security Notes

- Public users are redirected away from all final archive routes.
- Admin mutations call the existing `requireAdminActionContext`.
- Favourites are written through a server action that verifies Elizabeth archive access.
- Service role keys remain server-only.
- No pending/rejected submissions or media are rendered.
- Open When visibility is enforced before rendering.
- Local storage is used only for harmless UI state, not authentication or access codes.

## Testing Checklist

- [ ] Run `supabase/build-8-emotional-interactions.sql`.
- [ ] Admin can open `/admin/open-when`.
- [ ] Admin can create, edit, toggle, reorder, and delete Open When letters.
- [ ] Hidden Open When letters do not appear in `/archive`.
- [ ] Elizabeth can open `/archive/open-when`.
- [ ] Public users are redirected from `/archive/open-when`, `/archive/from-me`, and `/archive/favourites`.
- [ ] Trailer plays on first visit and can be skipped.
- [ ] Replay opening works.
- [ ] Reduced motion does not show heavy trailer motion.
- [ ] Approved words appear in the word wall.
- [ ] Pending/rejected words do not appear.
- [ ] Heart save/remove works for messages, memories, wishes, media, and Open When letters.
- [ ] `/archive/favourites` shows saved approved/visible items only.
- [ ] Easter egg toast messages work.
- [ ] `npm run lint` passes.
- [ ] `npm run typecheck` passes.
- [ ] `npm run build` passes.

## Known Limitations

- Favourites are intentionally single-Elizabeth scoped.
- The Private From Me Room is edited through the existing chapter editor, not a separate rich text editor.
- Easter egg settings are hardcoded because Build 8 requested simple tasteful surprises rather than a full configuration system.

