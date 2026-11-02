There are two supported methods of authenticating a Sidechat.js API client.  We recommend the automatic method, but you may choose to use the manual method if your project involves multiple instances of `SidechatAPIClient`. 

Go ahead and import `SidechatAPIClient` from the module:

```javascript
import { SidechatAPIClient } from "sidechat.js";
```


### Automatic method

First, create a new instance of the client:

```javascript
const API = new SidechatAPIClient();
```

The official app sends an identifier for the device along with every request, so it's a good idea to do the same.  This should be something that stays the same every time your app runs on the same device:

```javascript
const deviceID = /* Stable ID for this device */;
API.setDeviceIdentifier(deviceID);
```

For existing users, logging in is trivial.  First, send the user a verification code to their phone number.  Make sure the passed phone number is in a 10-digit format with no dashes, spaces, or parentheses:

```javascript
const phoneNumber = /* User's phone number */;
await API.loginViaSMS(phoneNumber);
```

If the code never shows up, you can try sending it through Sidechat's backup SMS route by passing `true` as the second parameter.  Sometimes the server will also ask for a captcha before it sends a code, in which case the response will have an `error_code` of `"captcha_required"`.  sidechat.js can't solve those yet, so the best you can do is ask the user to try again later.

Then once the user has inputted the 6-character code into your application, verify it with the API.  Codes can include letters, but they're not case-sensitive:

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

`setAge` also sends the user's time zone, which defaults to the system time zone.  If your code is running somewhere other than the user's device (like a server), pass their time zone as the third parameter.

Now the user should be logged in properly and future requests will be automatically authenticated.  You may still need to [add an email address](tutorial-Email%20Registration.html) for most functionality.

### Manual method

You can pass a user token directly to the constructor initialization:

```javascript
const token = /* User bearer token as a string */;
const API = new SidechatAPIClient(token);
```

All requests from here on out using this instance of the API client will automatically use the token passed to the constructor.