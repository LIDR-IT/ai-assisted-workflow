import { describe, it, expect } from 'vitest';
import { ecosystemStats, automationStats, summaryStrings } from '../simple-stats';

describe('simple-stats', () => {
  describe('ecosystemStats', () => {
    it('has correct base counts', () => {
      // Post-merge BMAD + LIDR Spec Lifecycle, synced to filesystem reality
      // (.agents/skills, .agents/commands, .agents/rules, .agents/subagents):
      // - skills: 38 LIDR + 69 BMAD = 107 (matches `.agents/skills/`)
      //   (2026-06-12 consolidation dropped LIDR 44→38: 4 meta skills folded into
      //   lidr-agents-architecture, lidr-ticket-validation → lidr-refinement-notes,
      //   lidr-commit-management → process/git-workflow.md rule + /lidr-commit)
      // - commands: 24 LIDR + 6 generic = 30 (matches `.agents/commands/`)
      // - rules: 7 LIDR SDLC + 17 generic = 24
      // - mcps: context7, playwright, chrome-devtools = 3
      // - hooks: 3 LIDR + 3 generic = 6
      // - agents: 10 LIDR workers (BMad personas are skills since 2026-06-11, ADR-0008)
      expect(ecosystemStats.skills).toBe(107);
      expect(ecosystemStats.automatedSkills).toBe(8);
      expect(ecosystemStats.commands).toBe(30);
      expect(ecosystemStats.rules).toBe(24);
      expect(ecosystemStats.mcps).toBe(3);
      expect(ecosystemStats.hooks).toBe(6);
      expect(ecosystemStats.agents).toBe(10);
      expect(ecosystemStats.docsSupport).toBe(44);
      expect(ecosystemStats.validationScripts).toBe(31);
    });

    it('has eliminated counts set to zero', () => {
      expect(ecosystemStats.templates).toBe(0);
      expect(ecosystemStats.checklists).toBe(0);
      expect(ecosystemStats.signoffs).toBe(0);
    });

    it('has correct SDLC structure counts', () => {
      expect(ecosystemStats.gates).toBe(8); // Gates G0-G7
      expect(ecosystemStats.phases).toBe(5); // Unified Phases 0-4 (legacy 0-8 survive as stages)
    });

    it('has correct command tier breakdown', () => {
      expect(ecosystemStats.orchestratorCommands).toBe(9);
      expect(ecosystemStats.tacticalCommands).toBe(19);
      expect(ecosystemStats.utilityCommands).toBe(2);

      // 9 + 19 + 2 = 30 (matches `.agents/commands/`)
      const totalBasicCommands =
        ecosystemStats.orchestratorCommands +
        ecosystemStats.tacticalCommands +
        ecosystemStats.utilityCommands;

      expect(totalBasicCommands).toBe(30);
    });

    it('calculates totalArtifacts correctly', () => {
      const expected =
        ecosystemStats.skills +
        ecosystemStats.commands +
        ecosystemStats.rules +
        ecosystemStats.mcps +
        ecosystemStats.hooks +
        ecosystemStats.agents +
        ecosystemStats.docsSupport +
        ecosystemStats.validationScripts;

      expect(ecosystemStats.totalArtifacts).toBe(expected);
    });

    it('calculates totalWorkflowArtifacts correctly', () => {
      const expected =
        ecosystemStats.skills +
        ecosystemStats.commands +
        ecosystemStats.hooks +
        ecosystemStats.agents;

      expect(ecosystemStats.totalWorkflowArtifacts).toBe(expected);
    });

    it('totalArtifacts is greater than 100', () => {
      expect(ecosystemStats.totalArtifacts).toBeGreaterThan(100);
    });

    it('has more skills than commands', () => {
      expect(ecosystemStats.skills).toBeGreaterThan(ecosystemStats.commands);
    });
  });

  describe('automationStats', () => {
    it('returns correct skill counts', () => {
      expect(automationStats.totalSkills).toBe(ecosystemStats.skills);
      expect(automationStats.automatedSkills).toBe(ecosystemStats.automatedSkills);
    });

    it('calculates manual skills correctly', () => {
      const expectedManual = ecosystemStats.skills - ecosystemStats.automatedSkills;
      expect(automationStats.manualSkills).toBe(expectedManual);
    });

    it('calculates automation percentage correctly', () => {
      const expectedPercentage = Math.round(
        (ecosystemStats.automatedSkills / ecosystemStats.skills) * 100
      );
      expect(automationStats.automationPercentage).toBe(expectedPercentage);
    });

    it('automation percentage is between 0 and 100', () => {
      expect(automationStats.automationPercentage).toBeGreaterThanOrEqual(0);
      expect(automationStats.automationPercentage).toBeLessThanOrEqual(100);
    });

    it('calculates estimated hours saved per sprint correctly', () => {
      const expectedHours = Math.round(775 / 26);
      expect(automationStats.estimatedHoursSavedPerSprint).toBe(expectedHours);
    });

    it('has realistic hours saved per sprint', () => {
      // Should be around 30 hours per sprint (775/26)
      expect(automationStats.estimatedHoursSavedPerSprint).toBeGreaterThan(20);
      expect(automationStats.estimatedHoursSavedPerSprint).toBeLessThan(40);
    });

    it('returns correct ROI hours per year', () => {
      expect(automationStats.estimatedHoursSavedPerYear).toBe(775);
    });

    it('has significant automation ROI', () => {
      expect(automationStats.estimatedHoursSavedPerYear).toBeGreaterThan(500);
    });
  });

  describe('summaryStrings', () => {
    it('generates correct skills standardized string', () => {
      expect(summaryStrings.skillsStandardized).toBe(
        `${ecosystemStats.skills} skills estandarizados`
      );
    });

    it('generates correct templates count string', () => {
      expect(summaryStrings.templatesCount).toBe(`${ecosystemStats.templates} templates`);
    });

    it('generates correct artifacts operational string', () => {
      expect(summaryStrings.artifactsOperational).toBe(
        `${ecosystemStats.totalArtifacts} artefactos operativos`
      );
    });

    it('generates correct ecosystem title', () => {
      expect(summaryStrings.ecosystemTitle).toBe(
        `Ecosistema: ${ecosystemStats.totalArtifacts}+ artefactos`
      );
    });

    it('generates correct searchable artifacts string', () => {
      expect(summaryStrings.searchableArtifacts).toBe(
        `${ecosystemStats.totalWorkflowArtifacts} artefactos buscables`
      );
    });

    it('generates correct automation ROI string', () => {
      expect(summaryStrings.automationRoi).toBe(
        `ROI: ${automationStats.estimatedHoursSavedPerYear}+ horas/año`
      );
    });

    it('generates correct automation percentage string', () => {
      expect(summaryStrings.automationPercentage).toBe(
        `${automationStats.automationPercentage}% automatizado`
      );
    });

    it('all strings are non-empty', () => {
      Object.values(summaryStrings).forEach((str) => {
        expect(str).toBeTruthy();
        expect(typeof str).toBe('string');
        expect(str.length).toBeGreaterThan(0);
      });
    });

    it('all strings contain expected keywords', () => {
      expect(summaryStrings.skillsStandardized).toContain('skills');
      expect(summaryStrings.templatesCount).toContain('templates');
      expect(summaryStrings.artifactsOperational).toContain('artefactos operativos');
      expect(summaryStrings.ecosystemTitle).toContain('Ecosistema:');
      expect(summaryStrings.searchableArtifacts).toContain('artefactos buscables');
      expect(summaryStrings.automationRoi).toContain('ROI:');
      expect(summaryStrings.automationPercentage).toContain('% automatizado');
    });
  });

  describe('Data consistency', () => {
    it('automated skills does not exceed total skills', () => {
      expect(ecosystemStats.automatedSkills).toBeLessThanOrEqual(ecosystemStats.skills);
    });

    it('manual skills calculation is consistent', () => {
      expect(automationStats.manualSkills).toBe(
        automationStats.totalSkills - automationStats.automatedSkills
      );
    });

    it('command tier breakdown matches expectations', () => {
      expect(ecosystemStats.orchestratorCommands).toBeGreaterThan(ecosystemStats.utilityCommands);
      expect(ecosystemStats.tacticalCommands).toBeGreaterThan(ecosystemStats.utilityCommands);
    });

    it('phases and gates have correct relationship', () => {
      // Unified model: 5 phases (0-4, BMad numbering) and 8 gates (G0-G7).
      // The legacy LIDR phases (0-8) survive as stages, so the old
      // phases === gates + 1 relationship no longer holds.
      expect(ecosystemStats.phases).toBe(5);
      expect(ecosystemStats.gates).toBe(8);
    });

    it('total workflow artifacts is subset of total artifacts', () => {
      expect(ecosystemStats.totalWorkflowArtifacts).toBeLessThan(ecosystemStats.totalArtifacts);
    });
  });

  describe('Realistic bounds checking', () => {
    it('has realistic ecosystem size', () => {
      expect(ecosystemStats.totalArtifacts).toBeGreaterThan(50);
      expect(ecosystemStats.totalArtifacts).toBeLessThan(500);
    });

    it('has realistic skill count', () => {
      // Post-merge BMAD, post-removal: 111 skills (42 LIDR + 69 BMAD)
      expect(ecosystemStats.skills).toBeGreaterThan(50);
      expect(ecosystemStats.skills).toBeLessThan(200);
    });

    it('has realistic automation percentage', () => {
      expect(automationStats.automationPercentage).toBeGreaterThan(5);
      expect(automationStats.automationPercentage).toBeLessThan(50);
    });
  });
});
