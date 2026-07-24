import React, { useEffect } from 'react';

const NavbarAlignmentDetector = ({ navbarRef }) => {
  useEffect(() => {
    if (import.meta.env.DEV && navbarRef?.current) {
      const handleAlignmentCheck = () => {
        const rect = navbarRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const expectedCenter = viewportWidth / 2;
        const actualCenter = rect.left + rect.width / 2;
        const offset = Math.abs(expectedCenter - actualCenter);

        if (offset > 1.0) {
          console.warn(
            `[NavbarAlignmentDetector] Navbar is slightly misaligned by ${offset.toFixed(2)}px from the viewport center.`
          );
        } else {
          console.log(
            `[NavbarAlignmentDetector] Navbar layout is perfectly aligned (offset: ${offset.toFixed(2)}px).`
          );
        }
      };

      // Perform initial check and register listener
      handleAlignmentCheck();
      window.addEventListener('resize', handleAlignmentCheck);
      return () => window.removeEventListener('resize', handleAlignmentCheck);
    }
  }, [navbarRef]);

  return null; // Silent developer utility, does not affect the DOM tree visually
};

export default NavbarAlignmentDetector;
