# Deploying futuregaming.dk

## Where the site lives

- **futuregaming.dk** is on Simply.com shared hosting, uploaded by FTP. Pushing to GitHub or
  deploying to Vercel does **not** update it.
- The Vercel project (`future-gaming-one.vercel.app`) is only a preview surface. No customer domain
  points at it, and a plain `vercel deploy` there goes to its production target.

## Which branch is live

| Branch | What it is |
|---|---|
| `live` | **What futuregaming.dk runs.** The April site plus the Firmabestilling CTAs (2026-09-21). |
| `main` | `live`'s content plus the Future eSport sub-site (June), which the client has **not** approved for the live site. Do not upload a build of `main`. |

The Firmabestilling change (`33ebf96` on `main`) was brought over to `live` without its eSport parts,
together with a header fix (the logo was squashing to fit the longer menu). Anything that should go
live gets committed to `live`.

## Steps

1. `git checkout live && npx vite build`, which writes `dist/`.
2. Compare `dist/` with the server's `public_html/`. Vite renames files when their content changes,
   so usually only `index.html` and one or two `assets/index-*.{css,js}` are new.
3. Upload over FTP to `linux311.unoeuro.com`, user `futuregaming.dk`, into `public_html/`. The
   password is saved in FileZilla (`~/.config/filezilla/recentservers.xml`).
   Upload the new `assets/` first and **`index.html` last**, so visitors never load a page whose
   CSS/JS isn't there yet.
4. Check the remote file sizes against `dist/`, then load the site.

## Gotchas

- **Use plain FTP (FileZilla's default), not `curl --ftp-ssl`.** On 2026-09-21 TLS uploads failed
  with `426` and left the files cut off at 16 KB on the server, which broke the live site until it
  was re-uploaded. Always check file sizes after an upload.
- Simply.com answers `455` to bare `curl`. Send a browser User-Agent and `Accept` headers when
  checking live files.
- Old `assets/index-*` files are left on the server. They're tiny, and a browser holding an old cached
  `index.html` still needs them. To roll back, rebuild the previous `live` commit and re-upload
  `index.html` (its old assets are still there).
