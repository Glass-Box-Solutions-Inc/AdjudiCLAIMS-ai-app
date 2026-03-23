# Adjudica.ai PD Calculator - Complete Technical Documentation

**GCP Project**: adjudica-production (884982654247)
**Deployed**: December 25, 2025
**Created By**: Glass Box Solutions, Inc.

---

## Executive Summary

The Adjudica.ai PD Calculator is a sophisticated California Workers' Compensation Permanent Disability Rating Calculator with AI-powered occupational group analysis, global usage tracking, and comprehensive analytics.

### Live URLs
- **Production**: https://calculator.adjudica.ai
- **Vercel**: https://calculator-deploy-ivory.vercel.app
- **Cloud Run**: https://pd-calculator-884982654247.us-central1.run.app

---

## Architecture Overview

### Technology Stack

#### Frontend
- **Framework**: React 18 (UMD build - no build process required)
- **Build System**: None (single-file deployment)
- **Styling**: Inline CSS with custom design system
- **File Size**: 172 KB (3,023 lines) single HTML file
- **Deployment**: Vercel Serverless + Docker/Cloud Run

#### Backend
- **API**: Vercel Serverless Functions (Node.js)
- **Database**: Supabase PostgreSQL
- **Analytics**: Google Analytics 4
- **AI Integration**: n8n webhook for occupational analysis

#### Infrastructure
- **Hosting**: Vercel (primary) + GCP Cloud Run (backup)
- **CDN**: Vercel Edge Network
- **Database**: Supabase (vhknfdtzgavgzvqbybfg.supabase.co)
- **Container**: Docker + nginx (for Cloud Run deployment)

---

## Core Features

### 1. PD Rating Calculation Engine

**Supported PDRS Versions**:
- 1997 Schedule
- 2005 Schedule
- 2013+ Schedule (current)

**Calculation Components**:
- **Whole Person Impairment (WPI)**: 1-100% with 0.25% increments
- **Future Earnings Capacity (FEC)**: Adjusted for occupation
- **Diminished Future Earning Capacity (DFEC)**: FEC formula
- **Age Adjustment**: Based on DOI and DOB
- **Multiple Injuries**: Proportionate calculation support
- **Ogilvie Rebuttal**: FEC/DFEC formula override

**Advanced Features**:
- Multiple dates of injury (DOI) with proportionate calculations
- Standard vs. Non-Standard occupation groups
- Automatic age calculation from DOB + DOI
- Compound rating for multiple impairments

### 2. AI-Powered Occupational Group Analysis

**Integration**: n8n webhook endpoint
**Webhook URL**: `https://glassboxinc.app.n8n.cloud/webhook/analyze-occupation`

**Process**:
1. User enters job description (5-5000 characters)
2. Front-end validates and rate-limits requests (6/minute max)
3. Sends job description to n8n webhook
4. AI analyzes and returns DOT code + occupational group
5. Results auto-populate in calculator

**Security**:
- Rate limiting: 10-second cooldown between requests
- Input validation: 5-5000 character limit
- Request throttling: 6 requests per minute max
- XSS protection: Input sanitization

### 3. Extremity Converter

Converts between different impairment percentage types:
- **WPI** (Whole Person Impairment)
- **UE** (Upper Extremity)
- **LE** (Lower Extremity)
- **Hand** impairment
- **Digit** impairment

**Conversion Formulas**:
- UE to WPI: `UE × 0.60`
- LE to WPI: `LE × 0.40`
- Hand to WPI: `Hand × 0.60 × 0.54`
- Digit to WPI: `Digit × 0.60 × 0.54 × [digit factor]`

### 4. Global Usage Counter

**Purpose**: Track total rating strings generated across all users

**Architecture**:
```
Frontend (localStorage)
    ↓
POST /api/counter
    ↓
Vercel Serverless Function
    ↓
Supabase PostgreSQL (calculator_stats table)
    ↓
Returns updated count
```

**Database Schema**:
```sql
CREATE TABLE calculator_stats (
  id INTEGER PRIMARY KEY DEFAULT 1,
  count INTEGER NOT NULL DEFAULT 121,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (id = 1) -- Ensures single row
);
```

**Features**:
- Real-time global counter display
- Starts at 121 (pre-seeded)
- Auto-increments on rating generation
- Fallback to localStorage if API fails
- Row-level security policies for public access

### 5. Google Analytics 4 Integration

**Tracked Events**:
1. **Page Views**: Landing page visits
2. **Rating Calculations**: Each PD rating generated
3. **AI Analysis**: Occupational group suggestions
4. **Prints**: Print button clicks
5. **Tab Changes**: Navigation between tabs
6. **Converter Usage**: Extremity conversion calculations

**Implementation**:
```javascript
gtag('event', 'pd_rating_calculated', {
  'event_category': 'Calculator',
  'event_label': `${scheduleVersion} - ${occupationGroup}`,
  'value': finalPdPercentage
});
```

---

## API Endpoints

### GET /api/counter
**Purpose**: Retrieve current global ratings count

**Response**:
```json
{
  "count": 121
}
```

**Error Handling**: Returns fallback count of 121 on failure

### POST /api/counter
**Purpose**: Increment global counter

**Request**:
```json
{
  "increment": 1
}
```

**Response**:
```json
{
  "count": 122
}
```

**CORS**: Enabled for all origins (`*`)

---

## User Interface

### Main Calculator Tab

**Inputs**:
- Date of Birth (date picker)
- Job Description (textarea, 5-5000 chars)
- Occupational Group (dropdown or AI-suggested)
- Occupation Type (Standard/Non-Standard radio)
- Schedule Version (1997/2005/2013+ dropdown)
- Dates of Injury (dynamic multi-DOI support)
- Impairments (dynamic multi-impairment grid)
  - Body part
  - WPI percentage (0.25% increments)
  - Standard/adjusted toggle

**Outputs** (Results Panel):
- Final PD Rating (%)
- Age factor
- Occupation factor
- Adjusted rating
- Proportionate calculations (if multiple DOIs)
- Rating string (copyable text)

### Extremity Converter Tab

**Inputs**:
- Source type (WPI/UE/LE/Hand/Digit)
- Source percentage (0.25% increments)
- Digit selection (if applicable)

**Outputs**:
- Converted percentages for all types
- Conversion formulas displayed

### Settings Tab

**Features**:
- Restore saved session
- Clear calculator (reset all fields)
- Delete saved data from localStorage

---

## Data Persistence

### localStorage Schema

**Key**: `adjudica_calculator_state`

**Stored Data**:
```json
{
  "dateOfBirth": "1980-01-15",
  "jobDescription": "Office administrator...",
  "occupationGroup": "4",
  "datesOfInjury": ["2023-03-15"],
  "impairments": [
    {
      "bodyPart": "Lumbar spine",
      "wpi": 10,
      "isStandard": true
    }
  ],
  "scheduleVersion": "2013",
  "savedAt": "2025-12-26T10:30:00.000Z"
}
```

**Auto-save**: Triggers on any input change (debounced)

---

## Deployment Architecture

### Vercel Deployment (Primary)

**Files Deployed**:
```
calculator-deploy/
├── index.html          # 172KB single-page app
├── api/
│   └── counter.js      # Serverless function
└── .env.local          # Environment variables
```

**Environment Variables**:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `GA_MEASUREMENT_ID`

**Deployment Command**:
```bash
cd calculator-deploy
vercel --prod
```

### GCP Cloud Run Deployment (Backup)

**Container Configuration**:
```dockerfile
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
```

**nginx Configuration**:
- Serves static HTML on port 8080
- Gzip compression enabled
- Cache headers for static assets

**Deployment**:
```bash
gcloud run deploy pd-calculator \
  --project=adjudica-production \
  --region=us-central1 \
  --platform=managed \
  --allow-unauthenticated
```

---

## Security Features

### Input Validation
- Job description: 5-5000 character limit
- WPI percentages: 0-100% with 0.25% increments
- Date validation: DOI cannot be before DOB
- XSS protection: All inputs sanitized

### Rate Limiting
- AI analysis: 10-second cooldown between requests
- Request throttling: Max 6 requests per minute
- Tracked per browser session

### Data Security
- localStorage only (no sensitive data stored)
- CORS enabled for API endpoints
- Supabase RLS policies for database access
- No authentication required (public tool)

---

## Code Structure

### Main Components (React)

1. **PDCalculatorApp** (Root)
   - State management for all inputs
   - localStorage sync
   - Tab navigation

2. **CalculatorTab**
   - Input forms
   - AI occupational analysis
   - Multi-DOI/impairment management

3. **ResultsPanel**
   - PD calculation engine
   - Rating string generation
   - Print functionality

4. **ExtremityConverterTab**
   - Conversion calculator
   - Formula display

5. **SettingsTab**
   - Data management
   - Session restore

### Utility Functions

**Storage**:
- `saveToStorage()` - Persist state to localStorage
- `loadFromStorage()` - Restore state from localStorage
- `clearStorage()` - Delete saved data

**Calculation**:
- `calculatePdRating()` - Main PD calculation engine
- `calculateAge()` - Age from DOB + DOI
- `applyFecFormula()` - FEC/DFEC calculations
- `calculateProportionate()` - Multi-DOI proportionate calc

**Analytics**:
- `trackEvent()` - Google Analytics event tracking
- `incrementGlobalCounter()` - Update Supabase counter

---

## Performance Metrics

### Bundle Size
- **Total**: 172 KB (single HTML file)
- **React UMD**: ~130 KB (CDN)
- **Custom Code**: ~42 KB

### Load Time
- **First Paint**: <1s
- **Time to Interactive**: <2s
- **Lighthouse Score**: 95+

### API Response Times
- **Counter GET**: ~200ms
- **Counter POST**: ~300ms
- **AI Analysis**: ~2-5s (external webhook)

---

## GCP Project Resources (884982654247)

### Deployed Services in adjudica-production

1. **app** (Main Adjudica app)
   - URL: https://app-884982654247.us-west2.run.app
   - Region: us-west2
   - Last deployed: 2025-12-26T15:55:26Z

2. **pd-calculator** (PD Calculator)
   - URL: https://pd-calculator-884982654247.us-central1.run.app
   - Region: us-central1
   - Last deployed: 2025-12-25T08:21:03Z

3. **ousd-campaign-api** (OUSD Backend)
   - URL: https://ousd-campaign-api-884982654247.us-central1.run.app
   - Region: us-central1
   - Last deployed: 2025-12-25T23:03:05Z

4. **ousd-campaign-frontend** (OUSD Frontend)
   - URL: https://ousd-campaign-frontend-884982654247.us-central1.run.app
   - Region: us-central1
   - Last deployed: 2025-12-25T22:23:46Z

5. **wc-paralegal-agent** (WC Paralegal Agent)
   - URL: https://wc-paralegal-agent-884982654247.us-central1.run.app
   - Region: us-central1
   - Last deployed: 2025-12-24T22:54:25Z

---

## Development Workflow

### Local Development
1. Edit `calculator-deploy/index.html`
2. Test locally: `python -m http.server 8000`
3. Open browser: `http://localhost:8000`

### Deployment
1. **To Vercel**:
   ```bash
   cd calculator-deploy
   vercel --prod
   ```

2. **To Cloud Run**:
   ```bash
   docker build -t pd-calculator .
   docker tag pd-calculator gcr.io/adjudica-production/pd-calculator
   docker push gcr.io/adjudica-production/pd-calculator
   gcloud run deploy pd-calculator --image=gcr.io/adjudica-production/pd-calculator
   ```

### Testing
- Manual testing in browser
- Print layout verification
- Mobile responsive testing
- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)

---

## Future Enhancements

### Planned Features
- [ ] User accounts and saved calculations history
- [ ] PDF export of rating strings
- [ ] Email/share rating functionality
- [ ] Advanced multi-injury calculator
- [ ] Apportionment calculator
- [ ] Medical-legal report generator integration

### Technical Improvements
- [ ] Split into multiple files (build system)
- [ ] TypeScript migration
- [ ] Unit testing (Jest)
- [ ] E2E testing (Playwright)
- [ ] Performance monitoring (Sentry)

---

## Support & Maintenance

### Monitoring
- **Analytics**: Google Analytics 4 dashboard
- **Errors**: Browser console (no centralized logging yet)
- **Uptime**: Vercel status page

### Backup & Recovery
- **Code**: Git repository (GlassBoxSolutions/Sandbox)
- **Database**: Supabase automatic backups
- **Deployments**: Vercel deployment history

### Dependencies
- React 18 (CDN)
- Babel Standalone (CDN)
- Google Fonts (Source Sans Pro)
- Supabase client (REST API)

---

## License & Attribution

**Created By**: Glass Box Solutions, Inc.
**Date**: December 25, 2025
**License**: Proprietary (Adjudica.ai)

---

**Document Version**: 1.0
**Last Updated**: December 26, 2025
