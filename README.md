# Mailbox FE - Email MFA Platform Frontend

**Status**: 🚧 In Development
**Repository**: https://github.com/submanagementgroup/mailbox-fe
**Related**: [mailbox-api](https://github.com/submanagementgroup/mailbox-api) (Backend)

React 19 frontend for the Email MFA Platform with Azure Entra External ID authentication and Material-UI.

---

## Technology Stack

- React 19 + TypeScript
- Material-UI v7
- Azure MSAL Browser (Entra External ID)
- React Router DOM v7
- Axios (API client)
- AWS CDK (S3 + CloudFront deployment)

---

## Project Structure

```
mailbox-fe/
├── bin/
│   └── mailbox-fe.ts          # CDK pipeline entry point
├── lib/
│   └── mailbox-fe-stack.ts    # S3 + CloudFront + Route53
├── src/                        # React application
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── lib/
│   │   ├── msalConfig.ts      # Azure Entra config
│   │   └── api.ts             # API client
│   ├── aws-exports.dev.ts     # Dev environment config
│   ├── aws-exports.prod.ts    # Prod environment config
│   └── aws-exports.ts         # Current config
├── public/
│   ├── smg-logo.png           # SMG branding
│   └── smg-logo-small.png
├── package.json                # React + CDK dependencies
├── tsconfig.json               # React config
├── tsconfig.cdk.json           # CDK config
└── cdk.json
```

---

## Local Development

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/submanagementgroup/mailbox-fe.git
cd mailbox-fe

# 2. Install dependencies
npm install

# 3. Copy local configuration
cp src/aws-exports.local.ts src/aws-exports.ts

# 4. Start development server
npm start

# App opens at http://localhost:3000 with hot-reload
```

### Dev Mode Authentication Bypass

The app automatically uses **dev mode login** when running locally (NODE_ENV=development):

**What You'll See**:
1. Visit `http://localhost:3000`
2. Beautiful login page with SMG logo
3. Single button: **"Login as matt@submanagementgroup.com (Dev)"**
4. Click → Instantly logged in as SYSTEM_ADMIN
5. Full access to all features

**No Azure Entra setup needed!** Auth is bypassed in development mode.

### Backend Options

Choose which API to use by editing `src/aws-exports.ts`:

**Option 1: Local Backend** (Full Local Stack)
```typescript
// src/aws-exports.ts
export const awsConfig = {
  apiUrl: 'http://localhost:3001',  // Local Express server
  // ...
};
```

Then run backend:
```bash
# Terminal 1: Backend
cd ../mailbox-api
npm run dev

# Terminal 2: Frontend
cd ../mailbox-fe
npm start
```

**Option 2: Deployed API** (Frontend-Only Development)
```typescript
// src/aws-exports.ts
export const awsConfig = {
  apiUrl: 'https://lmcl61jrz0.execute-api.ca-central-1.amazonaws.com/dev',  // Deployed dev API
  // ...
};
```

Then just run frontend:
```bash
npm start
# Uses deployed API, Aurora, SES - no local backend needed
```

### Hot-Reload Workflow

1. Edit any React component, hook, or page
2. Save the file
3. Browser auto-reloads with changes (~instant)
4. Test your changes immediately

**No server restart needed!**

### Development Features

**Available Components**:
- ✅ Dashboard (view mailboxes)
- ✅ Inbox (message list)
- ✅ Message detail (email viewer with HTML rendering)
- ✅ Reply form (send replies via SES)
- ✅ Forwarding rules (CRUD operations)
- ✅ Admin dashboard (4 tabs):
  - User management (create/list users via Graph API)
  - Mailbox management (create/assign mailboxes)
  - Whitelist management (sender domains + recipient emails)
  - Audit log viewer (paginated)

**All Features Work** because dev login assigns SYSTEM_ADMIN role!

### Testing API Calls

Open browser console to see API calls:

```javascript
// Network tab shows:
GET http://localhost:3001/mailboxes
Authorization: Bearer DEV_TOKEN_BYPASS

// Response:
{
  "success": true,
  "data": [...]
}
```

### Configuration Files

**Three environment configs**:
- `aws-exports.local.ts` - For local development (localhost:3001 or deployed API)
- `aws-exports.dev.ts` - For dev deployment (mail.dev.submanagementgroup.com)
- `aws-exports.prod.ts` - For prod deployment (mail.submanagementgroup.com)

**Current config** is in `src/aws-exports.ts` (copied from one of the above)

### Re-Enable Real Authentication

To test with real Azure Entra:

1. **Update configuration**:
   ```typescript
   // src/aws-exports.ts
   entra: {
     tenantId: 'YOUR_REAL_TENANT_ID',
     tenantName: 'yourcompany.ciamlogin.com',
     clientId: 'YOUR_REAL_CLIENT_ID',
     // ...
   }
   ```

2. **Build for production**:
   ```bash
   npm run build
   # Sets NODE_ENV=production automatically
   # Dev login won't appear
   ```

3. **Or set environment variable**:
   ```bash
   REACT_APP_BYPASS_AUTH=false npm start
   ```

All Azure Entra code is intact - dev bypass is just an environment check!

### Troubleshooting

**"Network Error" on API calls**:
- Check backend is running (`cd ../mailbox-api && npm run dev`)
- Verify `aws-exports.ts` has correct apiUrl
- Check browser console for CORS errors

**Dev login doesn't appear**:
- Verify NODE_ENV is 'development' (automatic with `npm start`)
- Check browser console for errors
- Try clearing session storage

**React won't start**:
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check for port conflicts (port 3000 in use)

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
