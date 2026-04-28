import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ── Admin profile (from Ali Abdaal's page) ─────────────────
const profile = {
  displayName: "Ali Abdaal",
  sayHi: "I'm a doctor turned entrepreneur, author, and content creator.\n\nI spent 6 years studying medicine at Cambridge before realising my passion was in helping people learn more effectively and live more intentionally.\n\nI write about productivity, business, books, and building a life you love — through weekly essays, videos, and a podcast listened to by millions.",
  bio: "I started my YouTube channel in 2017 as a side project while working as a doctor. It quickly grew to millions of subscribers, which allowed me to leave medicine and focus on content creation full-time. Since then, I've published two best-selling books, launched an online course, and built a business around helping people learn and grow.",
  avatar: "/images/hero-ali.png",
  email: "ali@aliabdaal.com",
  socialLinks: JSON.stringify({
    twitter:  "https://x.com/aliabdaal",
    github:   "https://github.com/aliabdaal",
    linkedin: "https://www.linkedin.com/in/ali-abdaal/",
  }),
};

// ── Tags (from mega-menu topics in the HTML) ───────────────
const tags = [
  { name: "Productivity", slug: "productivity", color: "#5DCDF1" },
  { name: "YouTube",      slug: "youtube",      color: "#FD976D" },
  { name: "Studying",     slug: "studying",      color: "#79D287" },
  { name: "Books",        slug: "books",         color: "#38BD37" },
  { name: "Business",     slug: "business",      color: "#C9B1FB" },
];

// ── Posts (titles from the homepage carousel in the HTML) ──
const posts = [
  {
    title: "I Tried AI as a Life Coach for 365 Days – Here's What I Learned",
    slug: "i-tried-ai-as-a-life-coach-for-365-days",
    excerpt:
      "A full year of using AI to help me make decisions, reflect on my week, and plan my future. Here are the honest results — the good, the bad, and the surprising.",
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    tags: ["Productivity", "Business"],
    publishedAt: new Date("2025-05-31"),
    content: `<h2>Why I decided to try this</h2>
<p>At the start of 2024, I was overwhelmed. My to-do list felt like a second job. I'd been reading about people using AI to manage their lives, and I thought: why not run a real experiment?</p>
<p>For 365 days, every morning I'd open a conversation and describe my goals, anxieties, and plans. Every Sunday I'd do a weekly review with it. Every month I'd ask it to spot patterns I was missing.</p>
<h2>What actually worked</h2>
<p>The biggest surprise was how useful it was for <strong>thinking out loud</strong>. Unlike a journal, the AI asked follow-up questions. "Why do you feel that way?" "What would success look like?" It forced clarity I wasn't getting on my own.</p>
<p>It also helped me notice patterns. After three months it could see I kept setting the same goal — "write more" — without ever making progress. It asked me what the actual obstacle was. Turns out I was waiting to feel "ready." That conversation changed things.</p>
<h2>What didn't work</h2>
<p>Emotional support. AI is not therapy. When I was going through a genuinely hard week, the responses felt hollow. No amount of prompting made it feel warm or human.</p>
<p>It also hallucinated advice sometimes. I'd verify things and find the recommendation was confidently wrong. Never use AI as a substitute for actual experts — doctors, lawyers, financial advisors.</p>
<h2>Would I recommend it?</h2>
<p>Yes — with caveats. Use it as a thinking tool, not an authority. Use it to structure your thoughts, not replace your judgment. And still talk to real humans about the things that matter.</p>`,
  },
  {
    title: "How To Get Rich (Without Getting Lucky)",
    slug: "how-to-get-rich",
    excerpt:
      "Wealth isn't about luck, inheritance, or a single brilliant idea. It's about understanding leverage, specific knowledge, and the patience to compound them over time.",
    coverImage: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80",
    tags: ["Business", "Productivity"],
    publishedAt: new Date("2025-04-18"),
    content: `<h2>The wealth myths we're taught</h2>
<p>We grow up believing wealth comes from one of three things: a high salary, a lucky break, or inheritance. All three are real — but they're not the primary engine of most lasting wealth.</p>
<p>Naval Ravikant put it best: "Seek wealth, not money or status. Wealth is having assets that earn while you sleep."</p>
<h2>Specific knowledge is the moat</h2>
<p>Specific knowledge is knowledge that can't be easily taught or outsourced. It's the unique intersection of your curiosity, your skills, and your experience. For me it's been the overlap of medicine, communication, and technology.</p>
<p>The question to ask yourself: <strong>what can I do that feels like play to me but looks like work to everyone else?</strong></p>
<h2>Leverage multiplies your effort</h2>
<p>There are four types of leverage: labour (people working for you), capital (money working for you), code (software running without you), and media (content reaching millions while you sleep).</p>
<p>The internet democratised the last two. Anyone can publish a video, write a newsletter, or build a product. The barrier to leverage has never been lower.</p>
<h2>The time horizon most people ignore</h2>
<p>Compounding is the eighth wonder of the world — but it requires time. Most people give up after one or two years. The people who get rich are usually the ones who kept going through the boring middle years when nothing seemed to be happening.</p>
<p>Pick a game you can play for 10 years without seeing results. Then play it well.</p>`,
  },
  {
    title: "How I Use AI to Save 10+ Hours Every Week",
    slug: "how-i-use-ai-to-save-10-hours-per-week",
    excerpt:
      "A practical breakdown of every AI tool in my workflow — what I use for writing, research, video production, and inbox management — and the ones I've tried and abandoned.",
    coverImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
    tags: ["Productivity", "YouTube"],
    publishedAt: new Date("2025-02-14"),
    content: `<h2>The honest version of my AI workflow</h2>
<p>Everyone shares their "AI setup" but most of it is theoretical. Here's what I actually use every single week, how long it saves me, and what I've abandoned.</p>
<h2>Writing: Claude for long-form drafts</h2>
<p>I write a rough outline of every essay or script in bullet points. Then I paste it into Claude and ask it to write a first draft in my voice. The draft is usually about 60% usable. I rewrite the rest — but starting from 60% is infinitely better than starting from zero.</p>
<p><strong>Time saved: ~3 hours/week</strong></p>
<h2>Research: Perplexity for fact-checking</h2>
<p>Before I cite any statistic I run it through Perplexity. It shows sources, so I can verify. It's killed several things I was about to say confidently that turned out to be myths.</p>
<p><strong>Time saved: ~1.5 hours/week</strong></p>
<h2>Video: Auto-chapters and thumbnails</h2>
<p>I use AI to generate chapter timestamps from transcripts, suggest thumbnail text from the script, and even flag sections where the pacing drags. None of these are perfect but they speed up the editor's workflow dramatically.</p>
<p><strong>Time saved: ~2 hours/week</strong></p>
<h2>Email: Two-sentence summaries</h2>
<p>My EA uses AI to summarise every email over 200 words into two sentences before it reaches me. I only read the full email if those two sentences suggest I need to.</p>
<p><strong>Time saved: ~1.5 hours/week</strong></p>
<h2>What I've abandoned</h2>
<p>AI scheduling assistants (too many errors, too much back-and-forth to fix them), AI customer support (felt inhuman and annoyed people), and fully AI-generated captions (the tone was always slightly off).</p>`,
  },
  {
    title: "How to Stop Procrastinating and Finally Take Action",
    slug: "how-to-stop-procrastinating",
    excerpt:
      "Procrastination isn't a time-management problem — it's an emotion-regulation problem. Once you understand that, the solutions become much clearer.",
    coverImage: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&q=80",
    tags: ["Productivity", "Studying"],
    publishedAt: new Date("2025-02-07"),
    content: `<h2>Why you procrastinate (hint: it's not laziness)</h2>
<p>Research from psychologists like Fuschia Sirois and Timothy Pychyl has consistently shown that procrastination is not about poor time management — it's about avoiding negative emotions. We put tasks off because they feel anxiety-inducing, boring, frustrating, or overwhelming.</p>
<p>The to-do list app won't fix this. The colour-coded calendar won't fix this. Understanding the emotion will.</p>
<h2>The four emotions behind procrastination</h2>
<ol>
<li><strong>Anxiety</strong> — "What if I fail?" The task represents a test of our abilities.</li>
<li><strong>Boredom</strong> — "This doesn't excite me." The reward feels too abstract and far away.</li>
<li><strong>Resentment</strong> — "I don't want to do this." Someone else assigned it, or we feel it's beneath us.</li>
<li><strong>Self-doubt</strong> — "I'm not capable of this." Perfectionism in disguise.</li>
</ol>
<h2>The solution that actually works: reduce friction, not willpower</h2>
<p>Willpower is a limited resource. Every time you force yourself to "just do it," you drain a battery that doesn't recharge quickly. A much better approach is to make starting so easy that it barely takes any willpower at all.</p>
<p>The two-minute rule: if you can start a task in two minutes or less, start it now. Not finish it — just start. Opening the document is enough. The act of beginning almost always generates momentum.</p>
<h2>Implementation intentions: the research-backed fix</h2>
<p>Studies by Peter Gollwitzer show that forming an "implementation intention" — deciding in advance <em>when</em>, <em>where</em>, and <em>how</em> you'll do something — dramatically increases follow-through. Instead of "I'll work on my project this week," say: "I will work on my project at 9am on Tuesday at my desk before checking email."</p>
<p>Specificity turns a vague intention into a concrete plan your brain can actually follow.</p>`,
  },
  {
    title: "The 5 Key Components for Financial Freedom",
    slug: "5-key-components-financial-freedom",
    excerpt:
      "Financial freedom isn't just about earning more. It's about understanding income, expenses, assets, liabilities, and time — and optimising all five together.",
    coverImage: "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=800&q=80",
    tags: ["Business", "Books"],
    publishedAt: new Date("2025-01-24"),
    content: `<h2>What financial freedom actually means</h2>
<p>Financial freedom doesn't mean being rich. It means having enough passive income to cover your expenses without needing to trade time for money. The target number is different for everyone.</p>
<p>The formula is simple: <strong>passive income ≥ monthly expenses</strong>. When you hit that, you're free — whether that's at £2,000/month or £20,000/month.</p>
<h2>Component 1: Income</h2>
<p>There are two types: active (you work, you get paid) and passive (assets work, you get paid). Most people only ever have active income. Financial freedom requires building passive income streams — investments, rental income, royalties, online businesses.</p>
<h2>Component 2: Expenses</h2>
<p>This is the most underrated lever. Reducing expenses by £500/month has the same effect on your freedom number as increasing passive income by £500/month — but is often much easier to achieve. Most people focus only on the income side.</p>
<h2>Component 3: Savings rate</h2>
<p>Your savings rate — the percentage of income you invest — determines how fast you get there. At a 10% savings rate, it takes about 40 years. At 50%, it takes about 17 years. At 75%, about 7 years. The maths is relentless.</p>
<h2>Component 4: Investment returns</h2>
<p>The S&amp;P 500 has returned an average of 10% annually over the long run. Compound interest at that rate doubles money roughly every 7 years. The key is not to be clever — it's to not be stupid. Low-cost index funds, held for decades, beat most active investors.</p>
<h2>Component 5: Time</h2>
<p>The most valuable resource is time in the market. A 22-year-old investing £300/month will have more at 65 than a 32-year-old investing £1,000/month. Starting early is the single best financial decision most young people can make.</p>`,
  },
  {
    title: "How to Actually Achieve Your Goals in 2025 (Evidence-Based)",
    slug: "how-to-actually-achieve-your-goals",
    excerpt:
      "Most goal-setting advice is folk wisdom. Here's what the research actually says about why we succeed or fail — and the system I use to set goals I actually hit.",
    coverImage: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80",
    tags: ["Productivity", "Books"],
    publishedAt: new Date("2024-12-20"),
    content: `<h2>Why most goal-setting fails</h2>
<p>Every January, millions of people set goals. By February, most have abandoned them. This isn't a character flaw — it's a system flaw. The goals themselves are often set in ways that make failure almost inevitable.</p>
<h2>The research on effective goal-setting</h2>
<p>Edwin Locke's goal-setting theory, backed by 35 years of research, shows that goals work best when they are specific and challenging. Vague goals ("get fit") produce vague results. Specific, hard goals ("run 5km in under 30 minutes by March 31st") produce measurable outcomes.</p>
<p>The key insight: difficult goals generate better performance than easy goals — provided you believe they're achievable. The sweet spot is challenging but credible.</p>
<h2>The system I actually use</h2>
<p>I use a quarterly goals framework. At the start of each quarter, I set three goals across three areas: health, work, and relationships. I write each goal as a specific outcome with a deadline and a measurable metric.</p>
<p>Each week I do a 15-minute review: did I make progress on my three goals this week? If not, why not? What will I do differently?</p>
<h2>The missing ingredient: identity</h2>
<p>James Clear's insight from Atomic Habits: the most effective change happens at the identity level, not the outcome level. Instead of "I want to read 20 books," try "I am a reader." Instead of "I want to exercise," try "I am someone who moves their body every day."</p>
<p>When your goal aligns with who you believe yourself to be, keeping it becomes much easier — because quitting feels like a betrayal of self.</p>`,
  },
  {
    title: "How to Change Your Life with Deep Work (My System)",
    slug: "deep-work-system",
    excerpt:
      "Shallow work is everywhere. The ability to focus without distraction is becoming rare — and increasingly valuable. Here's how I protect time for deep work every day.",
    coverImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
    tags: ["Productivity", "Books"],
    publishedAt: new Date("2024-12-17"),
    content: `<h2>What is deep work?</h2>
<p>Cal Newport defines deep work as "professional activities performed in a state of distraction-free concentration that push your cognitive capabilities to their limit." The opposite is shallow work: emails, meetings, admin — cognitively easy tasks performed while distracted.</p>
<p>Most knowledge workers spend the majority of their day in shallow work. This is a problem — because deep work is where the real value is created.</p>
<h2>Why deep work is getting rarer and more valuable</h2>
<p>The smartphone has made sustained concentration increasingly rare. The same technology that connects us has fragmented our attention. The people who can deliberately choose to focus deeply — and do it for long stretches — will have a meaningful advantage in almost any field.</p>
<h2>My deep work schedule</h2>
<p>I protect 9am–1pm every weekday for deep work. No meetings. Notifications off. Phone in another room. I use a physical timer — not an app — set for 90 minutes. I work on one thing until the timer goes off, then take a 15-minute break.</p>
<p>This wasn't how I started. I started with 25-minute Pomodoros and worked up from there. Don't try to do 4 hours of deep work from day one — build the capacity gradually.</p>
<h2>The shutdown ritual</h2>
<p>At 5pm I do a "shutdown ritual" — I review my task list, check my calendar for tomorrow, and say out loud: "Shutdown complete." This sounds silly, but it signals to my brain that the workday is over. Rumination at night dropped dramatically when I started this.</p>`,
  },
  {
    title: "How I Manage My Time Without Burning Out",
    slug: "time-management-without-burnout",
    excerpt:
      "Hustle culture sold us on the idea that burning out is a badge of honour. I've been there, and I can tell you: it isn't. Here's what actually sustainable productivity looks like.",
    coverImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
    tags: ["Productivity", "Studying"],
    publishedAt: new Date("2024-06-25"),
    content: `<h2>I burned out at 26</h2>
<p>In 2021, I was running a YouTube channel, a podcast, a newsletter, and a course — all while finishing my medical training. I was proud of how much I was doing. Then in November, I couldn't get out of bed for a week.</p>
<p>Burnout doesn't arrive loudly. It creeps in gradually until one day you're completely empty and you can't remember the last time something felt fun.</p>
<h2>The recovery</h2>
<p>I stopped posting for three weeks. I turned down every opportunity. I slept 9 hours a night. I read fiction. I cooked meals slowly. And slowly, the energy came back.</p>
<p>The most important lesson: rest is not the reward for work. Rest is part of the work.</p>
<h2>The system I built after burnout</h2>
<p>I now plan rest with the same intentionality I plan work. Every Sunday I have a complete rest day — no work, no email, no content consumption. Every evening I stop working by 6pm. Every quarter I take a full week off.</p>
<p>These aren't indulgences. They're what makes sustained high performance possible.</p>
<h2>The energy audit</h2>
<p>Once a month I do an energy audit: I look at everything on my plate and ask — does this give me energy or drain it? The things that drain my energy without producing meaningful results get cut or delegated. This keeps the work lean and the motivation high.</p>`,
  },
  {
    title: "The Books That Changed How I Think in 2024",
    slug: "best-books-2024",
    excerpt:
      "My annual reading list — not the most popular books, but the ones that actually changed how I see the world, make decisions, and spend my time.",
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
    tags: ["Books", "Productivity"],
    publishedAt: new Date("2024-12-31"),
    content: `<h2>The rule I use for book recommendations</h2>
<p>I don't recommend books I've just finished. I only recommend books that I'm still thinking about 6 months later. That filter eliminates most things and leaves only the ideas that genuinely stuck.</p>
<h2>The Almanack of Naval Ravikant — Eric Jorgenson</h2>
<p>Naval's ideas on wealth, happiness, and leverage changed how I think about my career. Specifically the idea that specific knowledge — the intersection of your genuine curiosity and skills — is the moat that protects you from competition. This book is free online. There's no excuse not to read it.</p>
<h2>Four Thousand Weeks — Oliver Burkeman</h2>
<p>The average human lifespan is 4,000 weeks. Burkeman argues that our obsession with productivity is itself the problem — because we can never "finish" life. The only sane response is to choose what to be deeply engaged with, and accept that everything else will be left undone. Profoundly freeing.</p>
<h2>The Power of Now — Eckhart Tolle</h2>
<p>I resisted this one for years because it sounded like self-help nonsense. I was wrong. The core idea — that almost all suffering is caused by living in the past or future rather than the present — is something I return to every week.</p>
<h2>Clear Thinking — Shane Parrish</h2>
<p>The most practical book on decision-making I've read. Parrish argues that most of our bad decisions aren't made in dramatic moments — they're made when we're tired, rushed, or emotionally compromised. The solution is to build default behaviours that keep you from making avoidable mistakes.</p>`,
  },
];

// ── Main ───────────────────────────────────────────────────
async function main() {
  console.log("Clearing existing data...");
  // await prisma.post.deleteMany();
  // await prisma.tag.deleteMany();
  // await prisma.adminProfile.deleteMany();

  // ── Profile ──
  console.log("\nCreating demo profile...");
  await prisma.adminProfile.create({ data: profile });
  console.log(`  ✓ ${profile.displayName}`);

  // ── Tags ──
  console.log("\nCreating tags...");
  for (const tag of tags) {
    await prisma.tag.create({ data: tag });
    console.log(`  ✓ ${tag.name}`);
  }

  // ── Posts ──
  console.log("\nCreating posts...");
  for (const post of posts) {
    await prisma.post.create({
      data: {
        title:       post.title,
        slug:        post.slug,
        excerpt:     post.excerpt,
        coverImage:  post.coverImage,
        content:     post.content,
        status:      "published",
        publishedAt: post.publishedAt,
        tags: {
          connect: post.tags.map((name) => ({ name })),
        },
      },
    });
    console.log(`  ✓ ${post.title}`);
  }

  console.log(`\n✅ Done! Created profile, ${tags.length} tags, ${posts.length} posts.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
