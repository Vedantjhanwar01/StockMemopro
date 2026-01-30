// UPDATED Memo Generator - Real Financial Data + AI Analysis + Info Buttons

class MemoGenerator {
    // Tooltip definitions for each section
    static TOOLTIPS = {
        priceData: "Historical price performance showing start price, end price, percentage change, maximum drawdown, and volatility for different time periods.",
        financialSnapshot: "Key financial metrics from income statements including Revenue, EBITDA, Net Profit, EPS (Earnings Per Share), and margin percentages over the past 5 years.",
        segmentBreakdown: "Revenue breakdown by business segment or product line, showing how the company generates income across different areas.",
        financialRatios: "Key profitability and efficiency ratios including ROE (Return on Equity), ROA (Return on Assets), ROCE (Return on Capital Employed), and Debt-to-Equity ratio.",
        businessSnapshot: "Quick overview of the company's business model, products/services, geographic presence, and market position.",
        whyThisCouldWork: "Management-stated claims and strategies that could drive future growth. Evidence strength indicates reliability of each claim.",
        keyRisks: "Company-disclosed risk factors that could negatively impact business performance or stock price.",
        valuationMetrics: "Valuation ratios comparing the stock price to fundamental metrics like earnings (P/E), book value (P/B), sales (P/S), and enterprise value to EBITDA.",
        judgmentSupport: "Non-advisory assessment of business quality, evidence strength, and uncertainty level to support investment analysis.",
        validationNeeds: "Key assumptions and claims that require further verification before making investment decisions.",
        narrativeContext: "Recent news, events, and developments that may affect the company's outlook."
    };

    generateMemo(company, researchData) {
        const sections = [];

        // Title
        sections.push(this.generateTitle(company));

        // NEW: Section 1 - Price & Market Data (with numbers)
        sections.push(this.generatePriceData(researchData.priceData));

        // NEW: Section 2 - Financial Snapshot (table)
        sections.push(this.generateFinancialSnapshot(researchData.financialSnapshot));

        // NEW: Section 3 - Segment Breakdown
        sections.push(this.generateSegmentBreakdown(researchData.segmentBreakdown));

        //NEW: Section 4 - Financial Ratios (table)
        sections.push(this.generateFinancialRatiosTable(researchData.financialRatios));

        // Section 5: Business Snapshot (AI)
        sections.push(this.generateBusinessSnapshot(researchData.businessSnapshot));

        // Section 6: Why This Could Work (AI)
        sections.push(this.generateWhyThisCOULDWork(researchData.whyThisCOULDWork));

        // Section 7: Key Risks (AI)
        sections.push(this.generateKeyRisks(researchData.keyRisks));

        // NEW: Section 8 - Valuation Context (with PE ratios)
        sections.push(this.generateValuationContext(researchData.valuationMetrics, researchData.valuationSanity));

        // Section 9: Judgment Support (AI)
        sections.push(this.generateJudgmentSupport(researchData.judgmentSupport));

        // Section 10: Validation Needs (AI)
        sections.push(this.generateValidationNeeds(researchData.validationNeeds));

        // Section 11: News & Events (AI)
        sections.push(this.generateNarrativeContext(researchData.narrativeContext));

        // Disclaimer
        sections.push(this.generateDisclaimer());

        return sections.join('\\n\\n');
    }

    generateSectionHeading(title, tooltipKey) {
        const tooltip = MemoGenerator.TOOLTIPS[tooltipKey] || '';
        return `<div class="section-heading-wrapper">
            <h2 class="memo-section-heading">${title}</h2>
            <button class="info-btn" type="button" aria-label="Info about ${title}">
                ℹ
                <span class="info-tooltip">${tooltip}</span>
            </button>
        </div>`;
    }

    generateTitle(company) {
        return `<div class="memo-title">
            ${company.name} | ${company.exchange} | ${company.sector}
            <div class="memo-subtitle">StockMemo — Analytical Research Report</div>
        </div>`;
    }

    generatePriceData(priceData) {
        if (!priceData) {
            return `<div class="memo-section">
                ${this.generateSectionHeading('SECTION 1: PRICE & MARKET DATA', 'priceData')}
                <p>Price data not available</p>
            </div>`;
        }

        let content = `<div class="memo-section">
            ${this.generateSectionHeading('SECTION 1: PRICE & MARKET DATA', 'priceData')}
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Period</th>
                        <th>Start Price</th>
                        <th>End Price</th>
                        <th>Change %</th>
                        <th>Max Drawdown %</th>
                        <th>Volatility %</th>
                    </tr>
                </thead>
                <tbody>`;

        if (priceData.oneYear) {
            content += `<tr>
                <td>1 Year</td>
                <td>$${priceData.oneYear.startPrice}</td>
                <td>$${priceData.oneYear.endPrice}</td>
                <td class="${parseFloat(priceData.oneYear.change) >= 0 ? 'positive' : 'negative'}">${priceData.oneYear.change}%</td>
                <td class="negative">${priceData.oneYear.maxDrawdown}%</td>
                <td>${priceData.oneYear.volatility}%</td>
            </tr>`;
        }

        if (priceData.threeYear) {
            content += `<tr>
                <td>3 Year</td>
                <td>$${priceData.threeYear.startPrice}</td>
                <td>$${priceData.threeYear.endPrice}</td>
                <td class="${parseFloat(priceData.threeYear.change) >= 0 ? 'positive' : 'negative'}">${priceData.threeYear.change}%</td>
                <td class="negative">${priceData.threeYear.maxDrawdown}%</td>
                <td>${priceData.threeYear.volatility}%</td>
            </tr>`;
        }

        if (priceData.fiveYear) {
            content += `<tr>
                <td>5 Year</td>
                <td>$${priceData.fiveYear.startPrice}</td>
                <td>$${priceData.fiveYear.endPrice}</td>
                <td class="${parseFloat(priceData.fiveYear.change) >= 0 ? 'positive' : 'negative'}">${priceData.fiveYear.change}%</td>
                <td class="negative">${priceData.fiveYear.maxDrawdown}%</td>
                <td>${priceData.fiveYear.volatility}%</td>
            </tr>`;
        }

        content += `</tbody></table></div>`;
        return content;
    }

    generateFinancialSnapshot(snapshot) {
        if (!snapshot || !snapshot.data || snapshot.data.length === 0) {
            return `<div class="memo-section">
                ${this.generateSectionHeading('SECTION 2: FINANCIAL SNAPSHOT', 'financialSnapshot')}
                <p>Financial data not available</p>
            </div>`;
        }

        let content = `<div class="memo-section">
            ${this.generateSectionHeading('SECTION 2: FINANCIAL SNAPSHOT (5 YEARS)', 'financialSnapshot')}
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Year</th>
                        <th>Revenue</th>
                        <th>EBITDA</th>
                        <th>Net Profit</th>
                        <th>EPS</th>
                        <th>Op Margin %</th>
                        <th>Net Margin %</th>
                    </tr>
                </thead>
                <tbody>`;

        snapshot.data.forEach((year, i) => {
            const yearLabel = snapshot.years[i] ? new Date(snapshot.years[i]).getFullYear() : `Year ${i + 1}`;
            const eps = year.eps !== undefined && year.eps !== null ? this.formatNumber(year.eps) : 'N/A';
            content += `<tr>
                <td>${yearLabel}</td>
                <td>${this.formatLargeNumber(year.revenue)}</td>
                <td>${this.formatLargeNumber(year.ebitda)}</td>
                <td>${this.formatLargeNumber(year.netIncome)}</td>
                <td>${eps}</td>
                <td>${year.operatingMargin}%</td>
                <td>${year.netMargin}%</td>
            </tr>`;
        });

        content += `</tbody></table></div>`;
        return content;
    }

    generateSegmentBreakdown(segmentData) {
        if (!segmentData || !segmentData.available) {
            return `<div class="memo-section">
                ${this.generateSectionHeading('SECTION 3: SEGMENT & REVENUE BREAKDOWN', 'segmentBreakdown')}
                <p>${segmentData?.message || 'Segment data not available'}</p>
            </div>`;
        }

        return `<div class="memo-section">
            ${this.generateSectionHeading('SECTION 3: SEGMENT & REVENUE BREAKDOWN', 'segmentBreakdown')}
            <p>Segment data will be displayed here once available</p>
        </div>`;
    }

    generateFinancialRatiosTable(ratios) {
        if (!ratios || !ratios.data || ratios.data.length === 0) {
            return `<div class="memo-section">
                ${this.generateSectionHeading('SECTION 4: KEY FINANCIAL RATIOS', 'financialRatios')}
                <p>Financial ratios not available</p>
            </div>`;
        }

        let content = `<div class="memo-section">
            ${this.generateSectionHeading('SECTION 4: KEY FINANCIAL RATIOS', 'financialRatios')}
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Year</th>
                        <th>ROE %</th>
                        <th>ROA %</th>
                        <th>ROCE %</th>
                        <th>Debt/Equity</th>
                        <th>Current Ratio</th>
                        <th>Free Cash Flow</th>
                    </tr>
                </thead>
                <tbody>`;

        ratios.data.forEach((year, i) => {
            const yearLabel = ratios.years[i] ? new Date(ratios.years[i]).getFullYear() : `Year ${i + 1}`;
            content += `<tr>
                <td>${yearLabel}</td>
                <td>${this.formatRatio(year.roe)}</td>
                <td>${this.formatRatio(year.roa)}</td>
                <td>${this.formatRatio(year.roce)}</td>
                <td>${this.formatRatio(year.debtToEquity)}</td>
                <td>${this.formatRatio(year.currentRatio)}</td>
                <td>${this.formatLargeNumber(year.freeCashFlow)}</td>
            </tr>`;
        });

        content += `</tbody></table></div>`;
        return content;
    }

    generateBusinessSnapshot(snapshot) {
        let content = `<div class="memo-section">
            ${this.generateSectionHeading('SECTION 5: BUSINESS SNAPSHOT', 'businessSnapshot')}
            <ul>`;

        if (snapshot && snapshot.length > 0) {
            snapshot.forEach(item => {
                content += `<li>${item}</li>`;
            });
        } else {
            for (let i = 0; i < 4; i++) {
                content += `<li>Not disclosed</li>`;
            }
        }

        content += '</ul></div>';
        return content;
    }

    generateWhyThisCOULDWork(thesisPoints) {
        let content = `<div class="memo-section">
            ${this.generateSectionHeading('SECTION 6: WHY THIS COULD WORK (MANAGEMENT-SUPPORTED)', 'whyThisCouldWork')}
            <ul>`;

        if (thesisPoints && thesisPoints.length > 0) {
            thesisPoints.slice(0, 3).forEach(point => {
                const evidenceClass = `evidence-${point.evidenceStrength.toLowerCase()}`;
                content += `<li>${point.claim} <span class="evidence-tag ${evidenceClass}">${point.evidenceStrength}</span></li>`;
            });

            for (let i = thesisPoints.length; i < 3; i++) {
                content += `<li>Not disclosed <span class="evidence-tag evidence-weak">Weak</span></li>`;
            }
        } else {
            for (let i = 0; i < 3; i++) {
                content += `<li>Not disclosed <span class="evidence-tag evidence-weak">Weak</span></li>`;
            }
        }

        content += '</ul></div>';
        return content;
    }

    generateKeyRisks(risks) {
        let content = `<div class="memo-section">
            ${this.generateSectionHeading('SECTION 7: KEY RISKS (COMPANY-DISCLOSED)', 'keyRisks')}
            <ul>`;

        if (risks && risks.length > 0) {
            risks.slice(0, 5).forEach(risk => {
                content += `<li>${risk}</li>`;
            });

            for (let i = risks.length; i < 5; i++) {
                content += `<li>Not disclosed</li>`;
            }
        } else {
            for (let i = 0; i < 5; i++) {
                content += `<li>Not disclosed</li>`;
            }
        }

        content += '</ul></div>';
        return content;
    }

    generateValuationContext(metrics, sanity) {
        let content = `<div class="memo-section">
            ${this.generateSectionHeading('SECTION 8: VALUATION CONTEXT', 'valuationMetrics')}`;

        if (metrics && (metrics.currentPE || metrics.priceToBook || metrics.priceToSales || metrics.evToEbitda)) {
            content += `<table class="data-table">
                <thead>
                    <tr>
                        <th>Metric</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Current P/E</td>
                        <td>${this.formatRatio(metrics.currentPE)}</td>
                    </tr>
                    <tr>
                        <td>Forward P/E</td>
                        <td>${this.formatRatio(metrics.forwardPE)}</td>
                    </tr>
                    <tr>
                        <td>Price to Book (P/B)</td>
                        <td>${this.formatRatio(metrics.priceToBook)}</td>
                    </tr>
                    <tr>
                        <td>Price to Sales (P/S)</td>
                        <td>${this.formatRatio(metrics.priceToSales)}</td>
                    </tr>
                    <tr>
                        <td>EV/EBITDA</td>
                        <td>${this.formatRatio(metrics.evToEbitda)}</td>
                    </tr>
                </tbody>
            </table>`;
        } else {
            content += `<p>Valuation metrics not available</p>`;
        }

        if (sanity) {
            content += `<p><strong>Assessment:</strong> ${sanity.assessment || 'Not disclosed'}</p>`;
            content += `<p>${sanity.reasoning || ''}</p>`;
        }

        content += '</div>';
        return content;
    }

    generateJudgmentSupport(judgment) {
        const bq = judgment?.businessQuality || { level: 'Medium', reasoning: 'Not disclosed' };
        const es = judgment?.evidenceStrength || { level: 'Medium', reasoning: 'Not disclosed' };
        const ul = judgment?.uncertaintyLevel || { level: 'Medium', reasoning: 'Not disclosed' };

        return `<div class="memo-section">
            ${this.generateSectionHeading('SECTION 9: JUDGMENT SUPPORT (NON-ADVISORY)', 'judgmentSupport')}
            <div class="judgment-grid">
                <div class="judgment-item">
                    <div class="judgment-label">Business Quality</div>
                    <div class="judgment-value">${bq.level}</div>
                    <div class="judgment-description">${bq.reasoning}</div>
                </div>
                <div class="judgment-item">
                    <div class="judgment-label">Evidence Strength</div>
                    <div class="judgment-value">${es.level}</div>
                    <div class="judgment-description">${es.reasoning}</div>
                </div>
                <div class="judgment-item">
                    <div class="judgment-label">Uncertainty Level</div>
                    <div class="judgment-value">${ul.level}</div>
                    <div class="judgment-description">${ul.reasoning}</div>
                </div>
            </div>
        </div>`;
    }

    generateValidationNeeds(validationNeeds) {
        let content = `<div class="memo-section">
            ${this.generateSectionHeading('SECTION 10: WHAT NEEDS VALIDATION NEXT', 'validationNeeds')}
            <ul>`;

        if (validationNeeds && validationNeeds.length > 0) {
            validationNeeds.slice(0, 3).forEach(item => {
                content += `<li>${item}</li>`;
            });

            for (let i = validationNeeds.length; i < 3; i++) {
                content += `<li>Not disclosed</li>`;
            }
        } else {
            for (let i = 0; i < 3; i++) {
                content += `<li>Not disclosed</li>`;
            }
        }

        content += '</ul></div>';
        return content;
    }

    generateNarrativeContext(narrative) {
        let content = `<div class="memo-section">
            ${this.generateSectionHeading('SECTION 11: NEWS & RECENT EVENTS', 'narrativeContext')}`;

        if (narrative && narrative.length > 0) {
            content += '<ul>';
            narrative.forEach(item => {
                content += `<li>${item}</li>`;
            });
            content += '</ul>';
        } else {
            content += '<p>No recent news available</p>';
        }

        content += '</div>';
        return content;
    }

    generateDisclaimer() {
        return `<div class="disclaimer">
            <strong>DISCLAIMER:</strong> This report is an analytical research aid generated using publicly available information. It does not constitute investment advice.
        </div>`;
    }

    // Utility: Format ratio values
    formatRatio(value) {
        if (value === null || value === undefined || value === 'Not disclosed' || value === 'N/A') {
            return 'N/A';
        }
        const num = parseFloat(value);
        if (isNaN(num)) return 'N/A';
        return num.toFixed(2);
    }

    // Utility: Format regular numbers
    formatNumber(value) {
        if (value === null || value === undefined || value === 'Not disclosed') {
            return 'N/A';
        }
        const num = parseFloat(value);
        if (isNaN(num)) return 'N/A';
        return num.toFixed(2);
    }

    // Utility: Format large numbers
    formatLargeNumber(value) {
        if (value === null || value === undefined || value === 'Not disclosed') {
            return 'N/A';
        }

        const num = parseFloat(value);
        if (isNaN(num)) return 'N/A';

        if (Math.abs(num) >= 1e12) {
            return `$${(num / 1e12).toFixed(2)}T`;
        } else if (Math.abs(num) >= 1e9) {
            return `$${(num / 1e9).toFixed(2)}B`;
        } else if (Math.abs(num) >= 1e6) {
            return `$${(num / 1e6).toFixed(2)}M`;
        } else {
            return `$${num.toFixed(2)}`;
        }
    }

    // Plain text export
    generatePlainText(company, researchData) {
        let text = `${company.name} | ${company.exchange} | ${company.sector}\\n`;
        text += `StockMemo — Analytical Research Report\\n`;
        text += `${'='.repeat(60)}\\n\\n`;

        // Add sections in order...
        text += `DISCLAIMER: This report is analytical research aid. Not investment advice.\\n`;

        return text;
    }
}
