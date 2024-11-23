# Contributing

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## We Use [Github Flow](https://guides.github.com/introduction/flow/index.html), So All Code Changes Happen Through Pull Requests

Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Write bug reports with detail, background, and sample code

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can.
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

People *love* thorough bug reports. I'm not even kidding.

## Branching Convention

We use a specific branching strategy to organize our work and releases:

- **main**: The main branch contains the latest stable release code.
- **develop**: This is the primary development branch where all the development merges before being released.
- **feature/**: Feature branches are created from 'develop' and must be prefixed with 'feature/', e.g., `feature/new-oauth2-flow`.
- **bugfix/**: Bugfix branches are created from 'develop' for fixing bugs and must be prefixed with 'bugfix/', e.g., `bugfix/login-issue`.
- **release/**: Release branches are created from 'develop' for new versions and must be prefixed with 'release/', e.g., `release/1.2.0`.

Please ensure your branch relates closely to the feature or bug you're addressing.

## Commit Naming Convention

Commit messages should be clear and follow a standard format. This helps in identifying changes and speeding up the review process:

- Start the commit message with a verb in the imperative mood: "Add", "Fix", "Update", "Remove", etc.
- Follow with a brief description of the change:
  - For features: `Add [feature name/description]`
  - For bug fixes: `Fix [issue being fixed]`
  - For documentation: `Update [documentation specifics]`

Example:
- `Add support for Solidity 0.8.x`
- `Fix incorrect balance calculation on withdrawal`

Please keep the first line of your commit message to 50 characters or less. Use the body for more detailed descriptions if necessary.
