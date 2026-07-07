# Deploying blogger (frontend) to EC2

`.github/workflows/deploy.yml` SSHes into the EC2 instance on every push to
`main`, pulls the latest code, runs `npm ci && npm run build`, and restarts
the systemd service. No AWS API calls, no AWS credentials in GitHub — just
an SSH key.

## One-time server setup

1. Clone the repo to `/home/ubuntu/blogger` and create `.env.production`
   there with at least:

   ```
   NEXT_PUBLIC_API_BASE_URL=http://<backend-host>:8000
   ```

   `NEXT_PUBLIC_*` vars are inlined into the client bundle at **build**
   time, so this file has to exist on the server *before* `npm run build`
   runs — it's gitignored, so deploys (`git reset --hard`) never touch it.
2. Install Node (matching what you develop against locally) for the
   `ubuntu` user, then `npm ci && npm run build` once by hand to confirm it
   builds cleanly.
3. Install the service unit and enable it:

   ```bash
   sudo cp deploy/blogger-frontend.service /etc/systemd/system/blogger-frontend.service
   sudo systemctl daemon-reload
   sudo systemctl enable --now blogger-frontend
   ```

4. Let the `ubuntu` user restart *only* this service without a password
   (the deploy workflow runs `sudo systemctl restart blogger-frontend`
   non-interactively):

   ```bash
   echo 'ubuntu ALL=(root) NOPASSWD: /bin/systemctl restart blogger-frontend, /bin/systemctl status blogger-frontend' \
     | sudo tee /etc/sudoers.d/blogger-frontend-deploy
   sudo chmod 0440 /etc/sudoers.d/blogger-frontend-deploy
   ```

5. If you're deploying the backend to the *same* instance (as decided for
   this project — no nginx/domain for now), you already have a deploy key
   pair from the backend's setup; just add the same public key to this
   directory's git remote access if it's a separate repo, or reuse the
   `authorized_keys` entry if the backend is already on this box.
   Otherwise generate a dedicated one:

   ```bash
   ssh-keygen -t ed25519 -f deploy_key -N "" -C "github-actions-blogger-frontend"
   ```

## GitHub repo configuration

Set these once under **Settings → Secrets and variables → Actions**:

| Type     | Name                      | Value                                                      |
| -------- | ------------------------- | ------------------------------------------------------------ |
| Secret   | `EC2_HOST`                | Instance public IP or DNS name                                |
| Secret   | `EC2_SSH_PRIVATE_KEY`     | Contents of the deploy private key                             |
| Variable | `EC2_USER`                | `ubuntu` (this is already the default if unset)                |
| Variable | `FRONTEND_DEPLOY_PATH`    | Only needed if not `/home/ubuntu/blogger`                       |
| Variable | `FRONTEND_SERVICE_NAME`   | Only needed if not `blogger-frontend`                            |

Via the `gh` CLI instead of the UI:

```bash
gh secret set EC2_HOST --body "<instance-ip-or-dns>"
gh secret set EC2_SSH_PRIVATE_KEY < deploy_key
```

Once both are set, push to `main` (or run the workflow manually via
**Actions → Deploy to EC2 → Run workflow**) to deploy.

Since backend and frontend share the same instance for now, `EC2_HOST` and
`EC2_SSH_PRIVATE_KEY` will be the same values in both repos' secrets.
