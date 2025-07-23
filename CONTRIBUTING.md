# Contribution Guideline

At xcapit, we are open to different types of contributions. Some contribute code changes, others contribute docs, others with translations and others help answer questions from users.

We welcome all contributions from folks who are willing to work in good faith with the community. No contribution is too small and all contributions are valued.

## Feedback, Bugs and Issues

Issues in Xcapit's Github repositories are the primary means by which bug reports, feedback and general discussions are made. A contributor is invited to create an issue, discuss, and provide a fix if needed.

- <https://github.com/xcapit/shelter>

Before opening an issue, check to see if there are any current issues with similar key words. This helps us cut down on duplicate tickets.

When you open an issue, you'll notice three templates (bug, custom, feature) with the user-story format we like for our issue reports. When starting a new issue, please do your best to be as detailed and specific as possible.

1. Bug report - use this to create a bug report to help us improve Xcapit apps and services
2. Feature request - use this to suggest a project idea
3. Custom issue template - use this to report an issue that doesn't fall under any other category

## Good First Issues

A good place to start is with some of issues labeled **Good First Issue**. You can find it in the issues sections of our repositories.

- <https://github.com/xcapit/shelter/issues>

## Merge/Pull Request (MR/PR) Process

Before you submit your Merge Request (MR) consider the following guidelines.

1. Search for an open or closed MR that relates to your submission. You don't want to duplicate effort.
2. Fork the repo that you want to contribute.
3. Make your changes in a new git branch. Checkout our [branch naming conventions](#branch-naming-conventions).

```sh
git checkout -b bugfix/my-fix-branch
```

4. Create your patch, **including appropriate test cases**.
5. Run the full test suite (see getting started documentation), and ensure that all tests pass.
6. Commit your changes using a descriptive commit message that follows our [commit message conventions](#commit-message-conventions). Adherence to these conventions is necessary because release notes and tag versions are automatically generated from these messages.
7. Push your branch to Github

```sh
git push origin bugfix/my-fix-branch
```

8. In Github, send a merge request to `main`

- If we suggest changes then.
  - Make the required updates.
  - Re-run the test suites to ensure tests are still passing.
  - Rebase your branch and force push to your Github repository (this will update your merge request)

  ```sh
  git rebase main -i
  git push -f
  ```

That's it! Thank you for your contribution!

### After your merge request is merged

After your merge request is merged, you can safely delete your branch and pull the changes from the main (upstream) repository.

- Delete the remote branch on Github either through the Github web UI or your local shell as follows

```sh
git push origin --delete bugfix/my-bugfix-branch
```

- Checkout the develop branch

```sh
git checkout main -f
```

- Delete the local branch

```sh
git branch -D bugfix/my-bugfix-branch
```

- Update your local branch with the latest upstream version

```sh
git pull --ff upstream main
```

## Commit Message Conventions

We have very precise rules over our git commit messages can be formatted. This leads to more readable messages that are easy to follow when looking through the project history. But also, we use the git commit messages to generate the change log.

### Commit Message Format

Each commit message consists of a **header** and a **body**. The header has a special format that includes a **type**, a **scope** and a **subject**.

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
```

The **header** and the header scope are mandatory.
In case the changes made are not related to the main components (sdk, contracts, ltw_service), the header scope is not required.

Any line of the commit message cannot be longer than 72 characters. This allows the message to be easier to read on Github as well as in various git tools.

Samples

```
fix(ltw_service): Fix english translations
feat(sdk): Add versioning pipeline
```

### Type

Must be one of the following

- **chore**: Changes that affect the build system or external dependencies and moving files
- **ci**: Changes to our CI configuration files and scripts
- **docs**: Documentation only changes
- **feat**: New feature
- **fix**: Bug fix
- **perf**: Code change that improves performance
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **style**: Changes that do not affect the meaning of the code
- **test**: Adding missing tests or correcting existing tests

### Subject

The subject contains succinct description of the change

- use the imperative, present tense: "change" not "changed" nor "changes"
- capitalize the first letter
- no dot (.) at the end

### Scope

Must be one of the following

- **sdk**: Changes that affect the [sdk component](https://github.com/xcapit/shelter/tree/main/sdk)
- **contracts**: Changes that affect the [contracts component](https://github.com/xcapit/shelter/tree/main/contracts)
- **ltw_service**: Changes that affect the [ltw_service component](https://github.com/xcapit/shelter/tree/main/ltw_service)

### Note

We use and recommend that you use [semantic-git-commit-cli](https://www.npmjs.com/package/semantic-git-commit-cli) to follow our commit message conventions easily.

## Branch Naming Conventions (WIP)

We follow a small set of rules to name a collaboration new branch. As in the [commit message conventions](#commit-message-conventions), this leads to more readable messages that are easy to follow when looking through the project history.

### Branch Name Format

Each new branch consists of a **type**, a **issue number** and a **name**.

```
<type>/<issue-number>_<name>
```

Samples

```
feature/4_Add-new-login-button
hotfix/6_Fix-profile-redirection
bugfix/3_Fix-language-wallet-faqs
```
