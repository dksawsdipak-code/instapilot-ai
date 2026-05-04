'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Edit3,
  Home,
  Instagram,
  Link2,
  Loader2,
  LogOut,
  Plus,
  Sparkles,
  Target,
  Trash2,
} from 'lucide-react';
import { useAuthStore } from '@/lib/auth';

type Post = {
  id: number;
  content: string;
  media_url?: string | null;
  status: string;
  scheduled_at?: string | null;
  published_at?: string | null;
  created_at: string;
};

type ContentIdeas = {
  caption: string;
  hooks: string[];
  hashtags: string[];
  content_pillars: string[];
  ideas: GeneratedIdea[];
  provider: string;
};

type GeneratedIdea = {
  title: string;
  format: string;
  pillar: string;
  hook: string;
  caption: string;
  cta: string;
  hashtags: string[];
};

type CreatorProfile = {
  id: number;
  user_id: number;
  niche: string;
  creator_type: string;
  target_audience: string;
  growth_goal: string;
  brand_tone: string;
  offer: string;
  content_pillars: string;
  created_at: string;
  updated_at: string;
};

const statusStyles: Record<string, string> = {
  draft: 'border-amber-400/30 bg-amber-400/10 text-amber-100',
  scheduled: 'border-sky-400/30 bg-sky-400/10 text-sky-100',
  published: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100',
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, getAuthHeader } = useAuthStore();
  const [niche, setNiche] = useState('fitness coaching');
  const [creatorType, setCreatorType] = useState('coach');
  const [targetAudience, setTargetAudience] = useState('busy professionals');
  const [goal, setGoal] = useState('turn followers into clients');
  const [tone, setTone] = useState('clear and motivating');
  const [offer, setOffer] = useState('');
  const [contentPillars, setContentPillars] = useState('Tips, Behind the scenes, Client wins, Personal lessons');
  const [caption, setCaption] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [ideas, setIdeas] = useState<ContentIdeas | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [profileMessage, setProfileMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated()) return;

    const loadWorkspace = async () => {
      setIsLoadingPosts(true);
      setIsLoadingProfile(true);
      try {
        const [postsResponse, profileResponse] = await Promise.all([
          fetch('/api/posts/posts', {
            headers: getAuthHeader(),
          }),
          fetch('/api/profile/creator', {
            headers: getAuthHeader(),
          }),
        ]);

        if (!postsResponse.ok) throw new Error('Could not load posts');
        if (!profileResponse.ok) throw new Error('Could not load creator profile');

        const loadedPosts = await postsResponse.json();
        const profile = (await profileResponse.json()) as CreatorProfile | null;
        setPosts(loadedPosts);

        if (profile) {
          setNiche(profile.niche || '');
          setCreatorType(profile.creator_type || '');
          setTargetAudience(profile.target_audience || '');
          setGoal(profile.growth_goal || '');
          setTone(profile.brand_tone || '');
          setOffer(profile.offer || '');
          setContentPillars(profile.content_pillars || '');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load workspace');
      } finally {
        setIsLoadingPosts(false);
        setIsLoadingProfile(false);
      }
    };

    loadWorkspace();
  }, [getAuthHeader, isAuthenticated]);

  const saveCreatorProfile = async () => {
    setError('');
    setProfileMessage('');
    setIsSavingProfile(true);

    try {
      const response = await fetch('/api/profile/creator', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          niche,
          creator_type: creatorType,
          target_audience: targetAudience,
          growth_goal: goal,
          brand_tone: tone,
          offer,
          content_pillars: contentPillars,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Could not save creator profile');
      }

      setProfileMessage('Profile saved');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save creator profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  useEffect(() => {
    if (!profileMessage) return;

    const timeout = window.setTimeout(() => {
      setProfileMessage('');
    }, 2500);

    return () => window.clearTimeout(timeout);
  }, [profileMessage]);

  const stats = useMemo(() => {
    const draftCount = posts.filter((post) => post.status === 'draft').length;
    const scheduledCount = posts.filter((post) => post.status === 'scheduled').length;
    const publishedCount = posts.filter((post) => post.status === 'published').length;

    return [
      { label: 'Drafts', value: draftCount, icon: Edit3 },
      { label: 'Scheduled', value: scheduledCount, icon: CalendarClock },
      { label: 'Published', value: publishedCount, icon: CheckCircle2 },
      { label: 'Content Pillars', value: ideas?.content_pillars.length ?? 4, icon: ClipboardList },
    ];
  }, [ideas, posts]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleGenerate = async () => {
    setError('');
    setIsGenerating(true);
    try {
      const response = await fetch('/api/posts/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          niche,
          creator_type: creatorType,
          target_audience: targetAudience,
          goal,
          tone,
          offer,
          content_pillars: contentPillars,
          count: 6,
        }),
      });

      if (!response.ok) throw new Error('Could not generate content ideas');
      const data = await response.json();
      setIdeas(data);
      const firstIdea = data.ideas?.[0];
      setCaption(firstIdea ? `${firstIdea.caption}\n\n${firstIdea.hashtags.join(' ')}` : data.caption);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not generate content ideas');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetComposer = () => {
    setCaption('');
    setMediaUrl('');
    setEditingPostId(null);
  };

  const handleEdit = (post: Post) => {
    setError('');
    setEditingPostId(post.id);
    setCaption(post.content);
    setMediaUrl(post.media_url || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const useIdea = (idea: GeneratedIdea) => {
    setCaption(`${idea.caption}\n\n${idea.hashtags.join(' ')}`);
    setEditingPostId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveDraft = async () => {
    if (!caption.trim()) {
      setError('Write or generate a caption before saving.');
      return;
    }

    setError('');
    setIsSaving(true);
    try {
      const response = await fetch(
        editingPostId ? `/api/posts/posts/${editingPostId}` : '/api/posts/create',
        {
          method: editingPostId ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
          body: JSON.stringify({
            content: caption,
            media_url: mediaUrl || null,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || (editingPostId ? 'Could not update draft' : 'Could not save draft'));
      }

      const post = await response.json();
      setPosts((currentPosts) => {
        if (!editingPostId) return [post, ...currentPosts];
        return currentPosts.map((currentPost) => (currentPost.id === post.id ? post : currentPost));
      });
      resetComposer();
    } catch (err) {
      setError(err instanceof Error ? err.message : editingPostId ? 'Could not update draft' : 'Could not save draft');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (postId: number) => {
    setError('');
    try {
      const response = await fetch(`/api/posts/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeader(),
        },
      });
      if (!response.ok) throw new Error('Could not delete draft');
      setPosts((currentPosts) => currentPosts.filter((post) => post.id !== postId));
      if (editingPostId === postId) resetComposer();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete draft');
    }
  };

  if (!isAuthenticated() || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0b1020] text-white">
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#0b1020]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-primary to-secondary">
              <Instagram size={19} />
            </div>
            <span className="hidden text-xl font-bold sm:inline">InstaPilot AI</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-gray-300 transition hover:border-primary/50 hover:text-white"
              aria-label="Home"
            >
              <Home size={18} />
            </Link>
            <button
              onClick={handleLogout}
              className="flex h-10 items-center gap-2 rounded-lg border border-red-400/40 bg-red-500/10 px-3 text-sm text-red-100 transition hover:bg-red-500/20"
            >
              <LogOut size={17} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-sm text-primary">Creator workspace</p>
            <h1 className="text-3xl font-bold sm:text-4xl">Welcome back, {user.full_name}</h1>
            <p className="mt-3 max-w-2xl text-gray-400">
              Build a repeatable Instagram journey: define the creator, generate post angles,
              save drafts, then connect scheduling and publishing when your content flow is ready.
            </p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-5 font-semibold transition hover:shadow-lg disabled:opacity-60"
          >
            {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            Generate Ideas
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}

        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-gray-400">{stat.label}</p>
                  <Icon className="text-primary" size={20} />
                </div>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Target className="text-primary" size={20} />
                <h2 className="text-xl font-semibold">Creator Profile</h2>
              </div>
              <div className="flex items-center gap-3">
                {isLoadingProfile && <Loader2 className="animate-spin text-primary" size={18} />}
                {profileMessage && <span className="text-sm text-emerald-300">{profileMessage}</span>}
                <button
                  onClick={saveCreatorProfile}
                  disabled={isSavingProfile || isLoadingProfile}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-primary/40 px-4 text-sm font-semibold text-primary transition hover:bg-primary/10 disabled:opacity-60"
                >
                  {isSavingProfile ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                  Save Profile
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Niche', value: niche, setter: setNiche, placeholder: 'beauty, fitness, travel, coaching' },
                { label: 'Creator Type', value: creatorType, setter: setCreatorType, placeholder: 'coach, artist, founder, influencer' },
                { label: 'Target Audience', value: targetAudience, setter: setTargetAudience, placeholder: 'new mothers, founders, students, creators' },
                { label: 'Growth Goal', value: goal, setter: setGoal, placeholder: 'book clients, sell products, grow community' },
                { label: 'Brand Tone', value: tone, setter: setTone, placeholder: 'warm, premium, funny, educational' },
                { label: 'Offer', value: offer, setter: setOffer, placeholder: '1:1 coaching, digital course, product, service' },
                { label: 'Content Pillars', value: contentPillars, setter: setContentPillars, placeholder: 'tips, story, proof, offers' },
              ].map((field) => (
                <label key={field.label} className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-300">{field.label}</span>
                  <input
                    value={field.value}
                    onChange={(event) => field.setter(event.target.value)}
                    placeholder={field.placeholder}
                    className="h-11 w-full rounded-lg border border-white/10 bg-[#11182d] px-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-primary/60"
                  />
                </label>
              ))}
            </div>

            {ideas && (
              <div className="mt-6 space-y-5">
                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-gray-300">Generated Ideas</h3>
                    <span className="rounded-lg border border-white/10 px-2 py-1 text-xs text-gray-400">
                      {ideas.provider === 'openai' ? 'OpenAI' : 'Local fallback'}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {ideas.ideas.map((idea) => (
                      <button
                        key={`${idea.title}-${idea.format}`}
                        onClick={() => useIdea(idea)}
                        className="w-full rounded-lg border border-white/10 bg-[#11182d] px-3 py-3 text-left transition hover:border-primary/50"
                      >
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="rounded-lg border border-primary/30 bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                            {idea.format}
                          </span>
                          <span className="rounded-lg border border-white/10 px-2 py-1 text-xs text-gray-300">
                            {idea.pillar}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-white">{idea.title}</p>
                        <p className="mt-2 text-sm leading-5 text-gray-400">{idea.hook}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold text-gray-300">Active Pillars</h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {ideas.content_pillars.map((pillar) => (
                      <div key={pillar} className="rounded-lg border border-white/10 bg-[#11182d] px-3 py-2 text-sm text-gray-300">
                        {pillar}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Edit3 className="text-primary" size={20} />
                <h2 className="text-xl font-semibold">{editingPostId ? 'Edit Draft' : 'Post Draft'}</h2>
              </div>
              <div className="flex items-center gap-2">
                {editingPostId && (
                  <button
                    onClick={resetComposer}
                    className="h-10 rounded-lg border border-white/10 px-4 text-sm font-semibold text-gray-200 transition hover:border-primary/50"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={handleSaveDraft}
                  disabled={isSaving}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-[#0b1020] transition hover:bg-gray-200 disabled:opacity-60"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                  {editingPostId ? 'Update Draft' : 'Save Draft'}
                </button>
              </div>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-300">Caption</span>
              <textarea
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                rows={10}
                placeholder="Generate ideas or write your caption here..."
                className="w-full resize-none rounded-lg border border-white/10 bg-[#11182d] px-3 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-gray-500 focus:border-primary/60"
              />
            </label>

            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-medium text-gray-300">Media URL</span>
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#11182d] px-3 focus-within:border-primary/60">
                <Link2 className="text-gray-500" size={17} />
                <input
                  value={mediaUrl}
                  onChange={(event) => setMediaUrl(event.target.value)}
                  placeholder="https://..."
                  className="h-11 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
                />
              </div>
            </label>

            {ideas?.hashtags && (
              <div className="mt-4 flex flex-wrap gap-2">
                {ideas.hashtags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setCaption((current) => `${current.trim()}\n\n${tag}`.trim())}
                    className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary transition hover:bg-primary/20"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>

        <section className="mt-6 rounded-lg border border-white/10 bg-white/[0.04] p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Drafts</h2>
            {isLoadingPosts && <Loader2 className="animate-spin text-primary" size={18} />}
          </div>

          {!isLoadingPosts && posts.length === 0 ? (
            <div className="rounded-lg border border-dashed border-white/15 py-10 text-center text-gray-400">
              Generate a caption and save your first post draft.
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className={`rounded-lg border bg-[#11182d] p-4 transition ${
                    editingPostId === post.id ? 'border-primary/70' : 'border-white/10'
                  }`}
                >
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <span className={`rounded-lg border px-2 py-1 text-xs font-medium ${statusStyles[post.status] || statusStyles.draft}`}>
                      {post.status}
                    </span>
                    <div className="flex items-center gap-2">
                      {post.status !== 'published' && (
                        <button
                          onClick={() => handleEdit(post)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-gray-400 transition hover:border-primary/50 hover:text-primary"
                          aria-label="Edit draft"
                        >
                          <Edit3 size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-gray-400 transition hover:border-red-400/50 hover:text-red-200"
                        aria-label="Delete draft"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="line-clamp-3 text-sm leading-6 text-gray-200">{post.content}</p>
                  <p className="mt-3 text-xs text-gray-500">
                    Created {new Date(post.created_at).toLocaleString()}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
