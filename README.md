# Syed Co. website

A static site (plain HTML, no build step). Everything lives in `index.html`, with images in the `images` folder.

## What's in here

- `index.html` is the whole site
- `images/` holds the logos, headshot and photos
- `services/` holds the services overview and one page for each service. Every page has the contact form, and each submission is tagged with the service and the page it came from
- `assets/form.js` runs the contact form on every page
- `insights/` holds the articles. Each one lives in its own folder as `index.html`
- `assets/site.css` is the master copy of the shared styles. The Services and Insights pages carry a copy of it inside each page, so they still look right on their own
- `favicon.png` is the browser tab icon
- `llms.txt`, `robots.txt` and `sitemap.xml` are for search engines and AI tools
- `vercel.json` sets caching and security headers

## 1. Set up the contact form (Formspree)

The form is already wired up. It just needs your Formspree form ID.

1. Go to formspree.io and make a free account.
2. Click **New Form**, name it something like "Syed Co. contact", and set the email to `taimoor@syedco.com`.
3. Formspree gives you a form URL that looks like `https://formspree.io/f/abcdwxyz`. Copy it.
4. Open `assets/form.js` and replace `YOUR_FORM_ID` near the top with the ID from your URL (the part after `/f/`). That one file runs the form on every page, so there's only one place to change.
5. Submit one test message from the live site. Formspree will email you to confirm the address the first time, so check your inbox.

Until the ID is added, the form falls back to opening a pre-filled email, so nothing breaks in the meantime.

Worth doing in Formspree's settings: restrict the form to your domain (syedco.com) so nobody else can use your endpoint. The free plan has a monthly submission limit, so check their pricing page if you expect a lot of traffic.

## 2. Put it on GitHub

1. Create a new repository on GitHub (private is fine).
2. Upload everything in this folder so `index.html` is at the top level of the repo, not inside another folder.
3. Commit.

## 3. Deploy on Vercel

1. In Vercel, click **Add New > Project** and import the GitHub repo.
2. Framework Preset: **Other**. Leave the build command and output directory empty.
3. Click **Deploy**.

## 4. Connect syedco.com

1. In the Vercel project, go to **Settings > Domains** and add `syedco.com` (and `www.syedco.com` if you want it).
2. Vercel shows the DNS records to add at wherever the domain is registered. Add them and wait for it to verify.

## 5. Get it indexed on Google

The site already has the basics in place: a canonical URL, a sitemap, robots.txt, social preview tags and structured data. It assumes your final address is `https://syedco.com/` (no www). If you use something different, search `index.html`, `sitemap.xml` and `robots.txt` for `syedco.com` and update it.

1. Go to Google Search Console and add `syedco.com` as a **Domain** property. It asks you to add one DNS TXT record where the domain is registered.
2. Once verified, open **Sitemaps** and submit `https://syedco.com/sitemap.xml`.
3. Use **URL Inspection**, paste `https://syedco.com/`, and click **Request indexing**.
4. Do the same in Bing Webmaster Tools. Several other search and AI tools lean on Bing's index.
5. In Vercel, make sure `www.syedco.com` redirects to `syedco.com`, so Google only sees one version of the site.

New sites usually take a few days to a few weeks to show up. Searching your own name is the first thing that will work. Ranking for broader searches takes more pages and links over time.

## Adding a new article

1. Copy one of the folders inside `insights/` and rename it. The folder name becomes the web address, so keep it short and lowercase with hyphens (for example `insights/my-new-article/`).
2. Open its `index.html` and change the title, description, canonical address (the `<link rel="canonical">` line), the dates in the structured data, and the article text.
3. Add a card for it to `insights/index.html` and the "Insights" section of the main `index.html`.
4. Add the new address to `sitemap.xml` and `llms.txt`.
5. Commit to GitHub. After it deploys, paste the new address into Google Search Console's URL Inspection and click Request indexing.

## Adding or editing a service page

Each service lives in its own folder inside `services/` as `index.html`. To add one, copy a folder, rename it, change the title, description, canonical address, structured data and text, then add a card for it on `services/index.html` and the homepage, and add the address to `sitemap.xml` and `llms.txt`.

## Making changes later

Edit the files, commit to GitHub, and Vercel redeploys automatically.

- Your LinkedIn URL appears in a few places in `index.html`. Search for `linkedin.com/in/` to find them.
- To swap a photo, replace the file in `images/` and keep the same filename.
