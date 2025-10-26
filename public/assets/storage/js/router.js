// Simple client-side router to load pages without reloads
document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("main");
  const links = document.querySelectorAll("a.nav-link, a.nav-link-mobile");

  links.forEach(link => {
    link.addEventListener("click", async (e) => {
      const href = link.getAttribute("href");
      if (!href.endsWith(".html") && !href.startsWith("#")) return;
      e.preventDefault();

      const res = await fetch(href);
      const html = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const newMain = doc.querySelector("main");

      // Replace only the main content
      main.innerHTML = newMain.innerHTML;

      // Update page title and history
      document.title = doc.title;
      history.pushState({}, "", href);
    });
  });

  // Handle back/forward navigation
  window.addEventListener("popstate", async () => {
    const res = await fetch(location.pathname);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const newMain = doc.querySelector("main");
    main.innerHTML = newMain.innerHTML;
    document.title = doc.title;
  });
});
