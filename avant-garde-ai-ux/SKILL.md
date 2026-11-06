---
name: avant-garde-ai-ux
description: Design and engineer post-chat generative UI, inline diff/redline workbenches, grounded citation synthesis, multi-agent execution DAGs, and streaming token choreography in TypeScript (Cursor, Linear Triage, Perplexity Pro, Claude Artifacts, v0, Raycast AI). Replaces generic "How can I help you today?" purple-sparkle chatbots with epistemic confidence telemetry, inline accept/reject diffs, and 60fps streaming stabilization.
---

# Avant-Garde AI UX (Post-Chat Generative Interfaces)

Goal: design and build AI-native software that moves beyond the 2023 "chat bubble + purple sparkle icon" cliché — interfaces with the precision of *Cursor* (inline diffs & multi-file review), *Linear Triage Intelligence* (ambient classification & confidence pills), *Perplexity Pro / Elicit* (citation-grounded synthesis matrices), and *Claude Artifacts / v0* (split-stage canvas + live reasoning trace).

## 1. Intake, Layman Translator & Multi-Screen Continuity

Extract from user request. Ask only what is blocking; otherwise expand autonomously into a studio-grade specification.

| Input | If user gives it | If missing / simple prompt |
|-------|------------------|----------------------------|
| AI Capability (drafting/editing, research/RAG, triage/classification, multi-agent workflow, code/canvas generation) | Use it | Pick the strongest post-chat paradigm for the domain (never a bare chat box) |
| Epistemic Grounding (source citations, confidence scores, diff redlines, tool-call trace) | Use it | Always include **inline source citations (`[1]`) + confidence/latency telemetry (`tabular-nums`)** |
| Polarity (Sunlit Paper for legal/medical/editorial/finance; Obsidian for code/devops/security) | Follow user choice | Match domain natural lighting via `scripts/palette.mjs [--light]` |

### 1.1 Layman-to-Studio AI Translator
When a user asks simply for *"a good-looking AI screen"*, *"an intelligent assistant for my business"*, or *"a document analysis chat"* (or in Portuguese: *"uma tela de IA bonita"*, *"um assistente inteligente"*, *"um chat para analisar documentos"*):
- **Never build an empty centered input box saying "Como posso ajudar hoje?" with 3 generic prompt cards.**
- Automatically elevate into a **2-Pane Grounded Workbench**:
  - **Left Pane (Source / Document / Dataset Canvas):** The actual artifact being analyzed or edited, with highlighted spans linked to citations and inline redline diffs (`Accept [Tab]` / `Reject [Esc]`).
  - **Right Pane (Reasoning Trace & Synthesis Copilot):** Collapsible tool-call telemetry (`3 steps · 420ms · 98.4% grounding`), structured synthesis cards with clickable `[Fonte §4.2]` badges, and a contextual command bar at the bottom.

### 1.2 Multi-Screen Continuity & Component Registry (`design-lock.mjs`)
Always run `node scripts/design-lock.mjs status <project-dir>` before starting:
- **Screen 1 (`STATUS: GREENFIELD`):** Extract reusable AI primitives (`InlineDiffCard`, `ReasoningStepTrace`, `CitationBadge`, `StreamingCommandBar`) into `components/ui/<Name>.tsx` and lock the project DNA via `node scripts/design-lock.mjs scan <project-dir> --name "<app>" --archetype "<paradigm>" --write`.
- **Screen 2..N (`STATUS: LOCKED`):** Inherit 100% of locked OKLCH tokens/fonts from `.ui-design-lock.json`, query `node scripts/design-lock.mjs find <project-dir> <keyword>` before building any widget, reuse registered components, and run `node scripts/design-lock.mjs verify <project-dir>`.

---

## 2. Anti-Slop AI UX Laws (The "Death to Purple Sparkles" Law)

Never ship these generic AI clichés:
1. **No AI "Pill / Badge Bubble Soup" (`anti-slop-pill-badge`):** Never put status labels, risk alerts, document codes, or confidence readouts inside floating pastel `border-radius: 999px` capsules ("balõezinhos" like a peach bubble saying `RISCO ALTO · EXPOSIÇÃO ILIMITADA` or `SUGESTÃO IA PRONTA`). That instantly screams AI template. Instead, use **naked monospace ledger columns**, `1px` hairline borders, `6px` solid geometric squares (`■`), and inline typographic footnote links (`§4.2`).
2. **No purple/indigo gradients or magic 4-point sparkle icons (`✨`) on every button:** AI is infrastructure, not wizardry. Use crisp typographic readouts, monospace telemetry, and domain-authentic OKLCH accents.
2. **No bare chat-thread-only layouts for structured work:** If the user is reviewing contracts, triaging tickets, analyzing finances, or editing content, chat bubbles force tedious copy-pasting. Put the artifact on stage and apply AI actions *inline*.
3. **No ungrounded assertions:** Every AI output block that summarizes data or recommends an action must expose its **epistemic provenance** — clickable source citation chips (`[§3.1]`), confidence percentage (`96.2%`), or a diff against the original state.
4. **No opaque "Thinking..." spinners:** Replace infinite spinners with a live **Reasoning / Tool-Call Step Trace** showing what index is being queried, how many chunks matched, and elapsed milliseconds (`tabular-nums`).
5. **No layout-thrashing token streams:** Streaming text must never yank the user's scroll position when they scroll up to read, and numeric readouts must never jitter horizontally.
6. **No static/dead screens (`static-dead-ui`):** Every AI interface must feature living choreography (`@keyframes`, Web Animations API `.animate()`, `requestAnimationFrame` token/metric counters, pulsing reasoning beacons, and tactile `:hover`/`:active` states) with `@media (prefers-reduced-motion: reduce)` guards.

---

## 3. Five Post-Chat AI Archetypes & Constraint Engine

### 3.1 Archetypes
1. **Inline Redline & Artifact Workbench (Cursor, Claude Artifacts, Notion AI):**
   - Split canvas: live document/code on the left with green/coral semantic diff blocks (`Accept [Tab]` / `Reject [Esc]`), structured reasoning & prompt composer on the right.
2. **Grounded Synthesis & Citation Matrix (Perplexity Pro, Elicit, Consensus):**
   - Editorial serif synthesis headlines, numbered citation pills (`[1]`, `[2]`) that highlight exact source passages on hover/click, and structured comparison tables.
3. **Ambient Triage & Confidence Ledger (Linear Triage, Superhuman, Stripe Radar):**
   - Zero-chat autonomous routing: incoming items pre-tagged with AI intent, confidence bars, suggested assignee/action, and 1-keystroke approval (`[Y] Confirm · [E] Edit`).
4. **Multi-Agent Execution DAG & Telemetry Studio (LangGraph, Devin, Vercel Workflow):**
   - Node-and-edge execution graph or vertical step timeline showing parallel sub-agents, tool inputs/outputs, token cost, and human-in-the-loop approval gates.
5. **Spatial Optical Command Bar (Raycast AI, Apple Intelligence, Dot):**
   - Floating refractive glass command bar (`backdrop-filter: blur(16px) saturate(180%)` + 1px specular rim) that morphs into an inline result card without leaving the current screen.

### 3.2 Constraint Draw
Run the constraint engine before designing:
```bash
node scripts/ai-ux-constraints.mjs 2 --domain <coding|research|triage|agents|editorial>
```

---

## 4. Epistemic Color Architecture in OKLCH

Generate base surfaces via `node scripts/palette.mjs surfaces "<brand-hex>" [--light]` and pair with semantic epistemic tokens:

```css
:root {
  /* Semantic Epistemic & Diff Tokens (Perceptually Uniform OKLCH) */
  --ai-grounded: oklch(40.0% 0.105 156.0);        /* Verified / High-Confidence Fact */
  --ai-grounded-bg: oklch(92.5% 0.035 156.0);
  --ai-speculative: oklch(54.0% 0.145 68.0);      /* Low-Confidence / Needs Human Review */
  --ai-speculative-bg: oklch(94.0% 0.045 75.0);
  --diff-add-ink: oklch(36.0% 0.110 154.0);
  --diff-add-bg: oklch(93.0% 0.042 154.0);
  --diff-del-ink: oklch(46.0% 0.165 28.0);
  --diff-del-bg: oklch(93.5% 0.040 28.0);
}
```

---

## 5. Production TypeScript Primitives

### 5.1 Inline Diff Review Block (`InlineDiffCard.tsx`)
```tsx
import React from 'react';

export interface InlineDiffCardProps {
  clauseId: string;
  title: string;
  originalText: string;
  proposedText: string;
  rationale: string;
  confidence: string;
  citation: string;
  status: 'pending' | 'accepted' | 'rejected';
  onAccept: () => void;
  onReject: () => void;
}

export function InlineDiffCard({
  clauseId,
  title,
  originalText,
  proposedText,
  rationale,
  confidence,
  citation,
  status,
  onAccept,
  onReject,
}: InlineDiffCardProps) {
  return (
    <article className="diff-card tabular-nums" aria-label={`Revisão IA ${clauseId}`}>
      <header className="diff-header">
        <span>{clauseId} // {title}</span>
        <span>CONFIANÇA {confidence} · FONTE {citation}</span>
      </header>
      {status !== 'accepted' && (
        <del className="diff-del">{originalText}</del>
      )}
      <ins className="diff-add">{status === 'rejected' ? originalText : proposedText}</ins>
      <p className="diff-rationale">{rationale}</p>
      <footer className="diff-actions">
        <button type="button" onClick={onAccept}>Aceitar Redação [Tab]</button>
        <button type="button" onClick={onReject}>Manter Original [Esc]</button>
      </footer>
    </article>
  );
}
```

---

## 6. Verification & Visual Loop

1. Run the computational AI-UX auditor and design-lock verifier:
   ```bash
   node scripts/audit-ai-ux.mjs ./src
   node scripts/design-lock.mjs verify ./src
   ```
2. Capture desktop (`1440x900`) and mobile (`390x844`) screenshots via Playwright (`--channel=msedge`), inspect visually with `read_file`, fix any layout/contrast issues, and log in `history.md`.
