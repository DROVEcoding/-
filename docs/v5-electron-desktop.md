# V5: Electron Desktop App

V5 teaches desktop packaging.

The current project is a web app. Electron adds a desktop shell around the same `index.html`, so the app can become a Windows desktop program without rewriting the dictionary UI.

## What This Version Teaches

- `npm`: the package manager that records development tools and commands.
- `package.json`: the project instruction file for Node/npm tools.
- `Electron`: a desktop shell that bundles Chromium and loads our web app.
- `main process`: the Electron entry file that creates the desktop window.
- `portable app`: a build output that can run without a traditional installer.
- `artifact`: a file produced by a build, such as a zipped desktop app.

## Learning Demo vs Production Reality

This version is a learning demo:

- It creates an Electron shell.
- It reuses the existing web UI.
- It can run tests with `npm test`.
- It can build a Windows portable app through GitHub Actions.

Production desktop distribution may also need:

- code signing certificates,
- installer customization,
- auto-update configuration,
- Windows security reputation,
- crash reporting,
- customer support and version rollback plans.

Those are intentionally left for later versions.

## Local Commands

Install dependencies:

```bash
npm install
```

Run web logic tests:

```bash
npm test
```

Run the desktop app after Electron's runtime has downloaded:

```bash
npm run desktop
```

Build a Windows portable app locally:

```bash
npm run dist
```

## Current Environment Note

Electron needs to download a Windows runtime zip of about 148 MB. On this computer, that runtime download timed out during local setup, so V5 also includes a GitHub Actions workflow:

```text
.github/workflows/desktop-build.yml
```

That workflow lets GitHub build the Windows portable artifact in the cloud.
