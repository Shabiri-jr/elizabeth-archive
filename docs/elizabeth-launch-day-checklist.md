# Elizabeth Launch Day Checklist

Use this on August 19 before sending Elizabeth the private invitation.

## 1. Confirm Production Is Ready

- [ ] Vercel deployment is live.
- [ ] `NEXT_PUBLIC_SITE_URL` or `APP_ORIGIN` points to the production domain.
- [ ] Supabase production project is connected.
- [ ] `ELIZABETH_ACCESS_CODE` is set in Vercel.
- [ ] `ELIZABETH_SESSION_SECRET` is set in Vercel and is not the access code.
- [ ] Admin login works at `/admin/login`.
- [ ] Elizabeth login page works at `/elizabeth/login`.

## 2. Finish Content Review

- [ ] Review all pending submissions in `/admin/submissions`.
- [ ] Approve the messages and memories Elizabeth should see.
- [ ] Reject anything that should stay out of the archive.
- [ ] Review pending media in `/admin/media`.
- [ ] Approve only the photos, voice notes, and videos that should appear.
- [ ] Edit the final letter in `/admin/chapters`.
- [ ] Check the final chapter from you.

## 3. Set The Archive State

In `/admin/settings`:

- [ ] Close contributions if collection is finished.
- [ ] Enable archive live.
- [ ] Enable Elizabeth access.
- [ ] Leave maintenance mode off.
- [ ] Enable reveal mode if you want the full opening moment.

## 4. Preview Everything

- [ ] Preview `/archive/preview` on desktop.
- [ ] Preview `/archive/preview` on mobile.
- [ ] Check the gallery lightbox.
- [ ] Check audio and video playback.
- [ ] Check the final letter.
- [ ] Open `/archive/keepsake`.
- [ ] Test print or save-as-PDF from the keepsake view.

## 5. Back Up The Gift

Go to `/admin/export`:

- [ ] Download Approved Archive JSON.
- [ ] Download Launch Backup JSON.
- [ ] Store the files somewhere safe.

## 6. Prepare The Invitation

Go to `/admin/launch`:

- [ ] Copy the Elizabeth invite link.
- [ ] Confirm it opens `/for-elizabeth`.
- [ ] Download the QR code.
- [ ] Test the QR code with a phone camera.
- [ ] Print the QR card if using a physical gift.

Suggested physical card copy:

```text
Elizabeth, scan this when you are ready to open your birthday story.
```

## 7. Send It

Send Elizabeth:

- the `/for-elizabeth` link or QR card
- her private access code

Suggested message:

```text
Happy birthday, Elizabeth. I made something private for you.
Open this when you have a quiet moment: [link]
Use your private code when it asks.
```

## 8. After She Opens It

- [ ] Keep the archive live.
- [ ] Keep the backup exports somewhere safe.
- [ ] Leave contributions closed unless you want late additions.
- [ ] If you add late content, approve it before expecting it to appear.

