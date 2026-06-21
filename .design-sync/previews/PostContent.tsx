import { PostContent } from "blog-scaffold";

const headings = [
  { id: "the-problem-with-monday", text: "The problem with Monday", level: 2 },
  { id: "the-twenty-minute-pass", text: "The twenty-minute pass", level: 2 },
  { id: "step-one-clear-the-deck", text: "Step one: clear the deck", level: 3 },
  { id: "step-two-pick-three", text: "Step two: pick three", level: 3 },
  { id: "what-i-stopped-doing", text: "What I stopped doing", level: 2 },
];

const contentWithIds = `
  <h2 id="the-problem-with-monday">The problem with Monday</h2>
  <p>For years my weeks started the same way: I'd open a backlog of forty-odd tasks, feel a small wave of dread, and start clicking around until something felt urgent enough to do. By Wednesday the plan had quietly fallen apart, and by Friday I couldn't have told you what I'd actually accomplished.</p>
  <p>The fix wasn't a better app. It was a shorter ritual — one I could finish before my coffee went cold.</p>
  <blockquote>A plan you can redo in twenty minutes is a plan you'll actually keep. A plan that takes an hour is a plan you'll abandon by February.</blockquote>

  <h2 id="the-twenty-minute-pass">The twenty-minute pass</h2>
  <p>Every Sunday evening I set a timer for twenty minutes and do exactly two things. That constraint is the whole point: the timer keeps me from gold-plating a system instead of doing the work it's meant to support.</p>

  <h3 id="step-one-clear-the-deck">Step one: clear the deck</h3>
  <p>I move everything that's done into an archive and re-read what's left out loud. Anything that's been sitting untouched for three weeks gets a blunt question: <code>is this still true?</code> Most of the time it isn't, and I delete it without ceremony.</p>
  <ul>
    <li>Archive what's finished — it's motivating to see the pile shrink.</li>
    <li>Delete the stale "maybe someday" items; they're just guilt with a due date.</li>
    <li>Group the survivors by the project they belong to.</li>
  </ul>

  <h3 id="step-two-pick-three">Step two: pick three</h3>
  <p>From whatever's left, I choose three outcomes for the week — not tasks, outcomes. "Ship the onboarding email" beats "work on email" because I can tell, on Friday, whether it happened.</p>

  <h2 id="what-i-stopped-doing">What I stopped doing</h2>
  <p>The biggest change wasn't something I added. It was the colour-coded calendar, the daily re-planning, and the nagging sense that a perfect system was one tweak away. Twenty minutes, three outcomes, then back to living the week instead of arranging it.</p>
`;

const excerpt =
  "A lightweight ritual for turning a messy backlog into a calm, realistic week — no fancy app, no colour-coded calendar, just a timer and three honest questions.";

export function WithTOC() {
  return (
    <PostContent
      excerpt={excerpt}
      contentWithIds={contentWithIds}
      headings={headings}
      showTOC={true}
    />
  );
}

export function NoTOC() {
  return (
    <PostContent
      excerpt={excerpt}
      contentWithIds={contentWithIds}
      headings={headings}
      showTOC={false}
    />
  );
}
