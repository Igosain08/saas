# 🏥 MediNotes Pro - Healthcare Consultation Assistant

> **A production-grade SaaS application** that transforms medical consultation notes into structured summaries, actionable next steps, and patient-friendly communications using AI.

[![AWS](https://img.shields.io/badge/AWS-App%20Runner-orange)](https://aws.amazon.com/apprunner/)
[![Next.js](https://img.shields.io/badge/Next.js-16.1-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green)](https://fastapi.tiangolo.com/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-blue)](https://www.docker.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-success)](https://github.com/features/actions)

## 🎯 Project Overview

MediNotes Pro is a full-stack healthcare SaaS application that demonstrates enterprise-level software engineering practices. The platform enables healthcare professionals to efficiently process consultation notes using AI-powered natural language processing, generating:

- **Professional medical summaries** for record-keeping
- **Actionable next steps** for follow-up care
- **Patient-friendly email drafts** for communication

**Live Demo:** [Deployed on AWS App Runner](#)

## ✨ Key Features

### 🔐 Enterprise Authentication
- Multi-provider sign-in (Email, Google, GitHub)
- JWT-based API authentication
- Secure session management
- User profile management

### 💳 Subscription Management
- Clerk Billing integration
- Plan-based access control
- Automatic subscription enforcement
- User-friendly pricing tables

### 🤖 AI-Powered Processing
- Real-time streaming responses using Server-Sent Events
- Structured output generation
- Context-aware medical summaries
- Patient-friendly language conversion

### 🚀 Production-Ready Infrastructure
- Containerized deployment with Docker
- Auto-scaling capabilities on AWS App Runner
- Health monitoring and logging
- HTTPS/SSL encryption
- Cost-optimized configuration (~$5/month)

### 🔄 CI/CD Pipeline
- Automated testing on every push
- Docker build validation
- Automated deployment to AWS ECR
- GitHub Actions workflows

## 🏗️ Architecture

### System Design

```
┌─────────────────┐
│   Next.js       │  Static Export (Client-Side)
│   Frontend      │  - Clerk Authentication
│                 │  - Subscription Management
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│   FastAPI       │  Python Backend
│   Backend       │  - JWT Authentication
│                 │  - OpenAI Integration
│                 │  - SSE Streaming
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   AWS App       │  Container Orchestration
│   Runner        │  - Auto-scaling
│                 │  - Health Checks
│                 │  - HTTPS/SSL
└─────────────────┘
```

### Technology Stack

**Frontend:**
- Next.js 16.1 (Pages Router, Static Export)
- TypeScript
- React 19
- Tailwind CSS
- Clerk (Authentication & Billing)
- React Markdown

**Backend:**
- FastAPI (Python 3.12)
- OpenAI GPT-5-nano API
- Server-Sent Events (SSE) for streaming
- JWT authentication via Clerk

**Infrastructure:**
- Docker (Multi-stage builds)
- AWS App Runner
- AWS ECR (Container Registry)
- AWS IAM (Access Management)
- GitHub Actions (CI/CD)

**DevOps:**
- Docker containerization
- Automated CI/CD pipeline
- Environment variable management
- Health check endpoints

## 🚀 Quick Start

### Prerequisites

- Node.js 24.12+ (via nvm)
- Python 3.12+
- Docker Desktop
- AWS CLI configured
- Clerk account

### Local Development

```bash
# Clone the repository
git clone https://github.com/Igosain08/saas.git
cd saas

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Clerk keys

# Run development server
vercel dev
```

Visit `http://localhost:3000` to see the application.

### Docker Development

```bash
# Build image
docker build --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" -t consultation-app .

# Run container
docker run -p 8000:8000 \
  -e CLERK_SECRET_KEY="$CLERK_SECRET_KEY" \
  -e CLERK_JWKS_URL="$CLERK_JWKS_URL" \
  -e OPENAI_API_KEY="$OPENAI_API_KEY" \
  consultation-app
```

## 🚢 Deployment

### AWS App Runner Deployment

The project includes automated CI/CD via GitHub Actions. See [AWS_DEPLOYMENT_GUIDE.md](./AWS_DEPLOYMENT_GUIDE.md) for detailed instructions.

**Quick Deploy:**

1. **Set up AWS:**
   - Create ECR repository: `consultation-app`
   - Create App Runner service
   - Configure environment variables

2. **Add GitHub Secrets:**
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

3. **Push to main:**
   ```bash
   git push origin main
   ```
   - CI/CD pipeline automatically builds and deploys!

See [CI_CD_SETUP.md](./CI_CD_SETUP.md) for CI/CD configuration.

## 📝 API Documentation

### Endpoints

**POST `/api/consultation`**
- **Authentication:** Required (Bearer JWT)
- **Request Body:**
  ```json
  {
    "patient_name": "John Doe",
    "date_of_visit": "2024-12-22",
    "notes": "Patient presents with..."
  }
  ```
- **Response:** Server-Sent Events stream with markdown-formatted content:
  - Summary of visit for doctor's records
  - Next steps for the doctor
  - Draft of email to patient

**GET `/health`**
- **Authentication:** Not required
- **Response:** `{"status": "healthy"}`
- **Purpose:** Health check for AWS App Runner

## 🔐 Security Features

- ✅ JWT token verification
- ✅ Environment variable encryption
- ✅ HTTPS/SSL enforcement
- ✅ CORS middleware configuration
- ✅ Input validation (Pydantic)
- ✅ Secure credential management
- ✅ IAM role-based access control

## 📊 Performance

- **Page Load:** < 1s (static files)
- **API Response (first token):** < 2s
- **Container Size:** ~500MB (optimized)
- **Memory Usage:** ~200MB idle, ~400MB active
- **Cost:** ~$5/month operational

## 🧪 Testing

### CI/CD Testing

The project includes automated testing via GitHub Actions:

- **Frontend:** Build validation, linting
- **Backend:** Python syntax checking
- **Docker:** Build validation

### Manual Testing Checklist

- [ ] User authentication flow
- [ ] Subscription management
- [ ] Consultation form submission
- [ ] AI response streaming
- [ ] Error handling
- [ ] Mobile responsiveness

## 📚 Documentation

- [README.md](./README.md) - This file
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Detailed architecture documentation
- [AWS_DEPLOYMENT_GUIDE.md](./AWS_DEPLOYMENT_GUIDE.md) - AWS deployment instructions
- [CI_CD_SETUP.md](./CI_CD_SETUP.md) - CI/CD pipeline setup
- [CLERK_SETUP.md](./CLERK_SETUP.md) - Clerk authentication setup
- [CLERK_BILLING_SETUP.md](./CLERK_BILLING_SETUP.md) - Subscription setup
- [TECHNICAL_SKILLS.md](./TECHNICAL_SKILLS.md) - Skills demonstrated
- [RESUME_SUMMARY.md](./RESUME_SUMMARY.md) - Resume-ready project summary

## 🎓 Learning Outcomes

This project demonstrates:

1. **Full-Stack Development**
   - Modern frontend frameworks
   - RESTful API design
   - Real-time data streaming

2. **Cloud Infrastructure**
   - Container orchestration
   - Serverless deployment
   - Auto-scaling configuration

3. **DevOps Practices**
   - CI/CD pipeline setup
   - Docker containerization
   - Environment management

4. **Security Best Practices**
   - Authentication & authorization
   - Secure credential handling
   - API security

5. **AI Integration**
   - LLM API integration
   - Prompt engineering
   - Streaming responses

## 🔮 Future Enhancements

- [ ] Database integration (PostgreSQL/RDS)
- [ ] User dashboard with consultation history
- [ ] Multi-language support
- [ ] Voice input for notes
- [ ] PDF export functionality
- [ ] Analytics dashboard
- [ ] Webhook integrations
- [ ] Mobile app (React Native)

## 🤝 Contributing

This is a portfolio project. Contributions and feedback are welcome!

## 📄 License

This project is part of an educational portfolio.

## 👤 Author

**Ishaangosain** - Fourth Year Data Science Student

- GitHub: [@Igosain08](https://github.com/Igosain08)
- Project: [MediNotes Pro](https://github.com/Igosain08/saas)

## 🙏 Acknowledgments

- Built as part of advanced software engineering coursework
- Demonstrates production-ready SaaS development practices
- Showcases modern cloud-native architecture patterns

## 📈 Project Metrics

- **Lines of Code:** ~2,000+
- **Technologies Used:** 15+
- **Deployment Time:** < 10 minutes
- **Container Size:** ~500MB (optimized)
- **Response Time:** < 2s (first token)
- **Monthly Cost:** ~$5-6 (AWS)

## 🏆 Highlights

- ✅ **Production Deployment** on AWS App Runner
- ✅ **CI/CD Pipeline** with GitHub Actions
- ✅ **Containerized** with Docker
- ✅ **Enterprise Authentication** with Clerk
- ✅ **AI Integration** with OpenAI
- ✅ **Real-time Streaming** with SSE
- ✅ **Comprehensive Documentation**
- ✅ **Cost Optimized** infrastructure

---

**Note:** This is a demonstration project. For production healthcare use, additional HIPAA compliance measures, data encryption, and audit logging would be required.

**⭐ If you find this project helpful, please star it on GitHub!**
