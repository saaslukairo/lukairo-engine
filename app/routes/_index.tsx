import { useEffect } from "react";

export const meta = () => {
  return [
    { title: "LUKAIRO | Plug-and-Play Growth Engines" },
    { name: "description", content: "We build and run revenue systems." },
  ];
};

export default function Index() {
  useEffect(() => {
    const threeScript = document.createElement("script");
    threeScript.src =
      "https://cdnjs.cloudflare.com/ajax/libs/three.js/r167/three.min.js";
    threeScript.async = true;

    const globeScript = document.createElement("script");
    globeScript.src = "/js/hero-globe.js";
    globeScript.async = true;

    threeScript.onload = () => {
      document.body.appendChild(globeScript);
    };

    document.body.appendChild(threeScript);

    return () => {
      globeScript.remove();
      threeScript.remove();
    };
  }, []);

  return (
    <>
      <link rel="stylesheet" href="/css/hero.css" />

      <section className="globe-stage">
        <canvas id="globe"></canvas>

        <div className="hero-overlay">
          <h1>We build and run revenue systems.</h1>
          <p>
            We connect execution, systems, and growth into a single operating
            layer.
          </p>
          <span>
            From direct sales floors to elite SaaS and enterprise GTM.
          </span>
        </div>
      </section>
    </>
  );
}
