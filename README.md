# TechPulse Intelligence ⚡🛡️

> **Autonomous Daily Cybersecurity & Tech Intelligence Platform with Natural GitHub Streaks**

TechPulse Intelligence aggregates, analyzes, and archives daily high-signal technology intelligence across four core pillars:
- **🛡️ Cybersecurity**: Actively exploited CVEs & CISA KEV alerts
- **🤖 Artificial Intelligence**: Daily Hugging Face research papers & trending open-weights models
- **⚡ Developer Arsenal**: Fastest-growing open-source repositories on GitHub
- **🌐 Tech Headlines**: Macro architectural shifts and breaking engineering discussions

The intelligence is analyzed with **Google Gemini 2.5 Flash**, formatted into structured JSON and Markdown, and deployed to a **Next.js Web Dashboard** while maintaining an organic **daily GitHub contribution streak** via scheduled GitHub Actions.

---

<!-- LATEST_INTEL_START -->
## 🚨 Latest Intelligence: 2026-09-04 ![Threat](https://img.shields.io/badge/THREAT-HIGH-orange?style=flat-square) [![RSS Feed](https://img.shields.io/badge/RSS-Feed-orange?style=flat-square&logo=rss)](data/rss.xml)

> **Threat Assessment**: HIGH | **Active CVEs**: 5 | **AI Breakthroughs**: 4

### Highlights
- Security posture elevates to HIGH due to high-exploitability flaws in Starlette (CVE-2026-48710, EPSS 11.04%), Sangoma Switchvox (CVE-2026-9586, EPSS 11.85%), and JFrog Artifactory (CVE-2026-82329, EPSS 7.67%).
- Open-weight multimodal foundation models advance with major releases Qwen3.8-27B and GLM-5.3, alongside Cerebras demonstrating 1,500 tokens/sec wafer-scale inference.
- Shadcn-ui releases 'cn', achieving a 30x performance speedup for Tailwind CSS class merging while maintaining full API parity with tailwind-merge.

👉 **[Read Full Daily Intelligence Report (2026-09-04)](reports/2026/09/2026-09-04.md)** | 📡 **[Subscribe to RSS Feed](data/rss.xml)**
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
