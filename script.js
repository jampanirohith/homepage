document.addEventListener('DOMContentLoaded', () => {

    const navLinks = document.querySelectorAll('#nav-links a');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            navLinks.forEach(l => l.classList.remove('active'));

            sections.forEach(s => s.classList.remove('active'));

            this.classList.add('active');

            const targetId = this.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
});