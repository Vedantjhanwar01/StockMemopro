// HYBRID: Real Financial Data (FMP) + AI Analysis (Groq)
// FMP provides numbers, Groq provides interpretation

const FMPClient = require('./fmp-client.js');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { companyName, exchange } = req.body;

  if (!companyName) {
    return res.status(400).json({ error: 'Company name is required' });
  }

  const fmpApiKey = process.env.FMP_API_KEY;
  const groqApiKey = process.env.GROQ_API_KEY;

  if (!fmpApiKey || !groqApiKey) {
    return res.status(500).json({ error: 'API keys not configured' });
  }

  try {
    // Step 1: Determine stock symbol
    const symbol = await resolveSymbol(companyName, exchange, fmpApiKey);

    // Step 2: Fetch ALL financial data from FMP
    const fmpClient = new FMPClient(fmpApiKey);
    const financialData = await fmpClient.getAllFinancialData(symbol);

    if (!financialData || !financialData.profile) {
      return res.status(404).json({
        error: 'Company not found in FMP database',
        suggestion: 'Try a different company or check symbol format'
      });
    }

    // Step 3: Process and structure the data
    const structuredData = structureFinancialData(financialData);

    // Step 4: Get AI qualitative analysis
    const aiAnalysis = await getAIAnalysis(
      financialData.profile,
      structuredData,
      groqApiKey
    );

    // Step 5: Combine FMP numbers + AI analysis
    const fullReport = {
      company: {
        name: financialData.profile.companyName,
        symbol: financialData.profile.symbol,
        exchange: financialData.profile.exchangeShortName,
        sector: financialData.profile.sector,
        industry: financialData.profile.industry
      },
      research: {
        // Real numbers from FMP
        priceData: structuredData.priceData,
        financialSnapshot: structuredData.financialSnapshot,
        segmentBreakdown: structuredData.segmentBreakdown,
        financialRatios: structuredData.financialRatios,
        valuationMetrics: structuredData.valuationMetrics,

        // AI analysis
        priceContext: aiAnalysis.priceContext,
        financialStructure: aiAnalysis.financialStructure,
        businessSnapshot: aiAnalysis.businessSnapshot,
        whyThisCOULDWork: aiAnalysis.whyThisCOULDWork,
        keyRisks: aiAnalysis.keyRisks,
        valuationSanity: aiAnalysis.valuationSanity,
        judgmentSupport: aiAnalysis.judgmentSupport,
        validationNeeds: aiAnalysis.validationNeeds,
        narrativeContext: aiAnalysis.narrativeContext
      }
    };

    return res.status(200).json({
      success: true,
      data: fullReport
    });

  } catch (error) {
    console.error('Research failed:', error);
    return res.status(500).json({
      error: 'Failed to generate memo',
      details: error.message
    });
  }
}

/**
 * Resolve company name to stock symbol
 */
async function resolveSymbol(companyName, exchange, apiKey) {
  // Common Indian stock symbols
  const indianStocks = {
    'reliance': 'RELIANCE.NS',
    'tcs': 'TCS.NS',
    'infosys': 'INFY.NS',
    'hdfc bank': 'HDFCBANK.NS',
    'icici bank': 'ICICIBANK.NS',
    'wipro': 'WIPRO.NS',
    'bharti airtel': 'BHARTIARTL.NS',
    'itc': 'ITC.NS',
    'sun pharma': 'SUNPHARMA.NS',
    'asian paints': 'ASIANPAINT.NS'
  };

  const normalized = companyName.toLowerCase().trim();

  // Check if it's a known Indian stock
  if (indianStocks[normalized]) {
    return indianStocks[normalized];
  }

  // Try searching FMP
  try {
    const searchUrl = `https://financialmodelingprep.com/api/v3/search?query=${encodeURIComponent(companyName)}&limit=5&apikey=${apiKey}`;
    const response = await fetch(searchUrl);
    const results = await response.json();

    if (results && results.length > 0) {
      // Prefer NSE for Indian stocks
      if (exchange === 'NSE') {
        const nseStock = results.find(r => r.symbol.endsWith('.NS'));
        if (nseStock) return nseStock.symbol;
      }

      // Return first match
      return results[0].symbol;
    }
  } catch (error) {
    console.error('Symbol search error:', error);
  }

  // Fallback: assume it's already a symbol
  return companyName;
}

/**
 * Structure financial data for display
 */
function structureFinancialData(data) {
  return {
    priceData: data.prices,
    financialSnapshot: extractFinancialSnapshot(data.incomeStatement),
    segmentBreakdown: extractSegmentBreakdown(data.incomeStatement, data.profile),
    financialRatios: extractFinancialRatios(data.ratios, data.cashFlow),
    valuationMetrics: extractValuationMetrics(data.keyMetrics, data.profile)
  };
}

function extractFinancialSnapshot(incomeStatements) {
  if (!incomeStatements || incomeStatements.length === 0) {
    return { years: [], data: [] };
  }

  return {
    years: incomeStatements.slice(0, 5).map(s => s.date),
    data: incomeStatements.slice(0, 5).map(s => ({
      revenue: s.revenue,
      ebitda: s.ebitda,
      netIncome: s.netIncome,
      operatingMargin: ((s.operatingIncome / s.revenue) * 100).toFixed(2),
      netMargin: ((s.netIncome / s.revenue) * 100).toFixed(2)
    }))
  };
}

function extractSegmentBreakdown(incomeStatements, profile) {
  // FMP doesn't provide segment data directly
  // Return placeholder structure
  return {
    available: false,
    message: 'Segment data not available from FMP API'
  };
}

function extractFinancialRatios(ratios, cashFlows) {
  if (!ratios || ratios.length === 0) {
    return { years: [], data: [] };
  }

  return {
    years: ratios.slice(0, 5).map(r => r.date),
    data: ratios.slice(0, 5).map((r, i) => ({
      roe: (r.returnOnEquity * 100).toFixed(2),
      roce: 'Not disclosed', // FMP doesn't have ROCE directly
      debtToEquity: r.debtEquityRatio?.toFixed(2) || 'Not disclosed',
      interestCoverage: r.interestCoverage?.toFixed(2) || 'Not disclosed',
      freeCashFlow: cashFlows[i]?.freeCashFlow || 'Not disclosed'
    }))
  };
}

function extractValuationMetrics(keyMetrics, profile) {
  if (!keyMetrics || keyMetrics.length === 0) {
    return {
      currentPE: profile?.pe?.toFixed(2) || 'Not disclosed',
      historicalAvgPE: 'Not disclosed',
      sectorAvgPE: 'Not disclosed'
    };
  }

  const peRatios = keyMetrics.map(m => m.peRatio).filter(p => p && p > 0);
  const avgPE = peRatios.length > 0
    ? (peRatios.reduce((a, b) => a + b, 0) / peRatios.length).toFixed(2)
    : 'Not disclosed';

  return {
    currentPE: profile?.pe?.toFixed(2) || keyMetrics[0]?.peRatio?.toFixed(2) || 'Not disclosed',
    historicalAvgPE: avgPE,
    sectorAvgPE: 'Not disclosed' // Would need separate API call
  };
}

/**
 * Get AI analysis using Groq
 */
async function getAIAnalysis(profile, structuredData, groqApiKey) {
  const prompt = `You are analyzing ${profile.companyName} (${profile.symbol}).

FINANCIAL DATA PROVIDED:
${JSON.stringify(structuredData, null, 2)}

Based on this REAL financial data, provide analytical interpretation in JSON format (no markdown):

{
  "priceContext": {
    "trend": "Neutral description of price trends based on the data provided",
    "volatility": "Assessment based on volatility number"
  },
  "financialStructure": {
    "description": "Analytical description of revenue/margin trends from the 5-year data",
    "segments": []
  },
  "businessSnapshot": [
    "Factual bullet 1 about ${profile.companyName}",
    "Factual bullet 2",
    "Factual bullet 3",
    "Factual bullet 4"
  ],
  "whyThisCOULDWork": [
    {"claim": "Management claim 1", "evidenceStrength": "Strong"},
    {"claim": "Management claim 2", "evidenceStrength": "Moderate"},
    {"claim": "Management claim 3", "evidenceStrength": "Weak"}
  ],
  "keyRisks": [
    "Risk 1", "Risk 2", "Risk 3", "Risk 4", "Risk 5"
  ],
  "valuationSanity": {
    "assessment": "Based on P/E data: Cheap/Inline/Premium",
    "reasoning": "Brief explanation using the numbers"
  },
  "judgmentSupport": {
    "businessQuality": {"level": "High/Medium/Low", "reasoning": "Based on margins/ROE"},
    "evidenceStrength": {"level": "High/Medium/Low", "reasoning": "Data quality assessment"},
    "uncertaintyLevel": {"level": "High/Medium/Low", "reasoning": "Based on volatility/trends"}
  },
  "validationNeeds": [
    "Validation 1", "Validation 2", "Validation 3"
  ],
  "narrativeContext": [
    "Recent development 1", "Recent development 2", "Recent development 3"
  ]
}

RULES:
- Reference the numerical data where applicable
- EXACTLY 4 business snapshot bullets
- EXACTLY 3 whyThisCOULDWork with evidence tags
- EXACTLY 5 keyRisks
- NO predictions, NO recommendations`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${groqApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You are a financial analyst. Return ONLY valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 4000
    })
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status}`);
  }

  const data = await response.json();
  let aiResponse = data.choices[0].message.content.trim();

  // Remove markdown if present
  if (aiResponse.startsWith('```')) {
    aiResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  }

  return JSON.parse(aiResponse);
}
