> You can only start this process once you have [authenticated as a user](tutorial-Authentication.html)

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