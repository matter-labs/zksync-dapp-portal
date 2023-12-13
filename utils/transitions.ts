export const TransitionAlertScaleInOutTransition = {
  enterActiveClass: "transition ease duration-200",
  enterFromClass: "opacity-0 scale-95",
  enterToClass: "opacity-100 scale-100",
  leaveActiveClass: "transition ease duration-50",
  leaveFromClass: "opacity-100 scale-100",
  leaveToClass: "opacity-0 scale-95",
};

export const TransitionOpacity = (durationIn = 200, durationOut = 50) => ({
  enterActiveClass: `transition ease-in duration-[${durationIn}ms]`,
  enterFromClass: "opacity-0",
  enterToClass: "opacity-100",
  leaveActiveClass: `transition ease-in duration-[${durationOut}ms]`,
  leaveFromClass: "opacity-100",
  leaveToClass: "opacity-0",
});

export const TransitionPrimaryButtonText = {
  enterActiveClass: "transition transform ease-in duration-150",
  enterFromClass: "-translate-y-3 opacity-0",
  enterToClass: "translate-y-0",
  leaveActiveClass: "transition transform ease-in duration-100",
  leaveFromClass: "translate-y-0 opacity-100",
  leaveToClass: "translate-y-3 opacity-0",
};
