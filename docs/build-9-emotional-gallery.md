# Build 9: Emotional Gallery System

Build 9 turns Chapter 05 from a simple photo grid into a cinematic memory gallery while preserving the existing lilac soft luxury design and access model.

## New Archive Components

- `components/archive/gallery/EmotionalGallery.tsx` - orchestrates all gallery modes and the shared modal.
- `components/archive/gallery/PolaroidWall.tsx` - hand-placed photo wall with captions and favourite buttons.
- `components/archive/gallery/FilmStripGallery.tsx` - horizontal scroll-snap memory reel with active-frame story text.
- `components/archive/gallery/TimelineGallery.tsx` - vertical/mobile and alternating desktop timeline of photo moments.
- `components/archive/gallery/FloatingPhotoMemories.tsx` - featured photo memories around a central text card.
- `components/archive/gallery/PhotoMemoryModal.tsx` - accessible click-to-reveal image and message detail view.

Chapter 05 now introduces the gallery with:

```text
Not every memory arrives as a paragraph. Some arrive as a picture, a smile, a dress, a room, a day, a version of you people were grateful to witness.
```

## Database Migration

Run this migration on an existing Supabase project:

```sql
-- supabase/build-9-emotional-gallery.sql
```

It adds optional fields to `media_assets`:

- `gallery_mode`
- `display_order`
- `featured`
- `memory_date`
- `emotion_tag`
- `admin_caption`

These fields are optional, so existing contributor uploads continue to work without changes.

## Admin Gallery Management

Admin controls live at:

```text
/admin/gallery
```

The admin can:

- add or edit a warmer gallery caption
- mark an image as featured
- choose gallery mode: auto, polaroid, film strip, timeline, or floating
- set display order
- add a moment label/date
- add an emotion tag
- update image status

Admin gallery saves run through `lib/admin/gallery-actions.ts`, verify admin role server-side, and log `update_gallery_image` in `admin_activity_logs`.

## How Images Connect To Stories

The archive gallery only receives approved images from `media_assets` linked to approved `birthday_submissions`.

For each approved image, the archive can display:

- admin caption
- original media caption
- contributor name
- contributor relationship
- linked memory
- linked birthday message
- linked future wish
- moment label/date
- emotion tag

If a photo has no memory text, the modal uses:

```text
This picture came without a long story, but it still belongs here.
```

## Gallery Modes

Polaroid Wall:
All approved images appear as warm photo cards with gentle rotation, lilac tape accents, and soft shadows.

Film Strip:
Images marked `film-strip`, or the first ordered images as fallback, appear in a horizontal scroll-snap reel. Selecting a frame shows its linked message beside it.

Timeline:
Images marked `timeline` or given a moment label/date appear as chapter-like timeline entries. If no timeline metadata exists, ordered images still render safely.

Floating Memories:
Featured images, or images marked `floating`, appear in the featured memory section. Motion is CSS-based, subtle, and disabled by reduced-motion preferences.

## Favourites Integration

Gallery images keep the Build 8 favourite heart behavior. Elizabeth can save approved photos from the polaroid wall and photo detail modal. The favourites page still rechecks approved media before rendering saved photos.

## Security Rules

- Public users cannot access `/archive`.
- The gallery query only reads approved submissions.
- The gallery query only reads approved media.
- Media linked to rejected or pending submissions is not included.
- Admin notes and private contributor tokens are never rendered.
- Admin gallery mutations verify admin role server-side.
- Supabase service role keys remain server-only.
- Signed media URLs are generated server-side through the existing archive media helper.

## Performance Notes

- Non-critical images use lazy loading.
- Photo cards use stable aspect-ratio containers to reduce layout shift.
- The modal loads the larger active image only after interaction.
- The film strip uses CSS scroll snap rather than a heavy carousel library.
- Floating animation is limited to a small featured set and respects `prefers-reduced-motion`.

## Testing Checklist

- [ ] Run `supabase/build-9-emotional-gallery.sql`.
- [ ] Public users cannot access the archive gallery.
- [ ] Elizabeth can access approved gallery images.
- [ ] Admin preview can see the gallery.
- [ ] Approved images appear.
- [ ] Pending/rejected images do not appear.
- [ ] Images linked to rejected submissions do not appear.
- [ ] Captions, memories, messages, and future wishes render in the modal.
- [ ] Polaroid Wall works on desktop and mobile.
- [ ] Film Strip scrolls horizontally and updates the active frame.
- [ ] Timeline renders ordered photo moments.
- [ ] Floating Photo Memories shows featured images only.
- [ ] Modal opens, closes on Escape, and supports previous/next.
- [ ] Gallery hearts save/remove favourites in Elizabeth session.
- [ ] Admin can update caption, featured state, gallery mode, order, moment label, emotion tag, and status.
- [ ] Admin changes appear in `/archive/preview`.
- [ ] `npm run lint` passes.
- [ ] `npm run typecheck` passes.
- [ ] `npm run build` passes.

## Known Limitations

- Gallery metadata is intentionally simple text fields, not a full rich media CMS.
- Photo cropping is CSS object-fit based; there is no manual focal-point editor yet.
- The archive still depends on Supabase signed URLs being available for private storage media.
