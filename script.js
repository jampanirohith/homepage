document.addEventListener('DOMContentLoaded', () => {
    // Get all navigation links and content sections
    const navLinks = document.querySelectorAll('#nav-links a');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default link behavior
            
            // 1. Remove 'active' class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // 2. Remove 'active' class from all sections (hides them)
            sections.forEach(s => s.classList.remove('active'));

            // 3. Add 'active' class to the clicked link
            this.classList.add('active');

            // 4. Find the target section and make it active (shows it)
            const targetId = this.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
            
            // Scroll to top of page on mobile when changing tabs
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
});