import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);


type AnimationProps = gsap.TweenVars;
type ScrollProps = ScrollTrigger.Vars;

export const animateWithGsap = (
  target: string | Element | Element[] | null, // Flexible for DOM or selectors
  animationProps: AnimationProps,
  scrollProps?: ScrollProps
) => {
  if (!target) return; // Ensure target exists
  gsap.to(target, {
    ...animationProps,
    scrollTrigger: {
      trigger: target,
      toggleActions: "restart reverse restart reverse",
      start: "top 85%",
      ...scrollProps,
    },
  });
};

export const animateWithGsapTimeline = (
  timeline: gsap.core.Timeline,
  rotationRef: React.MutableRefObject<THREE.Object3D | null>, // Assuming Three.js
  rotationState: number,
  firstTarget: string | Element | Element[] | null,
  secondTarget: string | Element | Element[] | null,
  animationProps: AnimationProps
) => {
  if (!rotationRef.current) return; // Ensure rotationRef exists

  timeline.to(rotationRef.current.rotation, {
    y: rotationState,
    duration: 1,
    ease: "power2.inOut",
  });

  if (firstTarget) {
    timeline.to(
      firstTarget,
      {
        ...animationProps,
        ease: "power2.inOut",
      },
      "<"
    );
  }

  if (secondTarget) {
    timeline.to(
      secondTarget,
      {
        ...animationProps,
        ease: "power2.inOut",
      },
      "<"
    );
  }
};