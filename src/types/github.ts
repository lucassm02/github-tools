export interface RequestError {
  name: string;
  status: number;
  request: Request;
  response: Response;
}

interface Request {
  method: string;
  url: string;
  headers: Headers;
  body: Body;
  request: Request2;
}

interface Headers {
  accept: string;
  'user-agent': string;
  authorization: string;
  'content-type': string;
}

interface Body {
  required_pull_request_reviews: RequiredPullRequestReviews;
  enforce_admins: boolean;
  restrictions: Restrictions;
  allow_deletions: boolean;
  allow_force_pushes: boolean;
}

interface RequiredPullRequestReviews {
  dismiss_stale_reviews: boolean;
  require_code_owner_reviews: boolean;
  required_approving_review_count: number;
}

interface Restrictions {
  users: string[];
  teams: string[];
  apps: string[];
}

interface Request2 {}

interface Response {
  url: string;
  status: number;
  headers: Record<string, string>;
  data: Data;
}

interface Data {
  message: string;
  documentation_url: string;
  status: string;
}

type RequiredStatusChecks = {
  strict: boolean;
  contexts: string[];
};

export type Rule = {
  owner: string;
  repo: string;
  branch: string;
  required_status_checks: RequiredStatusChecks;
  enforce_admins: boolean;
  required_pull_request_reviews: RequiredPullRequestReviews;
  restrictions: {};
  allow_force_pushes: boolean;
  allow_deletions: boolean;
};
