document.addEventListener('DOMContentLoaded', () => {
    // Hide default cursor across the entire document
    document.documentElement.style.cursor = 'none';

    // Create cursor elements dynamically
    const dot = document.createElement('div');
    const ring = document.createElement('div');
    
    dot.className = 'cursor-dot';
    ring.className = 'cursor-ring';
    
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let isPointer = false;
    let isClicking = false;
    let isVisible = false;

    // We track target mouse coordinates and lerping coordinates independently
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    const updateCursor = () => {
        // Toggle visibility
        if (!isVisible) {
            dot.style.display = 'none';
            ring.style.display = 'none';
        } else {
            dot.style.display = 'block';
            ring.style.display = 'block';
        }

        // Apply instant position for dot
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;

        // Lerp position for ring (creates trailing effect)
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        
        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;

        // Manage state classes for size animations
        if (isClicking) {
            dot.classList.add('clicking');
            dot.classList.remove('pointer');
            ring.classList.add('clicking');
            ring.classList.remove('pointer');
        } else if (isPointer) {
            dot.classList.add('pointer');
            dot.classList.remove('clicking');
            ring.classList.add('pointer');
            ring.classList.remove('clicking');
        } else {
            dot.classList.remove('pointer', 'clicking');
            ring.classList.remove('pointer', 'clicking');
        }

        requestAnimationFrame(updateCursor);
    };

    requestAnimationFrame(updateCursor);

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isVisible = true;

        const target = e.target;
        // Check for interactive elements
        isPointer = 
            target.tagName === "BUTTON" ||
            target.tagName === "A" ||
            target.tagName === "INPUT" ||
            target.closest("button") ||
            target.closest("a") ||
            target.closest('.btn') ||
            target.closest('[role="button"]') ||
            target.closest('[data-clickable="true"]') ||
            window.getComputedStyle(target).cursor === "pointer";
    });

    document.addEventListener('mousedown', () => isClicking = true);
    document.addEventListener('mouseup', () => isClicking = false);
    
    document.documentElement.addEventListener('mouseleave', () => { isVisible = false; });
    document.documentElement.addEventListener('mouseenter', () => { isVisible = true; });
});
