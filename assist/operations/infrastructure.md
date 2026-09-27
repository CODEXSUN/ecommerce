# Ecommerce Infrastructure

This document defines the local infrastructure baseline for Ecommerce.

## Local development

Run the API and web workspaces from the repository root. Keep application ports in ignored environment files when the runtime is added.

## Deployment boundary

Container files and deployment providers belong to this repository. Shared deployment behavior belongs to Platform.

## Safety

Keep local services on loopback during development. Store credentials in environment files or the deployment secret store. Never commit secrets or runtime data.
