# Nalian Kush Novels — Static Website (GitHub-ready)

This project is a static website for selling novels via manual Mobile Money payment + email proof workflow.
It is intended to be hosted on GitHub Pages or any static host.

## What's included
- `index.html` — Home page
- `novels.html` — Catalogue page with Buy buttons
- `howto.html` — Step-by-step "How to Buy"
- `contact.html` — Contact details
- `styles.css`, `script.js`
- `/assets` — cover images and hero art (SVG content in files)
- `/novels` — placeholder PDF files (replace with your real novels)

## How this payment flow works (manual)
1. Customer chooses a novel and pays via Mobile Money to one of the numbers:
   - +256 784 380 775
   - +256 762 548 826
2. They note the transaction ID or the phone number they used.
3. They click "I Paid — Send Proof" on the site, enter their email and TxID, and their email client will open with a pre-filled message. They attach proof (screenshot) and send it.
4. You (seller) verify manually and reply with the download link (you can upload final PDF to `/novels` and send a direct link to the buyer).

## To deploy
1. Create a new GitHub repository.
2. Upload these files to the repository root.
3. Enable GitHub Pages (in repo Settings → Pages → Deploy from `main` branch / `docs` folder as you prefer).
4. Your site will be live under `https://<your-username>.github.io/<repo>`.

## Want automatic payments?
I can help integrate MTN MoMo / Flutterwave / Paystack for automated verification and instant download links, but that requires a backend server and API keys.

Contact:
- nathantumwesigye89@gmail.com
- olivestrigger256@gmail.com
