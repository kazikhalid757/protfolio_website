'use client';

import React, { useState } from 'react';
import { 
  Layers, 
  Terminal, 
  Server, 
  ShieldCheck, 
  Cpu, 
  Check, 
  Code2, 
  ArrowRight,
  Zap
} from 'lucide-react';

export default function QualityRadar() {
  const tiers = [
    {
      id: 'e2e',
      level: 'Tier 1 // Top',
      title: 'End-to-End & Cross-Browser User Journeys',
      ratio: '15% Volume',
      execution: '~2.5 Mins Parallel',
      tooling: 'Playwright v1.40, Cypress, Selenium Grid 4',
      objective: 'Verify critical revenue paths (Auth, Checkout, Payment, Responsive Drawer) across Chrome, Firefox, Safari, and Edge.',
      flakinessRule: 'Strict auto-waiting assertions (no hardcoded sleeps). DOM resilient locators using getByRole and data-testid.',
      codeSample: `// Playwright POM critical path assertion
await test.step('Verify checkout price calculation with discount', async () => {
  await checkoutPage.applyCoupon('QA_ZERO_DEFECT');
  await expect(checkoutPage.discountBadge).toBeVisible();
  await expect(checkoutPage.finalPrice).toHaveText('$84.50');
  await checkoutPage.submitPayment();
  await expect(page).toHaveURL(/.*order-confirmation/);
});`
    },
    {
      id: 'api',
      level: 'Tier 2 // Core',
      title: 'API Microservice Contract & Schema Validation',
      ratio: '35% Volume',
      execution: '< 15 Seconds',
      tooling: 'REST Assured, Postman/Newman, Karate DSL',
      objective: 'Validate JSON Schema contracts, OAuth2 token rotation, idempotency headers, and microservice HTTP response times.',
      flakinessRule: 'Independent mocked dependencies and transient test tokens with automated teardown.',
      codeSample: `// REST Assured microservice contract assertion
given()
  .header("Authorization", "Bearer " + jwtToken)
  .contentType(ContentType.JSON)
  .body(orderPayload)
.when()
  .post("/api/v1/orders")
.then()
  .statusCode(201)
  .time(lessThan(250L), TimeUnit.MILLISECONDS)
  .body(matchesJsonSchemaInClasspath("schemas/order-schema.json"));`
    },
    {
      id: 'integration',
      level: 'Tier 3 // Foundation',
      title: 'Component, Mocked & State Integration',
      ratio: '35% Volume',
      execution: '< 8 Seconds',
      tooling: 'Docker, Testcontainers, PyTest, Jest',
      objective: 'Isolate database transactions, Redis cache invalidation, and component rendering states in containerized test runners.',
      flakinessRule: 'Ephemeral testcontainers disposed after suite completion to guarantee zero state leakage.',
      codeSample: `// Containerized integration test
@Container
public static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine");

@Test
void assertUserEntitlementPersisted() {
  userRepository.save(new UserEntity("sdet-kazi", Role.QA_LEAD));
  assertThat(entitlementService.hasClearance("sdet-kazi")).isTrue();
}`
    },
    {
      id: 'security-perf',
      level: 'Tier 4 // Guard',
      title: 'Security Gates & Load Stress Profiling',
      ratio: '15% Volume',
      execution: 'Scheduled & Pre-Release',
      tooling: 'Apache JMeter 5.6, OWASP ZAP, Google VRP Standard',
      objective: 'Audit OWASP Top 10 boundary parameters, SQLi/XSS vulnerabilities, and benchmark latency under 1,500 RPS concurrent load.',
      flakinessRule: 'P95 response thresholds assert latency SLA < 200ms; zero 5xx server exceptions allowed.',
      codeSample: `// JMeter headless CLI regression benchmark
jmeter -n -t performance-test.jmx \\
  -l results.jtl -e -o ./report \\
  -Jthreads=500 -Jrampup=10 \\
  -Jthreshold_p95_ms=200`
    }
  ];

  const [selectedTier, setSelectedTier] = useState(tiers[0]);

  return (
    <section 
      id="quality-radar" 
      style={{ 
        padding: '5.5rem 0', 
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0'
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div className="section-head-left">
          <div className="section-kicker">
            <span>[ 03 // QUALITY ARCHITECTURE & TEST PYRAMID ]</span>
          </div>
          <h2>The Test Pyramid & Quality Strategy</h2>
          <p>
            How I structure test automation to guarantee maximum defect detection velocity, zero flakiness, and fast CI/CD feedback loops.
          </p>
        </div>

        {/* Radar Interactive Bento Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '1.75rem'
          }}
          className="radar-bento"
        >
          {/* Left: The Visual Pyramid Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              SELECT TESTING LAYER TO INSPECT SPEC:
            </div>

            {tiers.map((tier) => {
              const isSelected = selectedTier.id === tier.id;
              return (
                <div
                  key={tier.id}
                  onClick={() => setSelectedTier(tier)}
                  className="spec-card"
                  style={{
                    padding: '1.25rem 1.5rem',
                    cursor: 'pointer',
                    borderColor: isSelected ? '#0f172a' : '#e2e8f0',
                    borderLeftWidth: isSelected ? '5px' : '1px',
                    borderLeftColor: isSelected ? '#059669' : '#e2e8f0',
                    backgroundColor: isSelected ? '#f8fafc' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span className="tech-stamp tech-stamp-slate" style={{ fontSize: '0.65rem' }}>
                        {tier.level}
                      </span>
                      <span className="tech-stamp tech-stamp-emerald" style={{ fontSize: '0.65rem' }}>
                        {tier.ratio}
                      </span>
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                      {tier.title}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.2rem' }}>
                      Tools: <strong style={{ color: '#334155' }}>{tier.tooling}</strong>
                    </div>
                  </div>

                  <ArrowRight size={18} color={isSelected ? '#059669' : '#cbd5e1'} />
                </div>
              );
            })}
          </div>

          {/* Right: Detailed Strategy & Actual Assertion Code */}
          <div 
            className="spec-card"
            style={{
              padding: '1.75rem',
              backgroundColor: '#f8fafc',
              border: '1px solid #cbd5e1',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="tech-stamp tech-stamp-emerald">
                  {selectedTier.level}
                </span>
                <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: '#64748b' }}>
                  EXECUTION SLA: <strong style={{ color: '#059669' }}>{selectedTier.execution}</strong>
                </span>
              </div>

              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.65rem' }}>
                {selectedTier.title}
              </h3>

              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  ARCHITECTURAL OBJECTIVE
                </div>
                <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.6 }}>
                  {selectedTier.objective}
                </p>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  FLAKINESS MITIGATION STRATEGY
                </div>
                <div 
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    fontSize: '0.86rem',
                    color: '#065f46',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem'
                  }}
                >
                  <ShieldCheck size={16} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{selectedTier.flakinessRule}</span>
                </div>
              </div>

              {/* Code Sandbox */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    PRODUCTION ASSERTION SPECIMEN
                  </div>
                  <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: '#059669' }}>
                    ✓ Production Grade
                  </span>
                </div>

                <div 
                  style={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    padding: '1rem',
                    overflowX: 'auto',
                    border: '1px solid #1e293b'
                  }}
                >
                  <pre 
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      color: '#cbd5e1',
                      margin: 0,
                      lineHeight: 1.55
                    }}
                  >
                    <code>{selectedTier.codeSample}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 960px) {
          .radar-bento {
            grid-template-columns: 1fr 1.25fr !important;
          }
        }
      `}</style>
    </section>
  );
}
