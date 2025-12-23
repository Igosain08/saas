# AWS App Runner Deployment Guide

This guide walks you through deploying your healthcare consultation assistant to AWS App Runner.

## ✅ What's Been Done

- ✅ Updated `next.config.ts` for static export
- ✅ Updated API endpoint to `/api/consultation`
- ✅ Created `api/server.py` for AWS deployment
- ✅ Created `Dockerfile` for containerization
- ✅ Created `.dockerignore` to exclude unnecessary files
- ✅ Updated `requirements.txt` with necessary dependencies

## Step 1: Create .env File for AWS

Create a `.env` file in your project root (copy from `.env.local` and add AWS info):

```bash
# Copy your values from .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_JWKS_URL=https://...

# Add your OpenAI API key
OPENAI_API_KEY=sk-...

# Add AWS configuration
DEFAULT_AWS_REGION=us-east-1  # or your preferred region
AWS_ACCOUNT_ID=123456789012   # Your 12-digit AWS Account ID
```

**To find your AWS Account ID**:
1. In AWS Console, click your username (top right)
2. Copy the 12-digit Account ID

**Important**: Make sure `.env` is in your `.gitignore` file!

## Step 2: Build and Test Locally

### Load Environment Variables

**Mac/Linux** (Terminal):
```bash
cd /Users/ishaangosain/Desktop/projects/saas
export $(cat .env | grep -v '^#' | xargs)
```

**Windows** (PowerShell):
```powershell
cd C:\path\to\saas
Get-Content .env | ForEach-Object {
    if ($_ -match '^(.+?)=(.+)$') {
        [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2])
    }
}
```

### Build Docker Image

**Mac/Linux**:
```bash
docker build \
  --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" \
  -t consultation-app .
```

**Windows PowerShell**:
```powershell
docker build `
  --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="$env:NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" `
  -t consultation-app .
```

### Run Locally

**Mac/Linux**:
```bash
docker run -p 8000:8000 \
  -e CLERK_SECRET_KEY="$CLERK_SECRET_KEY" \
  -e CLERK_JWKS_URL="$CLERK_JWKS_URL" \
  -e OPENAI_API_KEY="$OPENAI_API_KEY" \
  consultation-app
```

**Windows PowerShell**:
```powershell
docker run -p 8000:8000 `
  -e CLERK_SECRET_KEY="$env:CLERK_SECRET_KEY" `
  -e CLERK_JWKS_URL="$env:CLERK_JWKS_URL" `
  -e OPENAI_API_KEY="$env:OPENAI_API_KEY" `
  consultation-app
```

### Test Your Application

1. Open browser to `http://localhost:8000`
2. Sign in with your Clerk account
3. Test the consultation form
4. Verify everything works!

**To stop**: Press `Ctrl+C` in the terminal

## Step 3: Set Up AWS ECR

### Create ECR Repository

1. In AWS Console, search for **ECR**
2. Click **Get started** or **Create repository**
3. **Important**: Make sure you're in the correct region (top right - should match your `DEFAULT_AWS_REGION`)
4. Settings:
   - Visibility settings: **Private**
   - Repository name: `consultation-app` (must match exactly!)
   - Leave all other settings as default
5. Click **Create repository**

### Set Up AWS CLI

#### Create Access Keys

1. In AWS Console, go to **IAM**
2. Click **Users** → click on `aiengineer` (or your IAM user)
3. Click **Security credentials** tab
4. Under **Access keys**, click **Create access key**
5. Select **Command Line Interface (CLI)**
6. Check the confirmation box → **Next**
7. Description: `Docker push access`
8. Click **Create access key**
9. **Critical**: Download CSV or copy both:
   - Access key ID
   - Secret access key
10. Click **Done**

#### Configure AWS CLI

Install AWS CLI if you haven't:
- **Mac**: `brew install awscli` or download from [aws.amazon.com/cli](https://aws.amazon.com/cli/)
- **Windows**: Download installer from [aws.amazon.com/cli](https://aws.amazon.com/cli/)

Configure it:
```bash
aws configure
```

Enter:
- AWS Access Key ID: (paste your key)
- AWS Secret Access Key: (paste your secret)
- Default region: (your `DEFAULT_AWS_REGION` from .env)
- Default output format: `json`

## Step 4: Push Image to ECR

**Mac/Linux**:
```bash
# 1. Authenticate Docker to ECR
aws ecr get-login-password --region $DEFAULT_AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$DEFAULT_AWS_REGION.amazonaws.com

# 2. Build for Linux/AMD64 (CRITICAL for Apple Silicon Macs!)
docker build \
  --platform linux/amd64 \
  --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" \
  -t consultation-app .

# 3. Tag your image
docker tag consultation-app:latest $AWS_ACCOUNT_ID.dkr.ecr.$DEFAULT_AWS_REGION.amazonaws.com/consultation-app:latest

# 4. Push to ECR
docker push $AWS_ACCOUNT_ID.dkr.ecr.$DEFAULT_AWS_REGION.amazonaws.com/consultation-app:latest
```

**Windows PowerShell**:
```powershell
# 1. Authenticate Docker to ECR
aws ecr get-login-password --region $env:DEFAULT_AWS_REGION | docker login --username AWS --password-stdin "$env:AWS_ACCOUNT_ID.dkr.ecr.$env:DEFAULT_AWS_REGION.amazonaws.com"

# 2. Build for Linux/AMD64
docker build `
  --platform linux/amd64 `
  --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="$env:NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" `
  -t consultation-app .

# 3. Tag your image
docker tag consultation-app:latest "$env:AWS_ACCOUNT_ID.dkr.ecr.$env:DEFAULT_AWS_REGION.amazonaws.com/consultation-app:latest"

# 4. Push to ECR
docker push "$env:AWS_ACCOUNT_ID.dkr.ecr.$env:DEFAULT_AWS_REGION.amazonaws.com/consultation-app:latest"
```

**Note for Apple Silicon (M1/M2/M3) Macs**: The `--platform linux/amd64` flag is ESSENTIAL!

✅ **Checkpoint**: In ECR console, you should see your image with tag `latest`

## Step 5: Create App Runner Service

### Launch App Runner

1. In AWS Console, search for **App Runner**
2. Click **Create service**

### Configure Source

1. **Source**:
   - Repository type: **Container registry**
   - Provider: **Amazon ECR**
2. Click **Browse** 
3. Select `consultation-app` → Select `latest` tag
4. **Deployment settings**:
   - Deployment trigger: **Manual** (to control costs)
   - ECR access role: **Create new service role**
5. Click **Next**

### Configure Service

1. **Service name**: `consultation-app-service`

2. **Virtual CPU & memory**:
   - vCPU: `0.25 vCPU`
   - Memory: `0.5 GB`

3. **Environment variables** - Click **Add environment variable** for each:
   - `CLERK_SECRET_KEY` = (paste your value)
   - `CLERK_JWKS_URL` = (paste your value)  
   - `OPENAI_API_KEY` = (paste your value)

   Note: We don't need `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` here - it's baked into the static files!

4. **Port**: `8000` (Important: our FastAPI server runs on 8000)

5. **Auto scaling**:
   - Minimum size: `1` (AWS requires at least 1 instance)
   - Maximum size: `1` (keeps costs low)

6. Click **Next**

### Configure Health Check

1. **Health check configuration**:
   - Protocol: **HTTP**
   - Path: `/health`
   - Interval: `20` seconds (maximum allowed)
   - Timeout: `5` seconds
   - Healthy threshold: `2`
   - Unhealthy threshold: `5`

2. Click **Next**

### Review and Create

1. Review all settings
2. Click **Create & deploy**
3. **Wait 5-10 minutes** - watch the Events log
4. Status will change from "Operation in progress" to "Running"

✅ **Checkpoint**: Service shows "Running" with green checkmark

### Access Your Application

1. Click on the **Default domain** URL (like: `abc123.YOUR-REGION.awsapprunner.com`)
2. Your app should load with HTTPS automatically enabled!
3. Test all functionality:
   - Sign in with Clerk
   - Create a consultation summary
   - Sign out

🎉 **Congratulations!** Your healthcare app is now running on AWS!

## Updating Your Application

When you make code changes:

**Mac/Linux**:
```bash
# 1. Rebuild with platform flag
docker build \
  --platform linux/amd64 \
  --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" \
  -t consultation-app .

# 2. Tag for ECR
docker tag consultation-app:latest $AWS_ACCOUNT_ID.dkr.ecr.$DEFAULT_AWS_REGION.amazonaws.com/consultation-app:latest

# 3. Push to ECR
docker push $AWS_ACCOUNT_ID.dkr.ecr.$DEFAULT_AWS_REGION.amazonaws.com/consultation-app:latest
```

**Windows PowerShell**:
```powershell
# 1. Rebuild with platform flag
docker build `
  --platform linux/amd64 `
  --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="$env:NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" `
  -t consultation-app .

# 2. Tag for ECR
docker tag consultation-app:latest "$env:AWS_ACCOUNT_ID.dkr.ecr.$env:DEFAULT_AWS_REGION.amazonaws.com/consultation-app:latest"

# 3. Push to ECR
docker push "$env:AWS_ACCOUNT_ID.dkr.ecr.$env:DEFAULT_AWS_REGION.amazonaws.com/consultation-app:latest"
```

Then in App Runner console:
1. Click your service
2. Click **Deploy**
3. Wait for deployment to complete

## Cost Management

### Expected Costs

With minimal configuration (1 instance always running):
- App Runner: ~$0.007/hour = ~$5/month for continuous running
- ECR: ~$0.10/GB/month for image storage
- Total: ~$5-6/month

### How to Save Money

1. **Pause when not using**: Pause your App Runner service (Actions → Pause service)
2. **Use free tier**: New AWS accounts get credits
3. **Monitor budgets**: Check your email for alerts
4. **Clean up ECR**: Delete old image versions

## Troubleshooting

### Docker Issues

**"Cannot connect to Docker daemon"**:
- Make sure Docker Desktop is running

**"Exec format error" when running container**:
- You forgot `--platform` flag. Rebuild with `--platform linux/amd64`

### AWS Issues

**"Unauthorized" in ECR push**:
- Re-authenticate: `aws ecr get-login-password --region YOUR-REGION | docker login --username AWS --password-stdin [your-ecr-url]`

**"Access Denied" errors**:
- Check IAM user has all required policies
- Verify AWS CLI is configured with correct credentials

### Application Issues

**Clerk authentication not working**:
- Verify all three Clerk environment variables
- Check JWKS URL matches your Clerk app
- Ensure frontend was built with public key

**API calls failing**:
- Check browser console for CORS errors
- Verify `/api/consultation` path is correct
- Check CloudWatch logs for Python errors

## Next Steps

1. **Custom domain**: Add your own domain in App Runner settings
2. **Auto-deployment**: Set up GitHub Actions for automated deployments
3. **Monitoring**: Add CloudWatch alarms for errors

Happy deploying! 🚀

