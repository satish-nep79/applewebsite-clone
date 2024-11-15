import { GSAPTimeline } from "gsap";

interface AnimationProps {
  [key: string]: any;
}

export const animateWithGsapTimeline = (
  timeline: GSAPTimeline,
  rotationRef: React.RefObject<any>,
  rotationState: { y: number },
  firstTarget: HTMLElement,
  secondTarget: HTMLElement,
  animationProps: AnimationProps
) => {
  timeline.to(rotationRef.current.rotation, {
    y: rotationState.y,
    duration: 1,
    ease: "power2.out",
  });

  timeline.to(
    firstTarget,
    {
      ...animationProps,
      ease: "power2.out",
    },
    "<"
  );

  if (secondTarget) {
    timeline.to(
      secondTarget,
      {
        ...animationProps,
        ease: "power2.out",
      },
      "<"
    );
  }
};
