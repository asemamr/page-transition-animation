let linkArrow = document.querySelector("body > a");

let tlLeave = gsap.timeline({
  defaults: { duration: 0.75, ease: "Power2.easeOut" },
});
let tlEnter = gsap.timeline({
  defaults: { duration: 0.75, ease: "Power2.easeOut" },
});

//set animation for the previous page by sing greensock library
function leaveAnimation(current, done) {
  let image = current.querySelector(".image-container");
  let text = current.querySelector(".content");
  let circles = current.querySelectorAll(".circle");

  gsap.fromTo(
    image,
    { y: 0, opacity: 1 },
    { y: 70, opacity: 0, duration: 0.75, ease: "Power2.easeOut" }
  );
  gsap.fromTo(
    text,
    { y: 0, opacity: 1 },
    {
      y: -70,
      opacity: 0,
      onComplete: done,
      duration: 0.75,
      ease: "Power2.easeOut",
    }
  );
  gsap.fromTo(
    circles,
    { y: 0, opacity: 1 },
    { y: -200, opacity: 0, stagger: 0.2, duration: 1, ease: "back.out(4, 2)" }
  );
}

//set animation for the next page
function enterAnimation(next, gradient) {
  let image = next.querySelector(".image-container");
  let text = next.querySelector(".content");
  let circles = next.querySelectorAll(".circle");
  // back.out(4, 2)
  gsap.fromTo(
    image,
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.75, ease: "Power2.easeOut" }
  );
  gsap.fromTo(
    text,
    { y: -50, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.75, ease: "Power2.easeOut" }
  );
  gsap.to("body", {
    background: gradient,
    duration: 0.75,
    ease: "Power2.easeOut",
  });
  gsap.fromTo(
    circles,
    { y: -200, opacity: 0 },
    { y: 0, opacity: 1, stagger: 0.2, duration: 1, ease: "back.out(4, 2)" }
  );
}

//set the transition between the pages by using barba library
barba.init({
  preventRunning: true,
  transitions: [
    {
      name: "default",
      //once is the first that the browser loaded
      once(data) {
        let gradient = getGradient(data.next.namespace);
        gsap.set("body", { background: gradient });
      },
      //leave is the previous page
      leave(data) {
        let done = this.async();
        let current = data.current.container;
        leaveAnimation(current, done);
      },
      //enter is the next page
      enter(data) {
        let next = data.next.container;
        let gradient = getGradient(data.next.namespace);

        linkArrow.href = next.dataset.link;
        enterAnimation(next, gradient);
      },
    },
    {
      name: "product transition",
      from: { namespace: ["handbag", "boot", "hat"]},
      to: { namespace: ["product"]},
      leave(data) {
        let done = this.async();
        let current = data.current.container;
        leaveProductAnimation(current, done);
      },
      enter(data) {
        let next = data.next.container;
        enterProductAnimation(next);
      },
    },
    {
      name: "revert transition",
      from: { namespace: ["product"]},
      to: { namespace: ["handbag"]},
      leave(data) {
        let current = data.current.container;
        gsap.fromTo(current, {y: "100%,"}, {y: "0%"});
        let gradient = getGradient(data.next.namespace);
        gsap.set("body", { background: gradient });
      },
      enter(data) {
        let next = data.next.container;
        gsap.fromTo(next, {y: "-100%"}, {y: "0%"});
      },
    },
  ],
});

let button = document.querySelector(".content button");

//change the background for every page
function getGradient(name) {
  switch (name) {
    case "handbag":
      return "linear-gradient(260deg, #b75d62, #754d4f)";
    case "boot":
      return "linear-gradient(260deg, #5d8cb7, #4c4f17)";
    case "hat":
      return "linear-gradient(260deg, #b27a5c, #7f5450)";
  }
}

function leaveProductAnimation(current, done) {
  tlLeave.fromTo(
    current,
    { y: "0%"},
    { y: "-110%", onStart: done});
};

function enterProductAnimation(next) {
  tlLeave.fromTo(next, { y: "100%" }, { y: "0%" },"<");
  tlLeave.fromTo(
    ".product-gallery .card",
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      stagger: 0.1
    },
  );
}