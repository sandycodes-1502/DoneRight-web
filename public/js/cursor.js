document.addEventListener('DOMContentLoaded', () => {
    const cursorDot = document.createElement('div');
    cursorDot.classList.add('custom-cursor-dot');
    
    const cursorCircle = document.createElement('div');
    cursorCircle.classList.add('custom-cursor-circle');
    
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorCircle);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let circleX = mouseX;
    let circleY = mouseY;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        // Dot moves instantly
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    const animate = () => {
        // Smooth interpolation for the circle
        circleX += (mouseX - circleX) * 0.15;
        circleY += (mouseY - circleY) * 0.15;
        
        cursorCircle.style.transform = `translate(${circleX}px, ${circleY}px) translate(-50%, -50%)`;
        requestAnimationFrame(animate);
    };
    animate();

    const addHover = () => {
        cursorDot.classList.add('cursor-hover');
        cursorCircle.classList.add('cursor-hover');
    };
    
    const removeHover = () => {
        cursorDot.classList.remove('cursor-hover');
        cursorCircle.classList.remove('cursor-hover');
    };

    const hoverElements = document.querySelectorAll('a, button, .btn');
    hoverElements.forEach((el) => {
        el.addEventListener('mouseenter', addHover);
        el.addEventListener('mouseleave', removeHover);
    });
    
    // Fallback for elements added later or dynamic components
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('a') || e.target.closest('button') || e.target.closest('.btn')) {
            addHover();
        } else {
            removeHover();
        }
    });
});
