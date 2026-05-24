export const fadeUpVariant = {
  hidden: { opacity: 0, y: 40 },

  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      delay,
    },
  }),
};
