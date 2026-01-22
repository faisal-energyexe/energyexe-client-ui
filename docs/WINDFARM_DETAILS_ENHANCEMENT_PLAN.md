# Wind Farm Details Page Enhancement Plan

## Executive Summary

This document outlines the implementation plan for enhancing the Wind Farm Details page in the EnergyExe Client Portal. The goal is to provide users with comprehensive, actionable insights about individual wind farms.

---

## Current State Analysis

### Issues Identified and Fixed

| Issue | Root Cause | Resolution | Status |
|-------|------------|------------|--------|
| Generation Tab not showing data | Missing `/generation/windfarm-stats` endpoint | Created new endpoint in `generation.py` | ✅ Fixed |
| Price Profile Tab errors | Method mismatch (GET vs POST) | Added GET variant for `/prices/analytics/price-profile/{bidzone_id}` | ✅ Fixed |
| No performance overview on landing | Missing component | Created `GenerationPerformanceCard` | ✅ Fixed |
| No data availability indicators | Missing component | Created `DataAvailabilityAlert` | ✅ Fixed |
| Limited turbine information | Minimal display | Created `TurbineFleetSummary` | ✅ Fixed |

### Newly Added Components

1. **GenerationPerformanceCard** (`src/components/windfarms/generation-performance-card.tsx`)
   - Shows capacity factor, total generation, operating hours
   - Performance rating badges (Excellent/Good/Fair/Poor)
   - Performance insights with positive/negative indicators
   - Uses existing `/generation/windfarm-stats` endpoint

2. **DataAvailabilityAlert** (`src/components/windfarms/data-availability-alert.tsx`)
   - Warns users about missing data (generation, weather, prices)
   - Explains why certain analytics may be unavailable
   - Compact badge mode for inline use

3. **TurbineFleetSummary** (`src/components/windfarms/turbine-fleet-summary.tsx`)
   - Detailed breakdown by turbine model
   - Shows rated power, hub height, rotor diameter per model
   - Capacity comparison with nameplate capacity
   - Visual progress bars for fleet composition

---

## Future Enhancements Roadmap

### Phase 1: Data Tab Improvements (Priority: High)

#### 1.1 Generation Tab Enhancements
**Estimated Effort:** Medium

**Current State:**
- Time series chart
- Heatmap
- KPI cards

**Proposed Enhancements:**
```
- [ ] Add capacity factor trend overlay on generation chart
- [ ] Add peer comparison toggle (vs same bidzone, country)
- [ ] Add data quality indicators per data point
- [ ] Add "Export to CSV" button for time series data
- [ ] Add daily/weekly/monthly aggregation toggle
- [ ] Add year-over-year comparison view
```

**Backend Requirements:**
- Peer comparison data aggregation endpoint
- Year-over-year comparison query support

#### 1.2 Weather Tab Enhancements
**Estimated Effort:** Medium

**Current State:**
- Wind rose chart
- Correlation scatter
- Power curve
- Distribution charts

**Proposed Enhancements:**
```
- [ ] Add weather forecast integration (if available)
- [ ] Add extreme weather event markers
- [ ] Add Weibull distribution parameters display
- [ ] Add wind direction analysis by season
- [ ] Improve power curve with confidence intervals
```

**Backend Requirements:**
- Weather forecast API integration (future)
- Statistical analysis endpoints for distribution fitting

#### 1.3 Market Tab Enhancements
**Estimated Effort:** Medium

**Current State:**
- Price profile
- Capture rate
- Revenue chart
- Correlation analysis

**Proposed Enhancements:**
```
- [ ] Add PPA overlay on price charts (if PPA exists)
- [ ] Add merchant vs contracted revenue split
- [ ] Add price scenario analysis (historical percentiles)
- [ ] Add negative price hours summary
- [ ] Add revenue optimization recommendations
```

**Backend Requirements:**
- PPA data integration
- Price scenario analysis endpoints

---

### Phase 2: New Tabs (Priority: Medium)

#### 2.1 Events & Timeline Tab
**Estimated Effort:** Large

**Description:**
A chronological view of significant events for the wind farm.

**Features:**
```
- [ ] Timeline visualization of key events
- [ ] Event types: commissioning, outages, upgrades, ownership changes
- [ ] Event annotations on charts (click to see on generation tab)
- [ ] User-addable notes and comments
```

**Backend Requirements:**
```python
# New table: windfarm_events
class WindfarmEvent(Base):
    __tablename__ = "windfarm_events"
    id: int
    windfarm_id: int (FK)
    event_type: str  # commissioning, outage, upgrade, ownership_change, etc.
    event_date: date
    description: str
    impact_rating: str  # high, medium, low
    created_by: int (FK to users)
    created_at: datetime

# New endpoints:
# GET /windfarms/{id}/events
# POST /windfarms/{id}/events
# PATCH /windfarms/{id}/events/{event_id}
# DELETE /windfarms/{id}/events/{event_id}
```

#### 2.2 Documents & Contracts Tab
**Estimated Effort:** Large

**Description:**
Document management for PPAs, permits, and related files.

**Features:**
```
- [ ] PPA summary cards with key terms
- [ ] Document upload and categorization
- [ ] Contract expiration alerts
- [ ] Key dates extraction
```

**Backend Requirements:**
- Document storage integration (S3 or similar)
- Document metadata management
- PPA data model extension

#### 2.3 Benchmarking Tab
**Estimated Effort:** Medium

**Description:**
Dedicated peer comparison and benchmarking view.

**Features:**
```
- [ ] Automatic peer selection (same bidzone, similar capacity)
- [ ] Radar chart comparison with up to 5 peers
- [ ] Percentile ranking visualization
- [ ] Benchmark KPIs: CF, availability, capture rate
- [ ] Historical ranking trend
```

**Backend Requirements:**
- Peer selection algorithm
- Percentile calculation endpoints
- Historical ranking storage

---

### Phase 3: Advanced Features (Priority: Low)

#### 3.1 AI-Powered Insights
**Estimated Effort:** Very Large

**Description:**
Automated insights and anomaly explanations.

**Features:**
```
- [ ] Natural language performance summary
- [ ] Anomaly detection with explanations
- [ ] Performance forecasts
- [ ] Optimization recommendations
```

**Backend Requirements:**
- ML model integration
- Natural language generation service
- Anomaly explanation system

#### 3.2 Real-Time Dashboard
**Estimated Effort:** Very Large

**Description:**
Live data updates for active monitoring.

**Features:**
```
- [ ] Live generation indicator (if real-time data available)
- [ ] Current wind conditions
- [ ] Today's revenue projection
- [ ] Active alerts banner
```

**Backend Requirements:**
- WebSocket infrastructure
- Real-time data ingestion pipeline
- Live data caching layer

---

## Implementation Priority Matrix

| Enhancement | Business Value | Technical Effort | Priority |
|-------------|----------------|------------------|----------|
| Generation Tab - Peer Comparison | High | Medium | P1 |
| Market Tab - PPA Integration | High | Medium | P1 |
| Events Timeline Tab | Medium | Large | P2 |
| Benchmarking Tab | Medium | Medium | P2 |
| Weather Forecasts | Medium | Large | P2 |
| Documents Tab | Medium | Large | P3 |
| AI Insights | High | Very Large | P3 |
| Real-Time Dashboard | High | Very Large | P3 |

---

## Technical Architecture Notes

### Frontend Patterns to Follow

1. **Component Structure:**
   ```
   src/components/windfarms/
   ├── index.ts                    # Barrel exports
   ├── windfarm-hero.tsx           # Hero section
   ├── technical-specs.tsx         # Specs card
   ├── generation-performance-card.tsx  # NEW: Performance overview
   ├── data-availability-alert.tsx      # NEW: Data alerts
   ├── turbine-fleet-summary.tsx        # NEW: Turbine details
   └── [future-components].tsx
   ```

2. **API Pattern:**
   - React Query hooks in `src/lib/*-api.ts`
   - Consistent error handling with loading/error states
   - 5-minute stale time for analytics data

3. **Styling:**
   - Use Obsidian dark theme classes
   - Glass morphism with `bg-card/50 backdrop-blur-sm`
   - Border styling: `border-border/50`
   - Primary color for icons and accents

### Backend Patterns to Follow

1. **Endpoint Structure:**
   ```python
   # Pattern for new analytics endpoints
   @router.get("/windfarms/{windfarm_id}/[feature]")
   async def get_windfarm_feature(
       windfarm_id: int,
       start_date: datetime = Query(...),
       end_date: datetime = Query(...),
       current_user: User = Depends(get_current_user),
       db: AsyncSession = Depends(get_db)
   ) -> FeatureResponse:
       service = FeatureService(db)
       return await service.get_feature(windfarm_id, start_date, end_date)
   ```

2. **Service Layer:**
   - Business logic in services, not endpoints
   - Dependency injection for database sessions
   - Async operations throughout

---

## Testing Requirements

### Frontend Tests
- [ ] Component unit tests for new cards
- [ ] Integration tests for API hooks
- [ ] E2E tests for wind farm details page flow

### Backend Tests
- [ ] Unit tests for new service methods
- [ ] Integration tests for new endpoints
- [ ] Performance tests for complex queries

---

## Migration Notes

### Database Changes Required

None for Phase 1 (current implementation).

For future phases:
- `windfarm_events` table for Timeline feature
- `documents` table for Document management
- Index optimizations for peer comparison queries

---

## Deployment Checklist

- [ ] Run database migrations (if any)
- [ ] Deploy backend changes
- [ ] Build and deploy frontend
- [ ] Verify endpoints in staging
- [ ] Test all tabs with real data
- [ ] Monitor error rates post-deployment

---

## Appendix: API Endpoint Reference

### New Endpoints Added

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/generation/windfarm-stats` | GET | Yes | Windfarm generation statistics |
| `/prices/analytics/price-profile/{bidzone_id}` | GET | Yes | Price profile for bidzone |

### Existing Endpoints Used

| Endpoint | Method | Used By |
|----------|--------|---------|
| `/generation/hourly` | GET | GenerationTab |
| `/weather-data/windfarms/{id}/statistics` | GET | WeatherTab |
| `/weather-data/windfarms/{id}/wind-rose` | GET | WeatherTab |
| `/prices/windfarms/{id}/statistics` | GET | MarketTab |
| `/prices/analytics/capture-rate/{id}` | GET | MarketTab |
| `/prices/analytics/revenue/{id}` | GET | MarketTab |

---

*Document Version: 1.0*
*Last Updated: January 2026*
*Author: Development Team*
