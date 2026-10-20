/**
 * Component 1 — Interactive Terminal
 * Terminal-style interactive workspace supporting command execution,
 * command history navigation (Up/Down), quick action chips, and safety guards.
 */

import { CONFIG, PROJECTS, CONSTELLATION_NODES } from '../data/portfolioData.js';
import { openArchitectureDrawer } from './architecture.js';

export function initTerminal(containerId = 'terminalBody', inputId = 'terminalInput') {
  const terminalBody = document.getElementById(containerId);
  const terminalInput = document.getElementById(inputId);
  if (!terminalBody || !terminalInput) return;

  const history = [];
  let historyIndex = -1;

  const commands = {
    help: () => `
Available system commands:
  whoami      Display verified engineer profile & background
  projects    List featured architectural projects & case studies
  skills      Inspect core technologies & distributed systems stack
  arch        Explore interactive system architecture diagrams
  blog        List technical engineering articles & case analyses
  github      Show GitHub activity & public repositories
  contact     Get contact coordinates & direct channels
  clear       Clear terminal output buffer
  date        Print current system timestamp
  theme       Inspect active theme configuration
`,
    whoami: () => `
NAME:        ${CONFIG.name} (@${CONFIG.handle})
ROLE:        ${CONFIG.title}
LOCATION:    ${CONFIG.location}
STATUS:      ${CONFIG.status}
SUMMARY:     ${CONFIG.bio}
`,
    projects: () => {
      // Also scroll smoothly to projects section if desired
      const el = document.getElementById('projects');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return PROJECTS.map(p => `• [${p.category}] ${p.title} -> Tags: ${p.tags.slice(0, 4).join(', ')}`).join('\n') + 
        `\n\n(Jumped to #projects section. Type 'help' for more commands)`;
    },
    skills: () => {
      const el = document.getElementById('skills');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      const cats = {};
      CONSTELLATION_NODES.forEach(n => {
        if (!cats[n.category]) cats[n.category] = [];
        cats[n.category].push(n.name);
      });
      return Object.entries(cats)
        .map(([cat, list]) => `[${cat.toUpperCase()}]\n  ${list.join(' • ')}`)
        .join('\n\n');
    },
    arch: () => {
      openArchitectureDrawer('apexpulse-stream-engine');
      return `Opened System Architecture Visualizer side drawer for ApexPulse.\nDisplaying interactive event-driven microservices topology.\nClick any node in the visualizer to inspect latency, protocols, and data flow.`;
    },
    blog: () => {
      const el = document.getElementById('blog');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return `Targeted #blog: Articles covering Zero-Allocation Go, Consistent Hashing, and Reciprocal Rank Fusion RAG.`;
    },
    github: () => {
      const el = document.getElementById('github');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return `GitHub Integration: Active handle @${CONFIG.githubUser}. Public repositories loaded dynamically via GitHub API.`;
    },
    contact: () => {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return `
EMAIL:       ${CONFIG.email}
GITHUB:      ${CONFIG.social.github}
GITLAB:      ${CONFIG.social.gitlab}
(Jumped to #contact form below)`;
    },
    date: () => new Date().toUTCString(),
    theme: () => `ACTIVE THEME: Dark Gaming Neon // Accents: Cyan (#00E5FF), Purple (#8B5CF6), Surface: #080B12`,
    about: () => `${CONFIG.bio}\n\nFocus: High-concurrency Go services, telemetry instrumentation, Kafka stream processing.`
  };

  function appendLine(htmlContent, className = '') {
    const div = document.createElement('div');
    div.className = `terminal-line ${className}`;
    div.innerHTML = htmlContent;
    terminalBody.appendChild(div);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function executeCommand(rawCmd) {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    // Record in history
    history.push(trimmed);
    historyIndex = history.length;

    // Print command invocation
    appendLine(`<span class="prompt-user">nth@engine:~$</span> <span>${escapeHtml(trimmed)}</span>`, 'line-command');

    const args = trimmed.split(' ');
    const cmd = args[0].toLowerCase();

    if (cmd === 'clear') {
      terminalBody.innerHTML = '';
      return;
    }

    if (commands[cmd]) {
      const result = commands[cmd](args.slice(1));
      appendLine(escapeHtml(result), 'line-output output-info');
    } else {
      appendLine(`Command not found: "${escapeHtml(cmd)}". Type <span style="color:var(--accent-cyan)">help</span> to view supported commands.`, 'line-output output-error');
    }
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = terminalInput.value;
      terminalInput.value = '';
      executeCommand(val);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0 && historyIndex > 0) {
        historyIndex--;
        terminalInput.value = history[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        historyIndex++;
        terminalInput.value = history[historyIndex];
      } else {
        historyIndex = history.length;
        terminalInput.value = '';
      }
    }
  });

  // Handle quick chip clicks
  document.querySelectorAll('.quick-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) {
        executeCommand(cmd);
      }
    });
  });

  // Clear button in header
  const clearBtn = document.getElementById('termClearBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      terminalBody.innerHTML = '';
      appendLine(`Terminal cleared. Type <span style="color:var(--accent-cyan)">help</span> for available commands.`, 'line-output');
    });
  }

  // Initial welcome greeting
  appendLine(`Welcome to NTH Engineering Workspace Terminal v3.4.1`, 'line-output output-success');
  appendLine(`Type <span style="color:var(--accent-cyan);font-weight:600">help</span> to explore portfolio commands, or click any command chip below.`, 'line-output');
}

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
