// Function for handling the education dropdown menu
function toggleMenu() {
    const menu = document.getElementById('semester-list');
    menu.classList.toggle('open');
}

// Function for handling main navigation tabs
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('#nav-links a');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 1. Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // 2. Add active class to clicked link
            this.classList.add('active');

            // 3. Find and display target section
            const targetId = this.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.classList.add('active');
            }
            
            // 4. Scroll to top of the page smoothly
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // 5. Center the active tab in the horizontal scroll view (Mobile only)
            if (window.innerWidth <= 768) {
                this.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        });
    });
});