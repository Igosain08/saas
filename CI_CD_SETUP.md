# CI/CD Setup Guide

This project includes GitHub Actions workflows for automated testing and deployment.

## Workflows Included

### 1. **Test and Lint** (`.github/workflows/test.yml`)
- Runs on every pull request and push to main
- Tests frontend build
- Runs linter
- Validates Python syntax
- **No secrets required** - safe for public repos

### 2. **Docker Build Test** (`.github/workflows/docker-build.yml`)
- Tests Docker image builds on pull requests
- Validates Dockerfile syntax
- Ensures multi-stage builds work
- **No secrets required**

### 3. **Build and Deploy** (`.github/workflows/deploy.yml`)
- Runs on pushes to main branch
- Builds Docker image
- Pushes to AWS ECR
- Triggers App Runner deployment
- **Requires AWS secrets**

## Setup Instructions

### Step 1: Add GitHub Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these secrets:

1. **AWS_ACCESS_KEY_ID**
   - Your AWS access key ID
   - Get from: AWS Console → IAM → Users → Security credentials

2. **AWS_SECRET_ACCESS_KEY**
   - Your AWS secret access key
   - Get from: AWS Console → IAM → Users → Security credentials

3. **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY**
   - Your Clerk publishable key (starts with `pk_`)
   - Get from: Clerk Dashboard → API Keys

### Step 2: Update Workflow Configuration

Edit `.github/workflows/deploy.yml` and update:

```yaml
env:
  AWS_REGION: ap-south-1  # Change to your region
  ECR_REPOSITORY: consultation-app  # Your ECR repository name
```

### Step 3: Configure App Runner for Auto-Deployment

**Option A: Automatic Deployment (Recommended)**

1. Go to AWS App Runner Console
2. Select your service
3. Go to **Configuration** → **Source**
4. Change **Deployment trigger** from "Manual" to "Automatic"
5. Save changes

Now every push to main will automatically deploy!

**Option B: Manual Deployment**

Keep App Runner on "Manual" deployment and deploy via AWS Console after CI/CD completes.

## How It Works

### On Pull Request:
1. ✅ Frontend tests run
2. ✅ Backend syntax check
3. ✅ Docker build test
4. ❌ No deployment (safe for PRs)

### On Push to Main:
1. ✅ All tests run
2. ✅ Docker image built
3. ✅ Image pushed to ECR
4. ✅ App Runner deployment triggered (if auto-deploy enabled)

## Workflow Status

You can see workflow status:
- In GitHub: **Actions** tab
- On commits: Green checkmark ✅ or red X ❌
- On PRs: Status checks shown

## Troubleshooting

### "AWS credentials not found"
- Check that secrets are added in GitHub Settings
- Verify secret names match exactly (case-sensitive)

### "ECR repository not found"
- Verify ECR repository exists
- Check repository name matches in workflow
- Ensure IAM user has ECR permissions

### "Docker build fails"
- Check Dockerfile syntax
- Verify build arguments are set
- Check GitHub Actions logs for specific errors

### "App Runner not deploying"
- Verify App Runner is set to "Automatic" deployment
- Check App Runner service is running
- Review App Runner logs in AWS Console

## Manual Deployment

If you need to deploy manually:

```bash
# Build and push
docker build --platform linux/amd64 \
  --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" \
  -t consultation-app .

# Tag and push to ECR
aws ecr get-login-password --region ap-south-1 | \
  docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com

docker tag consultation-app:latest \
  $AWS_ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com/consultation-app:latest

docker push $AWS_ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com/consultation-app:latest

# Deploy in App Runner console
```

## Benefits

✅ **Automated Testing** - Catch errors before deployment
✅ **Consistent Builds** - Same process every time
✅ **Faster Deployments** - No manual steps
✅ **Better Quality** - Tests run automatically
✅ **Professional Practice** - Industry-standard CI/CD

## Next Steps

1. Add the GitHub secrets
2. Push to main branch
3. Watch the Actions tab for workflow execution
4. Verify deployment in AWS App Runner

Your CI/CD pipeline is now ready! 🚀

