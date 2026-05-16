import type { Paper } from "./types";

export interface SubjectDefinition {
  id: string;
  label: string;
  /** Case-insensitive substring or regex tests against title (and abstract when present). */
  patterns: (string | RegExp)[];
}

/** Curated topic buckets for quick scanning; heuristic matching on title/text. */
export const SUBJECT_DEFINITIONS: SubjectDefinition[] = [
  {
    id: "autism",
    label: "Autism",
    patterns: [
      /\basd\b/i,
      /autis/i,
      /asperger/i,
      /spectrum disorder/i,
      /neurodevelopment/i,
    ],
  },
  {
    id: "adhd",
    label: "ADHD",
    patterns: [
      /\badhd\b/i,
      /attention[- ]deficit/i,
      /hyperactiv/i,
    ],
  },
  {
    id: "depression",
    label: "Depression",
    patterns: [
      /depress/i,
      /\bmdd\b/i,
      /major depressive/i,
      /mood disorder/i,
      /dysthym/i,
    ],
  },
  {
    id: "anxiety",
    label: "Anxiety",
    patterns: [
      /anxiet/i,
      /generalized anxiety/i,
      /gad\b/i,
      /panic disorder/i,
      /phobia/i,
    ],
  },
  {
    id: "ptsd",
    label: "PTSD / trauma",
    patterns: [
      /ptsd\b/i,
      /post[- ]?traumatic/i,
      /trauma\b/i,
      /complex ptsd/i,
    ],
  },
  {
    id: "eating",
    label: "Eating disorders",
    patterns: [
      /anorexia/i,
      /bulim/i,
      /arfid/i,
      /eating disorder/i,
      /binge eating/i,
    ],
  },
  {
    id: "substance",
    label: "Substance use",
    patterns: [
      /substance/i,
      /opioid/i,
      /\baud\b/i,
      /alcohol/i,
      /cannabis/i,
      /addiction/i,
      /\bsud\b/i,
    ],
  },
  {
    id: "psychosis",
    label: "Psychosis",
    patterns: [/schizophren/i, /psychosi/i, /psychotic/i],
  },
  {
    id: "bipolar",
    label: "Bipolar",
    patterns: [/bipolar/i, /mania/i, /manic\b/i],
  },
  {
    id: "ocd",
    label: "OCD",
    patterns: [/ocd\b/i, /obsessive[- ]compulsi/i],
  },
  {
    id: "child_adolescent",
    label: "Child / adolescent focus",
    patterns: [
      /child\b/i,
      /adolesc/i,
      /\byouth\b/i,
      /teen/i,
      /pediatric/i,
      /school[- ]age/i,
    ],
  },
];

export function inferSubjectIds(paper: Paper): string[] {
  const text = `${paper.title}\n${paper.abstract ?? ""}`.toLowerCase();
  const matched: string[] = [];
  for (const def of SUBJECT_DEFINITIONS) {
    const ok = def.patterns.some((p) =>
      typeof p === "string" ? text.includes(p.toLowerCase()) : p.test(text)
    );
    if (ok) matched.push(def.id);
  }
  return matched;
}

export function subjectLabel(id: string): string {
  return SUBJECT_DEFINITIONS.find((s) => s.id === id)?.label ?? id;
}
