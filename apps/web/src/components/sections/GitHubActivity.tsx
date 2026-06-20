import { useEffect, useState } from 'react';
import { GitCommit, GitPullRequest, GitBranch, FolderPlus, Eye } from 'lucide-react';
import ErrorState from '../ui/ErrorState';
import Skeleton from '../ui/Skeleton';
import { useGitHubActivity } from '../../hooks/use-github-activity';

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
  const { data, isLoading, isError } = useGitHubActivity();

  const syncTime = data?.syncTime ? new Date(data.syncTime) : null;
  const [relativeSyncStr, setRelativeSyncStr] = useState<string>('just now');

  useEffect(() => {
    if (!syncTime) return;
    const updateRelative = () => setRelativeSyncStr(getRelativeTime(syncTime));
    updateRelative();
    const interval = setInterval(updateRelative, 30000);
    return () => clearInterval(interval);
  }, [syncTime]);

  if (isError) {
    return (
      <ErrorState
        message="GitHub activity data is temporarily unavailable."
        className="py-6 text-xs max-w-2xl"
      />
    );
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl bg-terminal border border-border rounded-md px-4 py-3 font-mono">
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="mt-3 border-t border-border pt-3 space-y-2">
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    );
  }

  const { stats, contributions } = data ?? {};

  return (
    <div className="relative w-full max-w-2xl bg-bg-subtle/70 border border-border rounded-md px-4 py-3 font-mono shadow-md hover-glow">
      <div className="absolute inset-0 -z-10 rounded-md backdrop-blur-md pointer-events-none" />
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
              contributions (last year)
            </span>
          </div>
        </div>
      )}

      {contributions && (
        <div className="mt-3 border-t border-border pt-3 space-y-2.5 text-xs text-text-muted">

          {contributions.commits.total > 0 && (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <GitCommit size={13} className="text-primary shrink-0" />
                <span>
                  <span className="text-text font-semibold">{contributions.commits.total}</span>
                  {' '}commit{contributions.commits.total !== 1 ? 's' : ''} in{' '}
                  <span className="text-text font-semibold">{contributions.commits.repoCount}</span>
                  {' '}repositor{contributions.commits.repoCount !== 1 ? 'ies' : 'y'}
                  <span className="text-text-muted opacity-60 ml-1">({contributions.period})</span>
                </span>
              </div>
              {contributions.commits.topRepos.length > 0 && (
                <div className="ml-5 space-y-0.5">
                  {contributions.commits.topRepos.map((repo, i) => (
                    <div key={repo.name} className="flex items-center gap-1.5 text-[11px]">
                      <span className="text-primary/50">
                        {i === contributions.commits.topRepos.length - 1 ? '└' : '├'}
                      </span>
                      <span className="text-primary-dim font-medium">{repo.name}</span>
                      <span className="text-text-muted opacity-60">
                        {repo.count} commit{repo.count !== 1 ? 's' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {contributions.pullRequests.opened > 0 && (
            <div className="flex items-center gap-2">
              <GitPullRequest size={13} className="text-primary shrink-0" />
              <span>
                <span className="text-text font-semibold">{contributions.pullRequests.opened}</span>
                {' '}pull request{contributions.pullRequests.opened !== 1 ? 's' : ''} opened
                {contributions.pullRequests.merged > 0 && (
                  <span className="text-text-muted opacity-70">
                    {' '}·{' '}
                    <span className="text-secondary font-semibold">{contributions.pullRequests.merged}</span>
                    {' '}merged
                  </span>
                )}
              </span>
            </div>
          )}

          {contributions.reviews > 0 && (
            <div className="flex items-center gap-2">
              <Eye size={13} className="text-primary shrink-0" />
              <span>
                reviewed{' '}
                <span className="text-text font-semibold">{contributions.reviews}</span>
                {' '}pull request{contributions.reviews !== 1 ? 's' : ''}
              </span>
            </div>
          )}

          {contributions.reposCreated > 0 && (
            <div className="flex items-center gap-2">
              <FolderPlus size={13} className="text-primary shrink-0" />
              <span>
                created{' '}
                <span className="text-text font-semibold">{contributions.reposCreated}</span>
                {' '}repositor{contributions.reposCreated !== 1 ? 'ies' : 'y'}
              </span>
            </div>
          )}

          {contributions.commits.total === 0 &&
            contributions.pullRequests.opened === 0 &&
            contributions.reviews === 0 &&
            contributions.reposCreated === 0 && (
              <div className="flex items-center gap-2 opacity-50">
                <GitBranch size={13} className="text-primary shrink-0" />
                <span>no contributions this month yet</span>
              </div>
            )}
        </div>
      )}
    </div>
  );
}
