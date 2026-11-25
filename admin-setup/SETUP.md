# Erika bookings: setup (about 10 minutes, once)

The admin panel lives at `admin.html` on the website. It reads bookings from a Google Sheet that Erika owns, so customer names and numbers stay in her Google account, not in the public website code.

## 1. Create the sheet
1. Sign in to Erika's Google account and create a new Google Sheet called **Erika Bookings**.

## 2. Add the script
1. In the sheet: **Extensions > Apps Script**.
2. Delete what is there and paste everything from `admin-setup/Code.gs`.
3. On the first line, change `CHANGE-ME-erika-private-key` to a private admin key (like a password). Only Erika should know it.
4. Check `BOOT_STOCK` matches the real pairs per class (now S 2, M 8, L 1).
5. Press **Save**.

## 3. Publish it as a web app
1. **Deploy > New deployment**, type **Web app**.
2. Execute as: **Me**. Who has access: **Anyone**.
3. Press **Deploy**, allow the permissions, and copy the **Web app URL** (ends with `/exec`).

## 4. Connect the website
1. Open `js/erika-config.js` in the website repo.
2. Paste the URL: `window.ERIKA_API = 'https://script.google.com/macros/s/.../exec';`
3. Commit. After GitHub Pages updates, bookings are saved to the sheet.

## 5. Open the admin panel
- Go to `https://wai-solutions.github.io/erika-life/admin.html` and enter the admin key.
- The page is not linked from the website and is hidden from search engines. Bookmark it on Erika's phone.

## What it does
- Every booking is saved with a reference, studio, day, time, boots size, name, WhatsApp, first bounce and notes.
- The booking page shows real boots left per class for everyone, and refuses a size that is already full.
- In the admin panel Erika can mark a booking **Paid** after checking InstaPay, cancel or restore it, search, and download a CSV.

## Changing the script later
After editing the script: **Deploy > Manage deployments > Edit > Version: New version > Deploy**. The URL stays the same.
