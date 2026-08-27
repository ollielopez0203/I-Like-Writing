module.exports = function (eleventyConfig) {
  // Copy static assets straight through to the built site
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("src/favicon.svg");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");
  eleventyConfig.addPassthroughCopy("src/apple-touch-icon.png");
  eleventyConfig.addPassthroughCopy("src/og-image.png");

  // Site-wide info used for Open Graph / social preview tags.
  // IMPORTANT: once you know your real Netlify URL (or a custom domain),
  // update the "url" value below so shared links resolve correctly.
  eleventyConfig.addGlobalData("site", function () {
    return {
      url: "https://i-like-writing.netlify.app",
      name: "I Like Writing",
      description: "short essays, articles, and other works of mine. sometimes i have help.",
    };
  });

  // All articles, newest first
  eleventyConfig.addCollection("articles", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/articles/*.md").sort(function (a, b) {
      return b.date - a.date;
    });
  });

  // Every unique tag across all articles, for the filter bar
  eleventyConfig.addCollection("tagList", function (collectionApi) {
    const tagSet = new Set();
    collectionApi.getFilteredByGlob("src/articles/*.md").forEach(function (item) {
      (item.data.tags || []).forEach(function (tag) {
        tagSet.add(tag);
      });
    });
    return Array.from(tagSet).sort();
  });

  eleventyConfig.addFilter("readableDate", function (dateObj) {
    return new Date(dateObj).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  });

  eleventyConfig.addFilter("isoDate", function (dateObj) {
    return new Date(dateObj).toISOString().split("T")[0];
  });

  // Rough reading time estimate from rendered HTML content
  eleventyConfig.addFilter("readingTime", function (html) {
    if (!html) return "";
    const text = html.replace(/<[^>]*>/g, " ");
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return minutes + " min read";
  });
  
  // ---- Per-tag color system ----
  // Every tag gets a consistent color automatically, picked from this palette
  // based on the tag's name. Add tags freely through the CMS — no need to
  // register them anywhere; the same tag name will always get the same color.
  const TAG_PALETTE = [
    { bg: "#5C7185", text: "#F6F5F2" }, // slate blue-gray
    { bg: "#74805A", text: "#F6F5F2" }, // muted olive
    { bg: "#A66352", text: "#F6F5F2" }, // muted clay
    { bg: "#8B6B84", text: "#F6F5F2" }, // muted plum
    { bg: "#A98A4E", text: "#F6F5F2" }, // muted ochre
  ];

  function hashTag(tag) {
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = (hash + tag.charCodeAt(i) * (i + 1)) % 997;
    }
    return hash % TAG_PALETTE.length;
  }

  eleventyConfig.addFilter("tagColor", function (tag) {
    return TAG_PALETTE[hashTag(tag)].bg;
  });

  eleventyConfig.addFilter("tagTextColor", function (tag) {
    return TAG_PALETTE[hashTag(tag)].text;
  });

  // ---- Media block shortcode ----
  // Usage inside any article's Markdown body:
  //   {% media "image", "/images/photo.jpg", "Caption text here" %}
  //   {% media "quote", "The excerpt itself.", "Book Title, p.42" %}
  //   {% media "audio", "https://open.spotify.com/embed/track/XXXX", "Optional caption" %}
  //   {% media "video", "https://www.youtube.com/embed/XXXX", "Optional caption" %}
  eleventyConfig.addShortcode("media", function (type, a, b) {
    function esc(s) { return String(s == null ? "" : s); }

    if (type === "image") {
      var src = esc(a), caption = esc(b);
      return '<aside class="media-block media-image">' +
        '<img src="' + src + '" alt="' + caption + '" loading="lazy">' +
        (caption ? '<p class="media-caption">' + caption + '</p>' : '') +
        '</aside>';
    }

    if (type === "quote") {
      // Split the quote on blank lines so multi-paragraph quotes each get
      // their own styled paragraph. The whole thing is returned on a single
      // line, otherwise Markdown breaks the HTML block at the first blank
      // line and the rest of the quote loses its styling.
      var paras = esc(a).split(/\n\s*\n/).map(function (p) {
        return p.trim();
      }).filter(Boolean);
      var source = esc(b);
      var body = paras.map(function (p, i) {
        var open = i === 0 ? "&ldquo;" : "";
        var close = i === paras.length - 1 ? "&rdquo;" : "";
        return '<p class="media-quote-text">' + open + p + close + '</p>';
      }).join("");
      return '<aside class="media-block media-quote">' + body +
        (source ? '<p class="media-caption">&mdash; ' + source + '</p>' : '') +
        '</aside>';
    }

    if (type === "audio" || type === "video") {
      var embedUrl = esc(a), cap = esc(b);
      return '<aside class="media-block media-' + type + '">' +
        '<div class="media-embed-wrap">' +
        '<iframe src="' + embedUrl + '" loading="lazy" allow="encrypted-media; autoplay; fullscreen" frameborder="0"></iframe>' +
        '</div>' +
        (cap ? '<p class="media-caption">' + cap + '</p>' : '') +
        '</aside>';
    }

    return "";
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
