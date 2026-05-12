import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Calendar, BookOpen } from "lucide-react";
import { useI18n } from "@/context/I18nContext";
import { api, unwrap } from "@/lib/api";

interface BlogPostType {
  _id?: string;
  id?: string;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  author?: string;
  category?: string;
  image?: string;
  featured_image?: string;
  createdAt?: string;
}

const FALLBACK: BlogPostType[] = [
  {
    slug: "why-organic-fertilizer-matters",
    title: "Why organic fertilizer matters for your soil",
    excerpt: "Healthy soil is the foundation of healthy food. Here's how organic inputs restore microbial life.",
    category: "Soil Science",
    createdAt: "2026-04-12",
    content: "Soil isn't just dirt — it's a living ecosystem. Organic fertilizers feed the soil, not just the plant. Over seasons this builds humus, improves water retention, and reduces irrigation needs.",
  },
  {
    slug: "vermicompost-guide",
    title: "A beginner's guide to vermicompost",
    excerpt: "Earthworms are the silent heroes of organic farming.",
    category: "Guides",
    createdAt: "2026-04-02",
    content: "Vermicompost contains 5x more nitrogen, 7x more phosphorus, and 11x more potassium than ordinary soil.",
  },
];

const fetchBlogs = async (): Promise<BlogPostType[]> => {
  try {
    const data = unwrap<any>(await api.get("/api/blogs"));
    const list = Array.isArray(data) ? data : data?.blogs || [];
    return list.length ? list : FALLBACK;
  } catch {
    return FALLBACK;
  }
};

const fetchBlog = async (slug: string): Promise<BlogPostType | null> => {
  try {
    return unwrap<BlogPostType>(await api.get(`/api/blogs/${slug}`));
  } catch {
    return FALLBACK.find((p) => p.slug === slug) || null;
  }
};

const fmt = (d?: string) => (d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "");

export const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useQuery({
    queryKey: ["blog", slug],
    queryFn: () => fetchBlog(slug!),
    enabled: !!slug,
  });

  if (isLoading) return <div className="container-wide py-20 text-center">Loading...</div>;
  if (!post) return (
    <div className="container-wide py-20 text-center">
      <p>Post not found.</p>
      <Link to="/blog" className="text-primary underline">Back to blog</Link>
    </div>
  );

  return (
    <article className="container-wide py-12 max-w-3xl">
      <Link to="/blog" className="text-sm text-primary hover:underline">← Back to blog</Link>
      <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
        {post.category && <span className="bg-secondary px-2 py-0.5 rounded-full font-medium">{post.category}</span>}
        {post.createdAt && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {fmt(post.createdAt)}</span>}
      </div>
      <h1 className="font-display text-3xl md:text-5xl font-bold mt-3 leading-tight">{post.title}</h1>
      {post.excerpt && <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{post.excerpt}</p>}
      {(post.featured_image || post.image) && (
        <img src={post.featured_image || post.image} alt={post.title} className="mt-6 w-full rounded-2xl aspect-video object-cover" />
      )}
      <div className="mt-8 prose prose-lg max-w-none text-foreground leading-relaxed whitespace-pre-wrap">{post.content}</div>
    </article>
  );
};


const Blog = () => {
  const { data: posts, isLoading } = useQuery({ queryKey: ["blogs"], queryFn: fetchBlogs });
  const { t } = useI18n();

  return (
    <>
      <section className="bg-hero text-primary-foreground">
        <div className="container-wide py-14 md:py-20">
          <span className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur px-4 py-1.5 rounded-full text-xs uppercase tracking-[0.18em]">
            <BookOpen className="h-3.5 w-3.5 text-accent" /> {t("blog.knowledge_center")}
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold mt-5">{t("blog.title")}</h1>
          <p className="mt-3 max-w-2xl opacity-90">{t("blog.subtitle")}</p>
        </div>
      </section>

      <section className="container-wide py-16 grid md:grid-cols-2 gap-6">
        {isLoading && <p className="text-muted-foreground">{t("blog.loading")}</p>}
        {(posts || []).map((p) => (
          <Link
            key={p.slug || p._id || p.id}
            to={`/blog/${p.slug}`}
            className="group p-4 md:p-6 rounded-3xl border border-border bg-card hover:border-primary hover:shadow-elegant transition-all duration-300 flex flex-col md:flex-row gap-6"
          >
            {(p.featured_image || p.image) && (
              <div className="w-full md:w-56 h-48 md:h-auto shrink-0 overflow-hidden rounded-2xl bg-muted">
                <img
                  src={p.featured_image || p.image}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            <div className="flex-1 flex flex-col py-1">
              <div className="flex items-center gap-3 text-xs mb-4">
                {p.category && (
                  <span className="bg-accent/10 text-accent-foreground px-3 py-1 rounded-lg font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {p.category}
                  </span>
                )}
              </div>
              <h2 className="font-display text-2xl font-bold group-hover:text-primary transition-smooth line-clamp-2 leading-tight">
                {p.title}
              </h2>
              {p.excerpt && (
                <p className="mt-3 text-muted-foreground line-clamp-2 text-sm leading-relaxed flex-1">
                  {p.excerpt}
                </p>
              )}
              
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-bold text-foreground">{p.author || "Nisarg Team"}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {fmt(p.createdAt)}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                  {t("blog.read_more")} <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-smooth" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
};

export default Blog;
