import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const posts = [
  {
    title: "Tại sao tôi bắt đầu viết blog sau 5 năm trì hoãn",
    slug: "tai-sao-toi-bat-dau-viet-blog",
    excerpt: "Năm năm nghĩ về việc viết, một ngày quyết định bắt đầu. Không cần hoàn hảo, chỉ cần thật.",
    coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80",
    tags: "cuộc sống,suy nghĩ",
    content: `<h2>Năm năm trì hoãn</h2>
<p>Tôi đã nghĩ về việc viết blog từ năm 2019. Mỗi lần mở máy tính ra, tôi lại tự hỏi: viết gì? Ai sẽ đọc? Có đủ giỏi để viết không?</p>
<p>Những câu hỏi đó giết chết ý tưởng trước khi nó kịp thở.</p>
<h2>Điều thay đổi tôi</h2>
<p>Một ngày cuối năm ngoái, tôi đọc lại nhật ký cũ từ năm 2018. Những suy nghĩ lúc đó — về công việc, về mối quan hệ, về những điều tôi đang học — đều rất thú vị với tôi của hiện tại.</p>
<blockquote>Viết không phải để người khác đọc. Viết để bản thân mình sau này đọc lại.</blockquote>
<p>Câu đó thay đổi mọi thứ. Tôi không cần phải giỏi. Tôi chỉ cần thật.</p>
<h2>Và thế là tôi bắt đầu</h2>
<p>Không có kế hoạch lớn. Không có chiến lược nội dung. Chỉ là mở ra và viết những gì đang nghĩ.</p>
<p>Nếu bạn cũng đang trì hoãn việc viết — hãy bắt đầu hôm nay. Bài đầu tiên không cần hay. Nó chỉ cần tồn tại.</p>`,
    status: "published",
    publishedAt: new Date("2024-11-15"),
  },
  {
    title: "Những công cụ giúp tôi làm việc hiệu quả hơn năm 2024",
    slug: "cong-cu-lam-viec-hieu-qua-2024",
    excerpt: "Từ Obsidian đến Linear, những thứ thực sự thay đổi cách tôi làm việc — và những thứ chỉ là hype.",
    coverImage: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80",
    tags: "công nghệ,năng suất",
    content: `<h2>Không phải mọi tool đều cần thiết</h2>
<p>Tôi đã thử rất nhiều công cụ trong năm nay. Notion, Obsidian, Roam, Logseq... Cuối cùng tôi nhận ra mình đang dành nhiều thời gian <em>setup tool</em> hơn là thực sự làm việc.</p>
<h2>Những gì thực sự dùng hàng ngày</h2>
<ul>
<li><strong>Obsidian</strong> — note-taking, linked thinking. Không phải vì nó fancy mà vì file markdown lưu local, không lo mất data.</li>
<li><strong>Linear</strong> — quản lý task ở công ty. Nhanh, đẹp, không phức tạp như Jira.</li>
<li><strong>Raycast</strong> — spotlight replacement trên Mac. Thay đổi cách tôi dùng máy tính.</li>
<li><strong>Arc Browser</strong> — browser với spaces và sidebar. Lạ lúc đầu, quen rồi không dùng được Chrome nữa.</li>
</ul>
<h2>Những gì tôi bỏ đi</h2>
<p>Notion — quá chậm, quá nhiều tính năng. Todoist — quá đơn giản cho project lớn. Slack — thay bằng Discord cho team nhỏ.</p>
<p>Bài học: Tool tốt nhất là tool bạn thực sự dùng, không phải tool nhiều người nói hay nhất.</p>`,
    status: "published",
    publishedAt: new Date("2024-10-20"),
  },
  {
    title: "Ba tháng học tiếng Nhật — thực tế không như quảng cáo",
    slug: "ba-thang-hoc-tieng-nhat",
    excerpt: "Duolingo streak 90 ngày, Anki mỗi sáng, podcast tiếng Nhật khi đi bộ. Tôi đã ở đâu sau 3 tháng?",
    coverImage: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80",
    tags: "học tập,cuộc sống",
    content: `<h2>Tại sao tiếng Nhật?</h2>
<p>Không có lý do đặc biệt. Tôi xem anime từ nhỏ, thấy tiếng Nhật nghe hay. Và một ngày tôi muốn thử xem mình có thể học ngôn ngữ mới ở tuổi 27 không.</p>
<h2>Những gì tôi làm</h2>
<p>Tháng đầu: Duolingo mỗi ngày + học hiragana/katakana. Tháng hai: thêm Anki flashcard 20 từ/ngày. Tháng ba: podcast JapanesePod101 khi đi bộ.</p>
<h2>Thực tế sau 3 tháng</h2>
<p>Đọc được hiragana và katakana — check. Biết khoảng 200 từ vựng cơ bản — check. Hiểu câu đơn giản — gần được. Nghe người Nhật nói chuyện thật — <strong>gần như không hiểu gì</strong>.</p>
<blockquote>Học ngôn ngữ không phải sprint. Nó là marathon mà bạn phải thích chạy.</blockquote>
<p>Tôi vẫn đang tiếp tục. Không vì thấy tiến bộ nhanh, mà vì thấy vui.</p>`,
    status: "published",
    publishedAt: new Date("2024-09-05"),
  },
  {
    title: "Tôi đã đọc 24 cuốn sách trong năm nay — đây là 5 cuốn hay nhất",
    slug: "24-cuon-sach-5-cuon-hay-nhat",
    excerpt: "Không phải sách nào cũng xứng đáng với thời gian bạn bỏ ra. Đây là những cuốn thực sự thay đổi cách tôi nghĩ.",
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
    tags: "sách,suy nghĩ",
    content: `<h2>Tại sao đọc nhiều không luôn tốt hơn đọc ít</h2>
<p>Năm ngoái tôi đọc 24 cuốn nhưng nhớ được nội dung của... khoảng 8 cuốn. Điều đó khiến tôi nghĩ lại về cách đọc sách.</p>
<h2>5 cuốn thực sự để lại dấu ấn</h2>
<ul>
<li><strong>Four Thousand Weeks</strong> — Oliver Burkeman. Thay đổi cách tôi nghĩ về thời gian và năng suất.</li>
<li><strong>The Creative Act</strong> — Rick Rubin. Về sự sáng tạo, không chỉ dành cho nghệ sĩ.</li>
<li><strong>A Man Called Ove</strong> — Fredrik Backman. Tiểu thuyết. Tôi khóc ở chỗ không ngờ nhất.</li>
<li><strong>Thinking in Systems</strong> — Donella Meadows. Nhìn thế giới theo hệ thống, mọi thứ thay đổi.</li>
<li><strong>Educated</strong> — Tara Westover. Memoir. Không thể đặt xuống.</li>
</ul>
<h2>Cách tôi đọc khác đi từ bây giờ</h2>
<p>Đọc chậm hơn, ghi chú nhiều hơn, và cho phép bản thân bỏ sách không hay giữa chừng. Thời gian là có hạn.</p>`,
    status: "published",
    publishedAt: new Date("2024-08-12"),
  },
  {
    title: "Remote work sau 2 năm — những điều không ai nói với bạn",
    slug: "remote-work-sau-2-nam",
    excerpt: "Làm việc từ xa nghe tuyệt vời trên lý thuyết. Thực tế có những thách thức mà tôi không chuẩn bị trước.",
    coverImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80",
    tags: "công việc,cuộc sống",
    content: `<h2>Hai năm không đi office</h2>
<p>Từ năm 2022, tôi làm remote hoàn toàn. Lúc đầu tưởng như giấc mơ — không kẹt xe, không ăn trưa awkward với đồng nghiệp, không họp vô nghĩa.</p>
<h2>Những gì không ai nói</h2>
<p><strong>Ranh giới công việc - cuộc sống mờ đi</strong>. Khi nhà là office, bạn không bao giờ thực sự "rời office". Laptop luôn ở đó, Slack luôn có thể ping.</p>
<p><strong>Cô đơn thật sự</strong>. Không phải cô đơn vì không có ai, mà cô đơn vì thiếu những tương tác ngẫu nhiên, tự nhiên của môi trường office.</p>
<p><strong>Tự kỷ luật khó hơn tưởng</strong>. Không có ai nhìn màn hình bạn, không có peer pressure. Chỉ có bạn và ý chí.</p>
<h2>Những gì tôi làm để giải quyết</h2>
<p>Đặt giờ kết thúc cứng — 6pm máy tính tắt. Đi cafe làm việc ít nhất 2 lần/tuần. Đăng ký class gym buổi sáng để có lý do ra khỏi nhà.</p>
<blockquote>Remote work không phải tự do. Nó là trách nhiệm nhiều hơn.</blockquote>`,
    status: "published",
    publishedAt: new Date("2024-07-01"),
  },
  {
    title: "Chạy bộ đã thay đổi não tôi như thế nào",
    slug: "chay-bo-thay-doi-nao-toi",
    excerpt: "Không phải để giảm cân. Không phải để khỏe hơn. Tôi chạy vì đó là lúc duy nhất trong ngày không ai có thể liên lạc với tôi.",
    coverImage: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80",
    tags: "sức khỏe,cuộc sống",
    content: `<h2>Tôi ghét chạy bộ</h2>
<p>Tôi ghét chạy bộ cho đến tháng 3 năm ngoái. Lúc đó tôi đang căng thẳng cực độ, deadline dồn dập, và một buổi tối tôi quyết định đi ra đường chạy thay vì ngồi cuộn TikTok.</p>
<p>Tôi chạy 2km rồi đứt hơi. Nhưng khi về nhà, đầu óc nhẹ hẳn.</p>
<h2>Khoa học đằng sau cảm giác đó</h2>
<p>BDNF — Brain-Derived Neurotrophic Factor — tăng khi bạn tập aerobic. Nó giúp tạo kết nối neuron mới, cải thiện trí nhớ và khả năng học hỏi. Người ta gọi nó là "Miracle-Gro for the brain".</p>
<h2>6 tháng sau</h2>
<p>Tôi chạy 5km mỗi sáng, 4-5 lần/tuần. Không phải vì kỷ luật. Mà vì thiếu chạy, ngày hôm đó tôi cảm thấy thiếu thiếu gì đó.</p>
<p>Não tôi thay đổi. Tôi tập trung tốt hơn, ít lo lắng hơn, ngủ ngon hơn.</p>
<p>Nếu bạn chưa có thói quen thể thao — thử chạy bộ. Không cần xa. Chỉ cần ra khỏi nhà.</p>`,
    status: "published",
    publishedAt: new Date("2024-06-10"),
  },
];

async function main() {
  console.log("Đang xóa dữ liệu cũ...");
  await prisma.post.deleteMany();

  console.log("Đang tạo bài viết mẫu...");
  for (const post of posts) {
    await prisma.post.create({ data: post });
    console.log(`  ✓ ${post.title}`);
  }

  console.log(`\nDone! Đã tạo ${posts.length} bài viết.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
