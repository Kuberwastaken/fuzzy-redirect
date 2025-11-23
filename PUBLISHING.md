# Publishing Guide

Follow these steps to publish `fuzzy-redirect` to npm.

## Prerequisites

1.  **npm Account**: You need an account on [npmjs.com](https://www.npmjs.com/).
2.  **Login**: Run `npm login` in your terminal and follow the prompts.

## Pre-Publish Checklist

- [ ] **Tests Pass**: Run `npm test` to ensure everything is green.
- [ ] **Build Succeeds**: Run `npm run build` to ensure artifacts are generated.
- [ ] **Version Updated**: If you are updating the package, increment the version in `package.json` (e.g., `1.0.0` -> `1.0.1`).
    - You can use `npm version patch`, `npm version minor`, or `npm version major`.

## Publishing

1.  **Dry Run** (Optional but recommended):
    See what will be published without actually publishing.
    ```bash
    npm publish --dry-run
    ```

2.  **Publish**:
    ```bash
    npm publish
    ```
    *Note: If you have 2FA enabled, you will be prompted for an OTP.*

## Post-Publish

- **Verify**: Go to `https://www.npmjs.com/package/fuzzy-redirect` to see your package.
- **Tag**: It's good practice to tag your release in git.
    ```bash
    git tag v1.0.0
    git push origin v1.0.0
    ```
