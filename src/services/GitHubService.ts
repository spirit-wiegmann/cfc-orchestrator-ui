export interface Repository {
  id: string;
  name: string;
  owner: {
    login: string;
  };
  description: string;
  url: string;
}

export interface RepositoryInput {
  owner: string;
  repo: string;
  subfolder: string;
}

export interface WorkflowInput {
  repositories: RepositoryInput[];
  target_repo_name: string;
  target_repo_description?: string;
  target_owner?: string;
  package_manager: 'npm' | 'yarn' | 'pnpm' | 'lerna';
  create_private_repo: boolean;
}

class GitHubService {
  private readonly token: string | null;
  private readonly orchestratorRepo: string;
  
  constructor(token: string | null) {
    this.token = token;
    this.orchestratorRepo = import.meta.env.VITE_ORCHESTRATOR_REPO || 'spirit-wiegmann/cfc-orchestrator';
  }

  // GitHub GraphQL API für Repository-Suche
  async searchRepositories(query: string): Promise<Repository[]> {
    if (!this.token) throw new Error('Nicht authentifiziert');
    
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query SearchRepositories($query: String!) {
            search(query: $query, type: REPOSITORY, first: 10) {
              nodes {
                ... on Repository {
                  id
                  name
                  owner {
                    login
                  }
                  description
                  url
                }
              }
            }
          }
        `,
        variables: {
          query: `${query} in:name fork:true`,
        },
      }),
    });

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(data.errors[0].message);
    }
    
    return data.data.search.nodes;
  }

  // GitHub REST API für Workflow Dispatch
  async triggerWorkflow(inputs: WorkflowInput): Promise<{ status: string; url?: string }> {
    if (!this.token) throw new Error('Nicht authentifiziert');

    const [owner, repo] = this.orchestratorRepo.split('/');
    
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/workflows/monorepo-orchestrator.yml/dispatches`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ref: 'main',
        inputs: {
          repositories: JSON.stringify(inputs.repositories),
          target_repo_name: inputs.target_repo_name,
          target_repo_description: inputs.target_repo_description || 'Ein automatisch generiertes MonoRepo',
          target_owner: inputs.target_owner || '',
          package_manager: inputs.package_manager,
          create_private_repo: inputs.create_private_repo.toString(),
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Workflow konnte nicht gestartet werden: ${error.message}`);
    }

    // Workflow wurde gestartet, warte kurz und hole dann die Liste der Workflow-Runs
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const runsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/runs?per_page=1`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    
    if (runsResponse.ok) {
      const runsData = await runsResponse.json();
      if (runsData.workflow_runs && runsData.workflow_runs.length > 0) {
        return {
          status: 'success',
          url: runsData.workflow_runs[0].html_url,
        };
      }
    }
    
    return { status: 'success' };
  }

  // Teste, ob der Token gültig ist
  async validateToken(): Promise<boolean> {
    if (!this.token) return false;
    
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });
      
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export default GitHubService;
