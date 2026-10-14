
const GITHUB_USERNAME = "jampanirohith";

const projectsGrid = document.getElementById("github-projects-grid");
const projectsStatus = document.getElementById("github-projects-status");

async function loadGitHubProjects() {
  projectsStatus.textContent = "Loading projects from GitHub...";
  projectsGrid.replaceChildren();

  try {
    const repositories = [];
    let page = 1;

    // Fetch every page so accounts with more than 100
    // public repositories are supported too.
    while (true) {
      const url = new URL(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos`
      );

      url.searchParams.set("type", "owner");
      url.searchParams.set("sort", "updated");
      url.searchParams.set("direction", "desc");
      url.searchParams.set("per_page", "100");
      url.searchParams.set("page", String(page));

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`GitHub API returned ${response.status}`);
      }

      const batch = await response.json();
      repositories.push(...batch);

      if (batch.length < 100) break;
      page++;
    }

    // Include all public repositories owned by the account.
    // Forks and archived repositories are included too.
    projectsGrid.replaceChildren();

    if (repositories.length === 0) {
      projectsStatus.textContent = "No public repositories found.";
      return;
    }

    const fragment = document.createDocumentFragment();

    repositories.forEach((repo) => {
      const card = document.createElement("article");
      card.className = "github-project-card";

      const title = document.createElement("h3");
      const titleLink = document.createElement("a");
      titleLink.href = repo.html_url;
      titleLink.target = "_blank";
      titleLink.rel = "noopener noreferrer";
      titleLink.textContent = repo.name;
      title.appendChild(titleLink);

      const description = document.createElement("p");
      description.className = "github-project-description";
      description.textContent =
        repo.description || "No description provided yet.";

      const details = document.createElement("p");
      details.className = "github-project-details";

      const language = document.createElement("span");
      language.textContent = repo.language || "Language not specified";

      const stars = document.createElement("span");
      stars.textContent = `★ ${repo.stargazers_count}`;

      details.append(language, stars);

      const links = document.createElement("div");
      links.className = "github-project-links";

      const repoLink = document.createElement("a");
      repoLink.href = repo.html_url;
      repoLink.target = "_blank";
      repoLink.rel = "noopener noreferrer";
      repoLink.textContent = "View on GitHub ↗";
      links.appendChild(repoLink);

      if (repo.homepage) {
        try {
          const homepageUrl = new URL(repo.homepage);
          if (["https:", "http:"].includes(homepageUrl.protocol)) {
            const demoLink = document.createElement("a");
            demoLink.href = homepageUrl.href;
            demoLink.target = "_blank";
            demoLink.rel = "noopener noreferrer";
            demoLink.textContent = "Live Demo ↗";
            links.appendChild(demoLink);
          }
        } catch {
          // Ignore invalid homepage URLs.
        }
      }

      card.append(title, description, details, links);
      fragment.appendChild(card);
    });

    projectsGrid.appendChild(fragment);
    projectsStatus.textContent =
      `Showing ${repositories.length} public repositories.`;
  } catch (error) {
    console.error("Could not load GitHub projects:", error);
    projectsStatus.textContent =
      "Projects could not be loaded right now. Visit my GitHub profile to see all repositories.";

    const fallbackLink = document.createElement("a");
    fallbackLink.href = `https://github.com/${GITHUB_USERNAME}?tab=repositories`;
    fallbackLink.textContent = "Browse all repositories on GitHub ↗";
    fallbackLink.target = "_blank";
    fallbackLink.rel = "noopener noreferrer";
    projectsGrid.appendChild(fallbackLink);
  }
}

loadGitHubProjects();
