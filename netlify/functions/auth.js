const simpleOauth2 = require('simple-oauth2');

exports.handler = async (event) => {
  const client = simpleOauth2.create({
    client: {
      id: process.env.OAUTH_CLIENT_ID,
      secret: process.env.OAUTH_CLIENT_SECRET,
    },
    auth: {
      tokenHost: 'https://github.com',
      tokenPath: '/login/oauth/access_token',
      authorizePath: '/login/oauth/authorize',
    },
  });

  // Handle OAuth callback
  if (event.queryStringParameters.code) {
    try {
      const result = await client.authorizationCode.getToken({
        code: event.queryStringParameters.code,
        redirect_uri: `${process.env.URL}/.netlify/functions/auth`,
      });

      const token = result.access_token;

      return {
        statusCode: 200,
        body: JSON.stringify({
          token,
          provider: 'github',
        }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to get token' }),
      };
    }
  }

  // Redirect to GitHub OAuth
  const authorizationUri = client.authorizeURL({
    redirect_uri: `${process.env.URL}/.netlify/functions/auth`,
    scope: 'repo,user',
  });

  return {
    statusCode: 302,
    headers: {
      Location: authorizationUri,
    },
  };
};
