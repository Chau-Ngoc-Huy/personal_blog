import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Tạo tags trước
const tagNames = ["cuộc sống", "suy nghĩ", "công nghệ", "năng suất", "sức khỏe"];

const posts = [
  {
    title: "Tại sao tôi bắt đầu viết blog sau 5 năm trì hoãn",
    slug: "tai-sao-toi-bat-dau-viet-blog",
    excerpt: "Năm năm nghĩ về việc viết, một ngày quyết định bắt đầu. Không cần hoàn hảo, chỉ cần thật.",
    coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80",
    tags: ["cuộc sống", "suy nghĩ"],
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
    tags: ["công nghệ", "năng suất"],
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
    title: "Chạy bộ đã thay đổi não tôi như thế nào",
    slug: "chay-bo-thay-doi-nao-toi",
    excerpt: "Không phải để giảm cân. Không phải để khỏe hơn. Tôi chạy vì đó là lúc duy nhất trong ngày không ai có thể liên lạc với tôi.",
    coverImage: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80",
    tags: ["sức khỏe", "cuộc sống"],
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
  await prisma.tag.deleteMany();

  console.log("Đang tạo tags...");
  for (const tagName of tagNames) {
    await prisma.tag.create({
      data: {
        name: tagName,
        slug: tagName.toLowerCase().replace(/\s+/g, "-"),
      },
    });
    console.log(`  ✓ ${tagName}`);
  }

  console.log("Đang tạo bài viết mẫu...");
  for (const post of posts) {
    await prisma.post.create({
      data: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        content: post.content,
        status: post.status,
        publishedAt: post.publishedAt,
        tags: {
          connect: post.tags.map((tagName) => ({ name: tagName })),
        },
      },
    });
    console.log(`  ✓ ${post.title}`);
  }

  console.log(`\nDone! Đã tạo ${posts.length} bài viết.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
