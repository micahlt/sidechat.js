There are two supported methods of authenticating a Sidechat.js API client.  We recommend the automatic method, but you may choose to use the manual method if your project involves multiple instances of `SidechatAPIClient`. 

Go ahead and import `SidechatAPIClient` from the module:

```javascript
import { SidechatAPIClient } from "sidechat.js";
```

### Automatic method

For existing users, this is trivial.  First, send the user a verification code to their phone number.  Make sure the passed phone number is in a 10-digit format with no dashes, spaces, or parentheses:

```javascript
const phoneNumber = /* User's phone number */;
await API.loginViaSMS(phoneNumber);
```

Then once the user has inputted the 6-digit code into your application, verify it with the API:

```javascript
const code = /* SMS verification code */;
await API.verifySMSCode(phoneNumber, code);
```

If the user already exists, calling those two functions will set the user token and all requests from here on out using this instance of the API client will be automatically authenticated.

If the user has not used Sidechat before, the `verifySMSCode` will return a `registrationID`, which you should store and then use to call the `setAge` function:

```javascript
// Here "res" refers to the result of verifySMSCode()
const { registration_id } = res;
await API.setAge(18, registration_id);
```

Now the user should be logged in properly and future requests will be automatically authenticated.  You may still need to [verify an email](tutorial-Email%20Verification.html), though.

### Manual method

You can pass a user token directly to the constructor initialization:

```javascript
const token = /* User bearer token as a string */;
const API = new SidechatAPIClient(token);
```

All requests from here on out using this instance of the API client will automatically use the token passed to the constructor.