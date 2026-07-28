# I Like Writing — setup guide

This is the whole site as real files. Nothing is live yet — the steps below take
it from "files on your computer" to "a real website you can publish to."
Every step is free.

## Part 1 — Put the files on GitHub

Already in progress — you're doing this file-by-file right now.

## Part 2 — Connect Netlify

1. Go to https://netlify.com and sign up — choose **"Sign up with GitHub"**,
   it's the fastest path since everything's already connected.
2. From your Netlify dashboard, click **Add new site → Import an existing
   project**.
3. Choose **GitHub**, then pick the `i-like-writing` repo you just created.
4. Netlify will detect the build settings automatically (they're already
   defined in `netlify.toml`). Just click **Deploy site**.
5. Wait about a minute. You'll get a live URL like `random-name-123.netlify.app`.
   That's your website.

## Part 3 — Turn on the editor (Decap CMS)

This is what lets you publish new articles through a simple form instead of
editing files by hand.

1. In your Netlify site dashboard, go to **Site configuration → Identity** and
   click **Enable Identity**.
2. Under Identity settings, find **Registration** and set it to
   **Invite only** (so random people can't sign up as editors).
3. Scroll to **Services → Git Gateway** and click **Enable Git Gateway**.
4. Go to the **Identity** tab at the top of the dashboard and click
   **Invite users** — invite your own email address.
5. Check your email, accept the invite, and set a password.
6. Visit `yoursite.netlify.app/admin` — log in with that email and password.
   Since editorial workflow is on, new posts land as Drafts first — move them
   through Review, then click Publish to actually go live.

## Part 4 — Turn on comments (Giscus)

1. On your GitHub repo page, go to **Settings → General**, scroll to
   **Features**, and check **Discussions**.
2. Go to https://giscus.app, enter your repo name (`yourusername/i-like-writing`),
   and follow its on-page setup — it will generate a code snippet with values
   specific to your repo.
3. Open `src/_includes/article.njk` on GitHub and replace the placeholder
   `data-repo-id` and `data-category-id` values with the ones giscus.app gave
   you.
4. Commit the change — Netlify will rebuild automatically, and comments will
   go live.

## Don't forget

Open `.eleventy.js` and replace `https://REPLACE-WITH-YOUR-NETLIFY-URL.netlify.app`
with your real Netlify URL once you have one — this is what makes shared
links show the right preview card.

## Everyday use, once this is all set up

- Go to `yoursite.netlify.app/admin`, log in, click **New Article**, write,
  submit for review, then Publish. Netlify rebuilds the live site automatically
  within about a minute of publishing.
- To add a photo, quote, song, or video inside an article, drop one of these
  lines wherever you want it to appear in the text:
