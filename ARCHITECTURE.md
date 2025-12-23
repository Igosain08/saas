# Architecture Documentation

## System Architecture Overview

MediNotes Pro follows a modern, cloud-native architecture pattern optimized for scalability, security, and maintainability.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Browser    │  │   Mobile     │  │   Desktop    │     │
│  │   (React)    │  │   (Future)   │  │   (Future)   │     │
│  └──────┬───────┘  └──────────────┘  └──────────────┘     │
└─────────┼───────────────────────────────────────────────────┘
          │ HTTPS/WSS
          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Next.js Static Export                    │  │
│  │  • Landing Page                                       │  │
│  │  • Authentication UI (Clerk)                         │  │
│  │  • Consultation Form                                  │  │
│  │  • Subscription Management                            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────┼───────────────────────────────────────────────────┘
          │ REST API / SSE
          ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Layer                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              FastAPI Backend                          │  │
│  │  • JWT Authentication                                │  │
│  │  • Request Validation (Pydantic)                      │  │
│  │  • OpenAI Integration                                 │  │
│  │  • SSE Streaming                                      │  │
│  │  • Static File Serving                                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────┼───────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                  Infrastructure Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ AWS App      │  │ AWS ECR      │  │ AWS IAM      │     │
│  │ Runner       │  │ (Registry)   │  │ (Security)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                   External Services                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Clerk      │  │   OpenAI     │  │   (Future)   │     │
│  │   (Auth)     │  │   (AI)       │  │   Database   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Component Details

### Frontend Architecture

**Technology:** Next.js 16.1 with Pages Router

**Key Decisions:**
- **Static Export:** Enables CDN deployment and reduces server costs
- **Client-Side Rendering:** Optimal for authenticated SaaS applications
- **Component-Based:** Modular, reusable React components

**Structure:**
```
pages/
├── _app.tsx          # Root component with ClerkProvider
├── _document.tsx     # HTML document structure
├── index.tsx         # Landing page
└── product.tsx       # Protected consultation form
```

**State Management:**
- React Hooks (useState, useEffect)
- Clerk SDK for authentication state
- Local component state for form data

### Backend Architecture

**Technology:** FastAPI (Python 3.12)

**Key Decisions:**
- **Async Support:** FastAPI's native async/await for performance
- **Pydantic Models:** Type-safe request validation
- **SSE Streaming:** Real-time response delivery
- **Static File Serving:** Single container deployment

**API Design:**
```python
POST /api/consultation
  - Authentication: Bearer JWT
  - Request Body: Visit model (Pydantic)
  - Response: Server-Sent Events stream

GET /health
  - No authentication required
  - Response: JSON health status
```

**Error Handling:**
- HTTP status codes
- Structured error responses
- Logging for debugging

### Authentication Flow

```
1. User visits application
   ↓
2. ClerkProvider initializes (client-side)
   ↓
3. User clicks "Sign In"
   ↓
4. Clerk modal opens (OAuth/Email)
   ↓
5. User authenticates → Clerk issues session
   ↓
6. Frontend requests JWT token from Clerk
   ↓
7. API requests include: Authorization: Bearer <JWT>
   ↓
8. Backend verifies JWT using Clerk's JWKS
   ↓
9. Request processed with user context
```

### Data Flow

**Consultation Processing:**
```
User Input (Form)
  ↓
Frontend Validation
  ↓
POST /api/consultation (with JWT)
  ↓
Backend JWT Verification
  ↓
Pydantic Model Validation
  ↓
OpenAI API Call (Streaming)
  ↓
SSE Stream to Frontend
  ↓
Real-time UI Updates
```

## Deployment Architecture

### Container Strategy

**Multi-Stage Docker Build:**
1. **Stage 1 (Frontend Builder):**
   - Node.js 22 Alpine
   - Installs dependencies
   - Builds static Next.js export
   - Output: `/app/out` directory

2. **Stage 2 (Runtime):**
   - Python 3.12 Slim
   - Installs Python dependencies
   - Copies FastAPI server
   - Copies static files from Stage 1
   - Exposes port 8000

**Benefits:**
- Smaller final image (~500MB vs ~1.5GB)
- Faster builds (layer caching)
- Security (minimal runtime dependencies)

### AWS App Runner Configuration

**Service Settings:**
- **CPU:** 0.25 vCPU (cost-optimized)
- **Memory:** 0.5 GB
- **Port:** 8000
- **Auto-scaling:** 1-1 instance (fixed for cost control)

**Health Checks:**
- **Path:** `/health`
- **Interval:** 20 seconds
- **Timeout:** 5 seconds
- **Thresholds:** 2 healthy, 5 unhealthy

**Deployment:**
- **Trigger:** Manual (cost control)
- **Source:** ECR container registry
- **Image:** `consultation-app:latest`

## Security Architecture

### Authentication & Authorization

1. **Client-Side:**
   - Clerk handles OAuth flows
   - Session management
   - Token refresh

2. **API Security:**
   - JWT tokens in Authorization header
   - JWKS verification (no database lookup)
   - Token expiration handling

3. **Subscription Enforcement:**
   - Clerk Billing integration
   - Plan-based access control
   - Client-side route protection

### Data Security

- Environment variables for secrets
- HTTPS/SSL for all communications
- CORS middleware configuration
- Input validation (Pydantic)
- No sensitive data in logs

## Scalability Considerations

### Current Limitations

- Single container deployment
- No database (stateless)
- No caching layer
- Manual scaling

### Future Scalability Path

1. **Horizontal Scaling:**
   - Multiple App Runner instances
   - Load balancer
   - Session affinity

2. **Database Integration:**
   - PostgreSQL (RDS)
   - User data persistence
   - Consultation history

3. **Caching:**
   - Redis (ElastiCache)
   - API response caching
   - Session storage

4. **CDN:**
   - CloudFront for static assets
   - Global distribution
   - Reduced latency

## Monitoring & Observability

### Current Monitoring

- AWS App Runner health checks
- CloudWatch logs
- Application logs (stdout/stderr)

### Recommended Enhancements

- CloudWatch metrics
- Error tracking (Sentry)
- Performance monitoring (New Relic)
- User analytics

## Cost Optimization

### Current Costs

- **App Runner:** ~$5/month (0.25 vCPU, 0.5GB, 1 instance)
- **ECR:** ~$0.10/month (image storage)
- **Total:** ~$5-6/month

### Optimization Strategies

- Pause service when not in use
- Use AWS Free Tier credits
- Monitor with budget alerts
- Clean up old ECR images

## Development Workflow

### Local Development

1. `vercel dev` for frontend testing
2. Docker for full-stack testing
3. Environment variables in `.env.local`

### Deployment Workflow

1. Code changes
2. Docker build (with platform flag)
3. Push to ECR
4. Manual deployment in App Runner
5. Health check verification

### CI/CD Ready

The project structure supports:
- GitHub Actions
- AWS CodePipeline
- GitLab CI/CD

## Technology Choices Rationale

### Why Next.js Static Export?

- **Pros:** Fast, SEO-friendly, CDN-ready
- **Cons:** No server-side rendering
- **Decision:** Optimal for authenticated SaaS apps

### Why FastAPI?

- **Pros:** Fast, async, type-safe, auto-docs
- **Cons:** Python ecosystem (vs Node.js)
- **Decision:** Excellent for AI/ML integrations

### Why AWS App Runner?

- **Pros:** Simple, auto-scaling, HTTPS included
- **Cons:** Less control than ECS/EKS
- **Decision:** Perfect for MVP and learning

### Why Docker?

- **Pros:** Consistent environments, easy deployment
- **Cons:** Additional complexity
- **Decision:** Industry standard, essential skill

## Performance Characteristics

### Response Times

- **Page Load:** < 1s (static files)
- **Authentication:** < 2s (Clerk)
- **API Response (first token):** < 2s
- **Full AI Response:** 10-30s (depends on content)

### Resource Usage

- **Container Memory:** ~200MB idle, ~400MB active
- **Container CPU:** < 10% average
- **Network:** Minimal (SSE efficient)

## Future Architecture Evolution

### Phase 2: Database Integration
- Add PostgreSQL (RDS)
- User consultation history
- Analytics and reporting

### Phase 3: Advanced Features
- Real-time collaboration
- Multi-tenant architecture
- Advanced AI models

### Phase 4: Enterprise Features
- HIPAA compliance
- Audit logging
- Role-based access control
- API rate limiting

---

This architecture demonstrates understanding of:
- Modern web application design
- Cloud-native patterns
- Security best practices
- Scalability considerations
- Cost optimization

