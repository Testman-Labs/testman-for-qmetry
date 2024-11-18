import { const_auth_jira } from "..";
import { IJira } from "../types";
export { oauth_context, user_detail, issue_detail };

async function oauth_context(user: IJira) {
    console.log('🔐 Autenticando...');

    const userAuth = `${user.email}:${user.token}`;
    const basicAuth: string = `Basic ${btoa(userAuth)}`;
    const host = new URL("/plugins/servlet/ac/com.infostretch.QmetryTestManager/qtm4j-test-management", user.host);

    const response = await fetch(host, {
        method: 'GET',
        headers: {
            'Authorization': basicAuth
        }
    });

    const responseText = await response.text();
    if (!response.ok) {
        throw new Error("❌ Error al obtener el token de autenticación");
    }

    const context = searchJwt(responseText);
    if (context === '') {
        throw new Error("❌ Error al obtener el token de autenticación");
    }
    return 'jwt ' + context;
}

async function user_detail(userId: string) {
    let url = `${const_auth_jira.host}/rest/api/3/user?accountId=${userId}`;

    const userAuth = `${const_auth_jira.email}:${const_auth_jira.token}`;
    const basicAuth: string = `Basic ${btoa(userAuth)}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': basicAuth
        }
    });

    if (!response.ok) {
        throw new Error(`❌ Error al obtener el usuario de Jira: ${response.statusText}`);
    }

    const userData = await response.json();
    return userData;
}

async function issue_detail(issueKey: string) {
    let url = `${const_auth_jira.host}/rest/api/3/issue/${issueKey}`;
    
    const userAuth = `${const_auth_jira.email}:${const_auth_jira.token}`;
    const basicAuth: string = `Basic ${btoa(userAuth)}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': basicAuth
        }
    });

    if (!response.ok) {
        throw new Error(`❌ Error al obtener el HU de Jira: ${response.statusText}`);
    }

    const issueData = await response.json();
    return issueData;
}

function searchJwt(text: string) {
    const regex = /"contextJwt":"(.*?)"/;
    const match = regex.exec(text);
    return match ? match[1] : '';
}