/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components including Filler for area charts
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
);

// Type for the event data returned from GitHub API
interface GitHubEvent {
  type: string;
  created_at: string;
}

interface ContributionData {
  [date: string]: number;
}

interface GithubContributionsProps {
  username: string;
  days?: number;
}

export default function GithubContributions({ username, days = 30 }: GithubContributionsProps) {
  const [contributions, setContributions] = useState<ContributionData>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalContributions, setTotalContributions] = useState(0);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const fetchContributions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`https://api.github.com/users/${username}/events`);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const events: GitHubEvent[] = await response.json();

        // Process and group contributions by date
        const contributionCount: ContributionData = {};
        
        // Create date range for last N days
        const today = new Date();
        for (let i = days - 1; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          contributionCount[dateStr] = 0;
        }

        // Count actual contributions
        let total = 0;
        events.forEach(event => {
          if (event.type === 'PushEvent' || event.type === 'PullRequestEvent' || 
              event.type === 'IssuesEvent' || event.type === 'CreateEvent') {
            const date = new Date(event.created_at).toISOString().split('T')[0];
            if (contributionCount[date] !== undefined) {
              contributionCount[date] = (contributionCount[date] || 0) + 1;
              total++;
            }
          }
        });

        setTotalContributions(total);
        setContributions(contributionCount);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchContributions();
  }, [username, days]);

  // Format dates to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  // Prepare chart data
  const labels = Object.keys(contributions).sort().map(formatDate);
  const data = Object.keys(contributions).sort().map(key => contributions[key]);

  // Get the maximum contribution value for setting chart scale
  const maxContribution = Math.max(...Object.values(contributions), 1);

  // Chart.js data configuration
  const chartData = {
    labels,
    datasets: [
      {
        label: `Contributions`,
        data: data,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        borderWidth: 2,
        pointBackgroundColor: '#2563eb',
        pointBorderColor: '#ffffff',
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        padding: 12,
        cornerRadius: 6,
        displayColors: false,
        titleFont: {
          size: 14,
          weight: "bold" as const,
        },
        callbacks: {
          title: function(tooltipItems: { label: any; }[]) {
            return tooltipItems[0].label;
          },
          label: function(context: { parsed: { y: any; }; }) {
            const value = context.parsed.y;
            return value === 1 ? '1 contribution' : `${value} contributions`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 11,
          },
          color: '#6b7280',
        }
      },
      y: {
        beginAtZero: true,
        max: Math.max(maxContribution + 1, 5),
        grid: {
          color: 'rgba(226, 232, 240, 0.5)',
        },
        ticks: {
          stepSize: 1,
          font: {
            size: 12,
          },
          color: '#6b7280',
          callback: function(value: number) {
            return value % 1 === 0 ? value : '';
          }
        }
      }
    }
  };

  // Show a nice loading skeleton
  if (loading) {
    return (
      <div className="rounded-lg shadow-md p-6 w-full">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 rounded w-1/3 mb-6"></div>
          <div className="h-64 bg-slate-200 rounded"></div>
          <div className="flex justify-between">
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg shadow-md p-6 w-full">
        <div className="flex items-center text-red-500 mb-4">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          Error loading GitHub data
        </div>
        <p className="text-gray-600 text-sm">{error}</p>
        <button 
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg shadow-md p-4 sm:p-6 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            {username}&apos;s GitHub Activity
          </h3>
          <p className="text-gray-300 text-sm mt-1">Last {days} days</p>
        </div>
        <div className="mt-2 sm:mt-0 bg-blue-50 text-blue-700 font-medium rounded-full px-3 py-1 text-sm">
          {totalContributions} total {totalContributions === 1 ? 'contribution' : 'contributions'}
        </div>
      </div>
      
      <div className="relative h-64 sm:h-80" ref={chartContainerRef}>
        <Line data={chartData} options={chartOptions} />
      </div>
      
      <div className="mt-4 flex justify-between text-xs text-gray-500">
        <span>Tracking: PushEvent, PullRequestEvent, IssuesEvent, CreateEvent</span>
        <span className="hidden sm:inline">Data from GitHub API</span>
      </div>
    </div>
  );
}