import { useEffect, useState } from 'react';
import { GitCommit, GitPullRequest, GitBranch } from 'lucide-react';
import ErrorState from '../ui/ErrorState';

interface GitHubStats {
  publicRepos: number;
  totalStars: number;
  totalContributions: number;
}

interface GitHubEvent {
  id: string;
  type: 'PushEvent' | 'PullRequestEvent' | 'CreateEvent' | string;
  repo: {
    id: number;
    name: string;
    url: string;
  };
  payload?: {
    action?: string;
    ref_type?: string;
    ref?: string;
  };
  created_at: string;
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 1) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 1) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;

  if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;

  const diffWeeks = Math.floor(diffDays / 7);
  return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`;
}

export default function GitHubActivity() {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [syncTime, setSyncTime] = useState<Date | null>(null);
  const [relativeSyncStr, setRelativeSyncStr] = useState<string>('just now');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchGitHubData() {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/github/activity`);
        if (!response.ok) {
          throw new Error('Failed to fetch from backend API');
        }

        const json = await response.json();
        const { stats: fetchedStats, events: fetchedEvents, syncTime: fetchedSyncTime } = json.data || {};

        if (isMounted) {
          setStats(fetchedStats || null);
          setEvents(fetchedEvents || []);
          setSyncTime(fetchedSyncTime ? new Date(fetchedSyncTime) : null);
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      }
    }

    fetchGitHubData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!syncTime) return;
    const updateRelative = () => {
      setRelativeSyncStr(getRelativeTime(syncTime));
    };
    updateRelative();
    const interval = setInterval(updateRelative, 30000);
    return () => clearInterval(interval);
  }, [syncTime]);

  if (error) {
    return (
      <ErrorState
        message="GitHub activity data is temporarily unavailable."
        className="py-6 text-xs max-w-2xl"
      />
    );
  }

  if (loading) {
    return (
      <div className="w-full max-w-2xl bg-terminal border border-border rounded-md px-4 py-3 font-mono animate-pulse">
        <div className="space-y-2">
          <div className="h-4 bg-bg-subtle rounded w-3/4"></div>
          <div className="h-4 bg-bg-subtle rounded w-1/2"></div>
        </div>
        <div className="mt-3 border-t border-border pt-3 space-y-2">
          <div className="h-3 bg-bg-subtle rounded w-5/6"></div>
          <div className="h-3 bg-bg-subtle rounded w-2/3"></div>
          <div className="h-3 bg-bg-subtle rounded w-3/4"></div>
          <div className="h-3 bg-bg-subtle rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'PushEvent':
        return <GitCommit size={14} className="text-primary shrink-0" />;
      case 'PullRequestEvent':
        return <GitPullRequest size={14} className="text-primary shrink-0" />;
      case 'CreateEvent':
        return <GitBranch size={14} className="text-primary shrink-0" />;
      default:
        return null;
    }
  };

  const getEventActionText = (event: GitHubEvent) => {
    switch (event.type) {
      case 'PushEvent':
        return 'pushed to';
      case 'PullRequestEvent': {
        const prAction = event.payload?.action || 'opened';
        return `${prAction} PR on`;
      }
      case 'CreateEvent': {
        const refType = event.payload?.ref_type || 'repository';
        const refName = event.payload?.ref ? ` ${event.payload.ref}` : '';
        return `created ${refType}${refName} on`;
      }
      default:
        return 'interacted with';
    }
  };

  return (
    <div className="w-full max-w-2xl bg-terminal border border-border rounded-md px-4 py-3 font-mono shadow-2xl">
      {stats && (
        <div className="flex flex-col gap-1 text-xs md:text-sm font-mono text-text-muted">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-primary font-bold">{'>'}</span>
            <span>last synced from GitHub</span>
            <span className="text-primary font-bold">·</span>
            <span className="text-text">{relativeSyncStr}</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-primary font-bold">{'>'}</span>
            <span>
              <span className="text-text font-semibold">{stats.publicRepos}</span>{' '}
              {stats.publicRepos === 1 ? 'repository' : 'repositories'}
            </span>
            <span className="text-primary font-bold">·</span>
            <span>
              <span className="text-text font-semibold">{stats.totalStars}</span>{' '}
              {stats.totalStars === 1 ? 'star' : 'stars'}
            </span>
            <span className="text-primary font-bold">·</span>
            <span>
              <span className="text-text font-semibold">{stats.totalContributions}</span>{' '}
              {stats.totalContributions === 1 ? 'contribution' : 'contributions'} (last year)
            </span>
          </div>
        </div>
      )}

      {events.length > 0 && (
        <div className="mt-3 border-t border-border pt-3 space-y-2">
          {events.map((event) => {
            const icon = getEventIcon(event.type);
            const actionText = getEventActionText(event);
            const repoName = event.repo.name.replace(/^[^/]+\//, '');
            const timeStr = getRelativeTime(new Date(event.created_at));

            return (
              <div key={event.id} className="flex items-start gap-2 text-xs text-text-muted">
                <span className="mt-0.5">{icon}</span>
                <span className="leading-snug">
                  {actionText}{' '}
                  <span className="text-primary-dim font-medium">{repoName}</span>
                  {' '}
                  <span className="text-primary font-bold">·</span>
                  {' '}
                  <span>{timeStr}</span>
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
