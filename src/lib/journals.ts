import type { Journal } from "./types";

/** Journals / PubMed-tracked feeds (child & adolescent CAP + flagship general mental health journals). */
export const JOURNALS: Journal[] = [
  {
    id: "jaacap",
    shortLabel: "JAACAP",
    name: "Journal of the American Academy of Child & Adolescent Psychiatry",
    pubmedQuery: "J Am Acad Child Adolesc Psychiatry[journal]",
    publisher: "Elsevier / AACAP",
    impactNote: "Flagship clinical journal of AACAP",
  },
  {
    id: "jcpp",
    shortLabel: "JCPP",
    name: "Journal of Child Psychology and Psychiatry",
    pubmedQuery: "J Child Psychol Psychiatry[journal]",
    publisher: "Wiley / ACAMH",
    impactNote: "High-impact research across psychology and psychiatry",
  },
  {
    id: "ecap",
    shortLabel: "ECAP",
    name: "European Child & Adolescent Psychiatry",
    pubmedQuery: "Eur Child Adolesc Psychiatry[journal]",
    publisher: "Springer",
    impactNote: "Major European clinical and research outlet",
  },
  {
    id: "jccap",
    shortLabel: "JCCAP",
    name: "Journal of Clinical Child & Adolescent Psychology",
    pubmedQuery: "J Clin Child Adolesc Psychol[journal]",
    publisher: "Taylor & Francis / SCCAP",
    impactNote: "Evidence-based interventions and assessment",
  },
  {
    id: "camh",
    shortLabel: "CAMH",
    name: "Child and Adolescent Mental Health",
    pubmedQuery: "Child Adolesc Ment Health[journal]",
    publisher: "Wiley / ACAMH",
    impactNote: "Practical, accessible CAMH research",
  },
  {
    id: "devpsychopathol",
    shortLabel: "D&P",
    name: "Development and Psychopathology",
    pubmedQuery: "Dev Psychopathol[journal]",
    publisher: "Cambridge University Press",
    impactNote: "Developmental mechanisms of psychopathology",
  },
  {
    id: "cphd",
    shortLabel: "CPHD",
    name: "Child Psychiatry & Human Development",
    pubmedQuery: "Child Psychiatry Hum Dev[journal]",
    publisher: "Springer",
  },
  {
    id: "jcap",
    shortLabel: "JCAP",
    name: "Journal of Child and Adolescent Psychopharmacology",
    pubmedQuery: "J Child Adolesc Psychopharmacol[journal]",
    publisher: "Mary Ann Liebert",
    impactNote: "Pediatric psychopharmacology focus",
  },
  {
    id: "nejm_psych",
    shortLabel: "NEJM",
    name: "New England Journal of Medicine (psychiatry & mental health)",
    pubmedQuery:
      "(N Engl J Med[journal]) AND (Psychiatry[mh] OR mental disorders[mh])",
    publisher: "NEJM Group",
    impactNote:
      "Indexed psychiatry/MHMeSH-major articles within NEJM (not a standalone psychiatry journal)",
  },
  {
    id: "nat_ment_health",
    shortLabel: "Nat Ment Health",
    name: "Nature Mental Health",
    pubmedQuery: "Nat Ment Health[journal]",
    publisher: "Springer Nature",
  },
  {
    id: "lancet_psych",
    shortLabel: "Lancet Psych",
    name: "The Lancet Psychiatry",
    pubmedQuery: "Lancet Psychiatry[journal]",
    publisher: "Elsevier",
  },
  {
    id: "jama_psych",
    shortLabel: "JAMA Psych",
    name: "JAMA Psychiatry",
    pubmedQuery: "JAMA Psychiatry[journal]",
    publisher: "American Medical Association",
  },
];

export const PAPERS_PER_JOURNAL = 12;

export function getJournalById(id: string): Journal | undefined {
  return JOURNALS.find((j) => j.id === id);
}
