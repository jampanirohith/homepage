function toggleMenu() {
    const menu = document.getElementById('semester-list');
    if (menu) menu.classList.toggle('open');
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('#nav-links a[data-target]');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            navLinks.forEach((item) => item.classList.remove('active'));
            sections.forEach((section) => section.classList.remove('active'));
            link.classList.add('active');

            const targetSection = document.getElementById(link.dataset.target);
            if (targetSection) targetSection.classList.add('active');

            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (window.innerWidth <= 768) {
                link.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        });
    });
}

const GITHUB_USERNAME = 'jampanirohith';
const FEATURED_REPOSITORY_NAMES = [
    'vachikaofficial',
    'Edge-Based-Smart-Suspension',
    'OpenCV-Projects',
    'modus'
];

function createRepositoryCard(repository, featured = false) {
    const card = document.createElement('article');
    card.className = featured
        ? 'github-project-card featured-project-card'
        : 'github-project-card';

    const heading = document.createElement('h3');
    const title = document.createElement('a');
    title.href = repository.html_url;
    title.target = '_blank';
    title.rel = 'noopener noreferrer';
    title.textContent = repository.name;
    heading.appendChild(title);
    card.appendChild(heading);

    if (repository.description) {
        const description = document.createElement('p');
        description.className = 'github-project-description';
        description.textContent = repository.description;
        card.appendChild(description);
    }

    const metadata = document.createElement('p');
    metadata.className = 'github-project-details';
    if (repository.language) {
        const language = document.createElement('span');
        language.textContent = repository.language;
        metadata.appendChild(language);
    }
    if (repository.stargazers_count > 0) {
        const stars = document.createElement('span');
        stars.textContent = `★ ${new Intl.NumberFormat().format(repository.stargazers_count)}`;
        metadata.appendChild(stars);
    }
    if (metadata.childElementCount) card.appendChild(metadata);

    const links = document.createElement('div');
    links.className = 'github-project-links';

    const sourceLink = document.createElement('a');
    sourceLink.href = repository.html_url;
    sourceLink.target = '_blank';
    sourceLink.rel = 'noopener noreferrer';
    sourceLink.textContent = 'View on GitHub ↗';
    links.appendChild(sourceLink);

    if (repository.homepage) {
        try {
            const demoUrl = new URL(repository.homepage);
            if (demoUrl.protocol === 'https:' || demoUrl.protocol === 'http:') {
                const demoLink = document.createElement('a');
                demoLink.href = demoUrl.href;
                demoLink.target = '_blank';
                demoLink.rel = 'noopener noreferrer';
                demoLink.textContent = 'Live Demo ↗';
                links.appendChild(demoLink);
            }
        } catch {
        }
    }

    card.appendChild(links);
    return card;
}

function createProfileFallback(container) {
    const link = document.createElement('a');
    link.href = `https://github.com/${GITHUB_USERNAME}?tab=repositories`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'View all repositories on GitHub ↗';
    container.replaceChildren(link);
}

async function fetchPublicRepositories() {
    const repositories = [];
    let page = 1;
    const pageSize = 100;

    while (true) {
        const url = new URL(`https://api.github.com/users/${GITHUB_USERNAME}/repos`);
        url.searchParams.set('type', 'owner');
        url.searchParams.set('sort', 'updated');
        url.searchParams.set('direction', 'desc');
        url.searchParams.set('per_page', String(pageSize));
        url.searchParams.set('page', String(page));

        const response = await fetch(url, {
            headers: { Accept: 'application/vnd.github+json' }
        });
        if (!response.ok) throw new Error(`GitHub API request failed (${response.status})`);

        const batch = await response.json();
        if (!Array.isArray(batch)) throw new Error('Invalid GitHub API response');
        repositories.push(...batch);

        if (batch.length < pageSize) break;
        page += 1;
    }

    return repositories;
}

async function loadGitHubProjects() {
    const featuredGrid = document.getElementById('featured-github-projects');
    const allProjectsGrid = document.getElementById('github-projects-grid');
    if (!featuredGrid || !allProjectsGrid) return;

    featuredGrid.replaceChildren();
    allProjectsGrid.replaceChildren();

    try {
        const repositories = await fetchPublicRepositories();
        const repositoriesByName = new Map(
            repositories.map((repository) => [repository.name.toLowerCase(), repository])
        );
        const featuredNames = new Set(FEATURED_REPOSITORY_NAMES.map((name) => name.toLowerCase()));
        const featuredRepositories = FEATURED_REPOSITORY_NAMES
            .map((name) => repositoriesByName.get(name.toLowerCase()))
            .filter(Boolean);
        const otherRepositories = repositories.filter(
            (repository) => !featuredNames.has(repository.name.toLowerCase())
        );

        const featuredFragment = document.createDocumentFragment();
        featuredRepositories.forEach((repository) => {
            featuredFragment.appendChild(createRepositoryCard(repository, true));
        });
        featuredGrid.appendChild(featuredFragment);

        const otherFragment = document.createDocumentFragment();
        otherRepositories.forEach((repository) => {
            otherFragment.appendChild(createRepositoryCard(repository));
        });
        allProjectsGrid.appendChild(otherFragment);

        if (featuredRepositories.length === 0) createProfileFallback(featuredGrid);
        if (otherRepositories.length === 0) allProjectsGrid.replaceChildren();
    } catch (error) {
        console.error('Unable to load GitHub repositories:', error);
        createProfileFallback(featuredGrid);
        createProfileFallback(allProjectsGrid);
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
