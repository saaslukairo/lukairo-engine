export const meta = () => {
  return [
    { title: "LUKAIRO | Plug-and-Play Growth Engines" },
    { name: "description", content: "We build and run revenue systems." },
  ];
};

export default function Home() {
  return (
    <>
      <link rel="stylesheet" href="/css/hero.css" />

      <section className="globe-stage">
        <canvas id="globe"></canvas>

        <div className="hero-overlay">
          <h1>We build and run revenue systems.</h1>
          <p>We connect execution, systems, and growth into a single operating layer.</p>
          <span>From direct sales floors to elite SaaS and enterprise GTM.</span>
        </div>
      </section>

      <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r167/three.min.js"></script>
      <script src="/js/hero-globe.js"></script>
    </>
  );
}
