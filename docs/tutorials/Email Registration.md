> You can only start this process once you have [authenticated as a user](tutorial-Authentication.html).

Start by sending a verification email to the user:

```javascript
const email = /* User's email address */;
await API.registerEmail(email);
```

Once the user has clicked the link in the verification email, verify that they've clicked it:

```javascript
await API.checkEmailVerification();
```

You should be verified!

> ### NOTE
> There's also a `verifyEmailWithThirdParty` method that verifies the user's school email by signing in with Google or Microsoft instead of clicking a link.  It's experimental and I haven't tested it yet, so use it at your own risk.
