document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });

    const hoverElements = document.querySelectorAll('a, button, .btn');
    hoverElements.forEach((el) => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
        });
    });
    
    // Fallback for elements added later or dynamic components
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('a') || e.target.closest('button') || e.target.closest('.btn')) {
            cursor.classList.add('cursor-hover');
        } else {
            cursor.classList.remove('cursor-hover');
        }
    });
});
