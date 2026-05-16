# Child & Adolescent Psychiatry Research Dashboard

A web dashboard that aggregates the latest research papers from leading journals in child and adolescent psychiatry, using [PubMed](https://pubmed.ncbi.nlm.nih.gov/) (NCBI E-utilities).

## Journals tracked

| Abbreviation | Journal |
|--------------|---------|
| JAACAP | Journal of the American Academy of Child & Adolescent Psychiatry |
| JCPP | Journal of Child Psychology and Psychiatry |
| ECAP | European Child & Adolescent Psychiatry |
| JCCAP | Journal of Clinical Child & Adolescent Psychology |
| CAMH | Child and Adolescent Mental Health |
| D&P | Development and Psychopathology |
| CPHD | Child Psychiatry & Human Development |
| JCAP | Journal of Child and Adolescent Psychopharmacology |

## Features

- Latest papers per journal (sorted by publication date)
- Journal overview cards with paper counts
- Filter by journal
- Search by title or author
- Links to PubMed and DOI
- Hourly cache (configurable via API route)

## Requirements

- [Node.js](https://nodejs.org/) 18+ and npm

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Optional: NCBI API key

For higher rate limits, create a [NCBI API key](https://www.ncbi.nlm.nih.gov/account/settings/) and add:

```bash
# .env.local
NCBI_API_KEY=your_key_here
```

## Production

```bash
npm run build
npm start
```

## Data source

Papers are fetched from PubMed using journal-specific queries defined in `src/lib/journals.ts`. Edit that file to add or remove journals (use PubMed’s `[journal]` field syntax).

## License

MIT
