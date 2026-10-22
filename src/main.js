/**
 * Main Application Orchestrator
 * Integrates all 9 Dark Gaming Neon components into a cohesive,
 * high-performance developer portfolio workspace.
 */

import './style.css';

import { initParticleWave } from './components/particleWave.js';
import { initSpotlight } from './components/spotlight.js';
import { initNav } from './components/nav.js';
import { initTerminal } from './components/terminal.js';
import { initArchitectureVisualizer } from './components/architecture.js';
import { initProjects } from './components/projects.js';
import { initConstellation } from './components/constellation.js';
import { initTimeline } from './components/timeline.js';
import { initCommandPalette } from './components/commandPalette.js';
import { initBlog } from './components/blog.js';
import { initGitHub } from './components/github.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Animated 3D Cosmic Particle Wave Canvas
  initParticleWave();

  // Initialize Global Navigation & UI Handlers
  initNav();

  // Component 6: Spotlight Cursor & Neon Lighting Effects
  initSpotlight();

  // Component 7: Command Palette (Ctrl+K / Cmd+K)
  initCommandPalette();

  // Component 4: Tech Stack Constellation (Interactive Canvas & Accessible Grid)
  initConstellation();

  // Component 3: Project Showcase & 9-Section Case Studies
  initProjects();

  // Component 2: System Architecture Visualizer (ApexPulse Event Topology)
  initArchitectureVisualizer();

  // Component 5: Engineering Timeline
  initTimeline();

  // Component 8: Technical Blog & Deep Dive Reader
  initBlog();

  // Component 9: GitHub Activity & Repository Explorer (Live Sync & Fallback)
  initGitHub();

  // Component 1: Interactive Workspace Terminal
  initTerminal();
});
