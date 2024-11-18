import { IJira } from "../types";
export { oauth_context, user_detail, issue_detail };
declare function oauth_context(user: IJira): Promise<string>;
declare function user_detail(userId: string): Promise<any>;
declare function issue_detail(issueKey: string): Promise<any>;
//# sourceMappingURL=validate_auth.d.ts.map