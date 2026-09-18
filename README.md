# TechPulse Intelligence ⚡🛡️

> **Autonomous Daily Cybersecurity & Tech Intelligence Platform with Natural GitHub Streaks**

[![Live Production Dashboard](https://img.shields.io/badge/Live_Dashboard-techpulse--intel.vercel.app-00f0ff?style=flat-square&logo=vercel)](https://techpulse-intel.vercel.app)
[![Daily Streak](https://img.shields.io/badge/Streak-Automated-brightgreen?style=flat-square&logo=github)](https://github.com/Swayam-jhaa/TechPulse-Intelligence/actions)
[![RSS Feed](https://img.shields.io/badge/RSS-Feed-orange?style=flat-square&logo=rss)](data/rss.xml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

🌐 **Live Web Application**: [https://techpulse-intel.vercel.app](https://techpulse-intel.vercel.app)

TechPulse Intelligence aggregates, analyzes, and archives daily high-signal technology intelligence across four core pillars:
- **🛡️ Cybersecurity**: Actively exploited CVEs & CISA KEV alerts
- **🤖 Artificial Intelligence**: Daily Hugging Face research papers & trending open-weights models
- **⚡ Developer Arsenal**: Fastest-growing open-source repositories on GitHub
- **🌐 Tech Headlines**: Macro architectural shifts and breaking engineering discussions

The intelligence is analyzed with **Google Gemini 2.5 Flash**, formatted into structured JSON and Markdown, and deployed to a **Next.js Web Dashboard** while maintaining an organic **daily GitHub contribution streak** via scheduled GitHub Actions.

---

<!-- LATEST_INTEL_START -->
## 🚨 Latest Intelligence: 2026-09-18 ![Threat](https://img.shields.io/badge/THREAT-HIGH-orange?style=flat-square) [![RSS Feed](https://img.shields.io/badge/RSS-Feed-orange?style=flat-square&logo=rss)](data/rss.xml)

> **Threat Assessment**: HIGH | **Active CVEs**: 5 | **AI Breakthroughs**: 3

### Highlights
- Critical remote code execution risk identified in Cisco Secure Email Gateway (CVE-2026-76461) with an EPSS score of 0.02009.
- ConnectWise ScreenConnect remains a high-value target for unauthorized remote session manipulation; immediate patching is required.
- New AI research into 'length inflation' and EOS token mismatch highlights critical reliability issues in on-policy distillation workflows.

👉 **[Read Full Daily Intelligence Report (2026-09-18)](reports/2026/09/2026-09-18.md)** | 📡 **[Subscribe to RSS Feed](data/rss.xml)**
<!-- LATEST_INTEL_END -->

---

## 📚 Project Documentation System (AI Collaboration Field Guide)

This repository strictly adheres to the *AI Collaboration Field Guide* to guarantee zero amnesia, bounded permissions, and full traceability. All specifications are organized sequentially in the [`docs/`](docs/) directory:

1. [**`docs/00_BUILD_PLAN.md`**](docs/00_BUILD_PLAN.md) — Master Phased Roadmap (Phase 1 Ingestion, Phase 2 AI Brain, Phase 3 Streak & Storage, Phase 4 Web UI)
2. [**`docs/01_ARCHITECTURE.md`**](docs/01_ARCHITECTURE.md) — High-level system architecture, module boundaries, and data contracts
3. [**`docs/02_CONSTRAINTS.md`**](docs/02_CONSTRAINTS.md) — Off-limits behaviors, security rules, and architectural boundaries
4. [**`docs/03_FLOW.md`**](docs/03_FLOW.md) — Complete execution trace from API ingestion through to Web rendering
5. [**`docs/04_DECISIONS.md`**](docs/04_DECISIONS.md) — Architectural Decision Records (ADRs) with pinned model versions
6. [**`docs/05_FEATURE.md`**](docs/05_FEATURE.md) — Start-to-finish feature trace for FEAT-001
7. [**`docs/06_TEST_CHECKLIST.md`**](docs/06_TEST_CHECKLIST.md) — Verification commands and concrete expected outputs
8. [**`docs/07_ROLLBACK.md`**](docs/07_ROLLBACK.md) — Disaster recovery, rollback runbooks, and error mitigation
9. [**`docs/08_HANDOVER.md`**](docs/08_HANDOVER.md) — Living state of the project, active tasks, and 5-line handoff note

---

## 🚀 Getting Started

### 1. Requirements
- Python 3.11+
- Node.js 20+ & npm 10+
- GitHub CLI (`gh`) authenticated

### 2. Setup
```bash
# Clone and enter workspace
cd Github-automation

# Install Python dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
```

### 3. Verify System
```bash
# Run test checklist
python -m src.collectors.test_collectors
```
