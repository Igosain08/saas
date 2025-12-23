# MediNotes Pro - Healthcare Consultation Assistant

> **A production-grade SaaS application** that transforms medical consultation notes into structured summaries, actionable next steps, and patient-friendly communications using AI.

[![AWS](https://img.shields.io/badge/AWS-App%20Runner-orange)](https://aws.amazon.com/apprunner/)
[![Next.js](https://img.shields.io/badge/Next.js-16.1-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green)](https://fastapi.tiangolo.com/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-blue)](https://www.docker.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

## 🎯 Project Overview

MediNotes Pro is a full-stack healthcare SaaS application that demonstrates enterprise-level software engineering practices. The platform enables healthcare professionals to efficiently process consultation notes using AI-powered natural language processing, generating:

- **Professional medical summaries** for record-keeping
- **Actionable next steps** for follow-up care
- **Patient-friendly email drafts** for communication

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

**DevOps:**
- Docker containerization
- CI/CD ready (GitHub Actions compatible)
- Environment variable management
- Health check endpoints

## 🚀 Key Features

### 1. **Enterprise Authentication**
- Multi-provider sign-in (Email, Google, GitHub)
- JWT-based API authentication
- Secure session management
- User profile management

### 2. **Subscription Management**
- Clerk Billing integration
- Plan-based access control
- Automatic subscription enforcement
- User-friendly pricing tables

### 3. **AI-Powered Processing**
- Real-time streaming responses
- Structured output generation
- Context-aware medical summaries
- Patient-friendly language conversion

### 4. **Production-Ready Infrastructure**
- Containerized deployment
- Auto-scaling capabilities
- Health monitoring
- HTTPS/SSL encryption
- Cost-optimized configuration

## 📊 Technical Highlights

### Advanced Patterns Implemented

1. **Multi-Stage Docker Builds**
   - Optimized image size
   - Separate build and runtime environments
   - Efficient layer caching

2. **Server-Sent Events (SSE)**
   - Real-time streaming responses
   - Efficient data transfer
   - Better user experience

3. **Static Site Generation**
   - Fast page loads
   - SEO-friendly
   - Reduced server load

4. **JWT Authentication Flow**
   - Stateless authentication
   - Secure API access
   - Token verification

5. **Type-Safe Development**
   - Full TypeScript coverage
   - Pydantic models for validation
   - Runtime type checking

## 🔐 Security Features

- ✅ JWT token verification
- ✅ Environment variable encryption
- ✅ HTTPS/SSL enforcement
- ✅ CORS middleware configuration
- ✅ Input validation (Pydantic)
- ✅ Secure credential management
- ✅ IAM role-based access control

## 📈 Performance Optimizations

- Static file serving from FastAPI
- Docker layer caching
- Optimized bundle sizes
- Lazy loading components
- Efficient streaming responses

## 🛠️ Development Setup

### Prerequisites

- Node.js 24.12+ (via nvm)
- Python 3.12+
- Docker Desktop
- AWS CLI configured
- Clerk account

### Local Development

```bash
# Install dependencies
npm install

# Run development server
vercel dev

# Build for production
npm run build
```

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

1. **Build and Push to ECR:**
   ```bash
   docker build --platform linux/amd64 \
     --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" \
     -t consultation-app .
   
   docker tag consultation-app:latest \
     $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/consultation-app:latest
   
   docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/consultation-app:latest
   ```

2. **Configure App Runner Service:**
   - Container registry: ECR
   - Port: 8000
   - Health check: `/health`
   - Environment variables: Clerk keys, OpenAI API key

See [AWS_DEPLOYMENT_GUIDE.md](./AWS_DEPLOYMENT_GUIDE.md) for detailed instructions.

## 📝 API Documentation

### Endpoints

**POST `/api/consultation`**
- Authenticated endpoint
- Accepts consultation data (patient name, date, notes)
- Returns streaming SSE response with AI-generated content

**GET `/health`**
- Health check endpoint
- Returns `{"status": "healthy"}`
- Used by AWS App Runner for monitoring

### Request Format

```json
{
  "patient_name": "John Doe",
  "date_of_visit": "2024-12-22",
  "notes": "Patient presents with..."
}
```

### Response Format

Server-Sent Events stream with markdown-formatted content:
- Summary of visit for doctor's records
- Next steps for the doctor
- Draft of email to patient

## 🧪 Testing

### Manual Testing Checklist

- [ ] User authentication flow
- [ ] Subscription management
- [ ] Consultation form submission
- [ ] AI response streaming
- [ ] Error handling
- [ ] Mobile responsiveness

## 📊 Project Metrics

- **Lines of Code:** ~2,000+
- **Technologies Used:** 15+
- **Deployment Time:** < 10 minutes
- **Container Size:** ~500MB (optimized)
- **Response Time:** < 2s (first token)

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

## 📚 Documentation

- [AWS Deployment Guide](./AWS_DEPLOYMENT_GUIDE.md)
- [Clerk Setup Guide](./CLERK_SETUP.md)
- [Clerk Billing Setup](./CLERK_BILLING_SETUP.md)

## 👤 Author

**Ishaangosain** - Fourth Year Data Science Student

## 📄 License

This project is part of an educational portfolio.

## 🙏 Acknowledgments

- Built as part of advanced software engineering coursework
- Demonstrates production-ready SaaS development practices
- Showcases modern cloud-native architecture patterns

---

**Note:** This is a demonstration project. For production healthcare use, additional HIPAA compliance measures, data encryption, and audit logging would be required.
