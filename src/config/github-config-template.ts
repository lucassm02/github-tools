export const CONFIG_TEMPLATE = {
  BRANCH_PROTECTION_RULE: {
    branch: 'branch_name',
    required_pull_request_reviews: {
      dismiss_stale_reviews: true,
      require_code_owner_reviews: true,
      required_approving_review_count: 2
    },
    required_status_checks: {
      strict: true,
      contexts: ['build', 'test']
    },
    enforce_admins: true,
    restrictions: {
      users: ['user1', 'user2'],
      teams: ['team1'],
      apps: ['app_slug']
    },
    allow_deletions: false,
    allow_force_pushes: false
  },
  ENVIRONMENT_SECRET: {
    API_KEY: 'secret_value',
    TOKEN: 'secret_value'
  },
  ENVIRONMENT_VARIABLE: {
    API_URL: 'variable_value',
    PROJECT_ID: 'variable_value'
  },
  ENVIRONMENT: {
    environment_name: 'production',
    wait_timer: 30,
    reviewers: [
      {
        type: 'User',
        id: 123456
      },
      {
        type: 'Team',
        id: 654321
      }
    ],
    deployment_branch_policy: {
      protected_branches: true,
      custom_branch_policies: false
    }
  }
};
