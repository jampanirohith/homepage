function toggleMenu() {
    const menu = document.getElementById('semester-list');

    if (menu) {
        menu.classList.toggle('open');
    }
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('#nav-links a[data-target]');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();

            navLinks.forEach((navLink) => navLink.classList.remove('active'));
            sections.forEach((section) => section.classList.remove('active'));

            link.classList.add('active');

            const targetId = link.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                targetSection.classList.add('active');
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });

            if (window.innerWidth <= 768) {
                link.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }
        });
    });
}

const GITHUB_USERNAME = 'jampanirohith';

async function loadGitHubProjects() {
    const projectsGrid = document.getElementById('github-projects-grid');
    const projectsStatus = document.getElementById('github-projects-status');

    if (!projectsGrid || !projectsStatus) {
        return;
    }

    projectsStatus.textContent = 'Loading projects from GitHub...';
    projectsGrid.replaceChildren();

    try {
        const repositories = [];
        let page = 1;
        const perPage = 100;

        while (true) {
            const apiUrl = new URL(
                `https://api.github.com/users/${GITHUB_USERNAME}/repos`
            );

            apiUrl.searchParams.set('type', 'owner');
            apiUrl.searchParams.set('sort', 'updated');
            apiUrl.searchParams.set('direction', 'desc');
            apiUrl.searchParams.set('per_page', String(perPage));
            apiUrl.searchParams.set('page', String(page));

            const response = await fetch(apiUrl.toString(), {
                headers: {
                    Accept: 'application/vnd.github+json'
                }
            });

            if (!response.ok) {
                throw new Error(`GitHub API request failed (${response.status})`);
            }

            const batch = await response.json();

            if (!Array.isArray(batch)) {
                throw new Error('Unexpected response from the GitHub API.');
            }

            repositories.push(...batch);

            if (batch.length < perPage) {
                break;
            }

            page += 1;
        }

        if (repositories.length === 0) {
            projectsStatus.textContent = 'No public repositories were found.';
            return;
        }

        const fragment = document.createDocumentFragment();

        repositories.forEach((repository) => {
            const card = document.createElement('article');
            card.className = 'github-project-card';

            const heading = document.createElement('h3');
            const titleLink = document.createElement('a');
            titleLink.href = repository.html_url;
            titleLink.target = '_blank';
            titleLink.rel = 'noopener noreferrer';
            titleLink.textContent = repository.name;
            heading.appendChild(titleLink);

            const description = document.createElement('p');
            description.className = 'github-project-description';
            description.textContent = repository.description || 'No description provided.';

            const details = document.createElement('p');
            details.className = 'github-project-details';

            const language = document.createElement('span');
            language.textContent = repository.language || 'Language not specified';

            const stars = document.createElement('span');
            stars.textContent = `★ ${new Intl.NumberFormat().format(
                repository.stargazers_count || 0
            )}`;

            details.append(language, stars);

            const links = document.createElement('div');
            links.className = 'github-project-links';

            const repositoryLink = document.createElement('a');
            repositoryLink.href = repository.html_url;
            repositoryLink.target = '_blank';
            repositoryLink.rel = 'noopener noreferrer';
            repositoryLink.textContent = 'View on GitHub ↗';
            links.appendChild(repositoryLink);

            if (repository.homepage) {
                try {
                    const homepageUrl = new URL(repository.homepage);

                    if (homepageUrl.protocol === 'https:' || homepageUrl.protocol === 'http:') {
                        const demoLink = document.createElement('a');
                        demoLink.href = homepageUrl.href;
                        demoLink.target = '_blank';
                        demoLink.rel = 'noopener noreferrer';
                        demoLink.textContent = 'Live Demo ↗';
                        links.appendChild(demoLink);
                    }
                } catch {
                }
            }

            card.append(heading, description, details, links);
            fragment.appendChild(card);
        });

        projectsGrid.appendChild(fragment);
        projectsStatus.textContent =
            `Showing ${repositories.length} public repositories, sorted by recent updates.`;
    } catch (error) {
        console.error('Unable to load GitHub repositories:', error);
        projectsStatus.textContent =
            'Projects could not be loaded right now. You can browse them directly on GitHub.';

        const fallbackLink = document.createElement('a');
        fallbackLink.href = `https://github.com/${GITHUB_USERNAME}?tab=repositories`;
        fallbackLink.target = '_blank';
        fallbackLink.rel = 'noopener noreferrer';
        fallbackLink.textContent = 'Browse all repositories on GitHub ↗';
        projectsGrid.appendChild(fallbackLink);
    }
}

function initializePortfolio() {
    setupNavigation();
    loadGitHubProjects();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePortfolio, { once: true });
} else {
    initializePortfolio();
}
